(function() {
    if (!window.theInfoDB) {
        console.warn("InfoDB SQL Sandbox: Core API not found. Aborting.");
        return;
    }
    const api = window.theInfoDB;

    // ─────────────────────────────────────────────────────────────
    // 1. COMMAND DEFINITIONS (loaded from sql_cmd_list.json)
    // ─────────────────────────────────────────────────────────────
    let CMD = null;
    const FALLBACK_CMD = {
        sql_keywords: ['SELECT','FROM','WHERE','INSERT','INTO','VALUES','UPDATE','SET',
            'DELETE','LIMIT','OFFSET','LIKE','ORDER','BY','GROUP','HAVING','JOIN','INNER',
            'LEFT','RIGHT','FULL','OUTER','CROSS','ON','AS','AND','OR','NOT','NULL','IS',
            'IN','BETWEEN','EXISTS','CASE','WHEN','THEN','ELSE','END','DISTINCT','UNION',
            'ALL','INTERSECT','EXCEPT','ASC','DESC','CREATE','TABLE','DROP','ALTER','ADD',
            'COLUMN','RENAME','TO','TRUNCATE','INDEX','VIEW','PRIMARY','KEY','FOREIGN',
            'REFERENCES','UNIQUE','CHECK','DEFAULT','CONSTRAINT','AUTOINCREMENT','BEGIN',
            'COMMIT','ROLLBACK','SAVEPOINT','TRANSACTION','GRANT','REVOKE','WITH','OVER',
            'PARTITION','ROWS','RANGE','PRECEDING','FOLLOWING','UNBOUNDED','CURRENT','ROW',
            'CAST','TRUE','FALSE','IF','REPLACE','TOP','FETCH','NEXT','FIRST','ONLY','TIES',
            'TABLE','DATABASE','SCHEMA','SEQUENCE','TRIGGER','FUNCTION','PROCEDURE','USER',
            'ROLE','PRIVILEGES','GRANT','REVOKE','COMMIT','WORK','CHAIN','IMMEDIATE',
            'DEFERRED','EXCLUSIVE','LOCK','MODE','SHARE','UPDATE','NOWAIT','SKIP','LOCKED'],
        aggregate_functions: ['COUNT','SUM','AVG','MIN','MAX','GROUP_CONCAT','STRING_AGG','STDDEV','VARIANCE','MEDIAN'],
        scalar_functions: {
            string: ['UPPER','LOWER','LENGTH','SUBSTR','SUBSTRING','TRIM','LTRIM','RTRIM',
                     'REPLACE','CONCAT','INSTR','LEFT','RIGHT','REVERSE','REPLICATE','SPACE',
                     'CHAR','ASCII','UNICODE','FORMAT'],
            numeric: ['ABS','CEIL','CEILING','FLOOR','ROUND','TRUNC','SIGN','SQRT','POWER',
                      'POW','EXP','LOG','LOG10','MOD','RANDOM','RAND','PI'],
            date: ['NOW','CURRENT_DATE','CURRENT_TIME','CURRENT_TIMESTAMP','DATE','TIME',
                   'YEAR','MONTH','DAY','HOUR','MINUTE','SECOND','STRFTIME','JULIANDAY',
                   'UNIXEPOCH'],
            null: ['COALESCE','NULLIF','IFNULL','ISNULL','IF'],
            type: ['CAST','TYPEOF'],
            misc: ['PRINTF','QUOTE','HEX','RANDOMBLOB','ZEROBLOB']
        },
        operators: {
            comparison: ['=','!=','<>','>','<','>=','<=','<=>'],
            logical: ['AND','OR','NOT','XOR'],
            arithmetic: ['+','-','*','/','%','||'],
            bitwise: ['&','|','<<','>>','~'],
            pattern: ['LIKE','GLOB','REGEXP','MATCH'],
            set: ['IN','NOT IN','BETWEEN','NOT BETWEEN','EXISTS','NOT EXISTS'],
            null: ['IS NULL','IS NOT NULL']
        },
        join_types: ['INNER','LEFT','RIGHT','FULL','CROSS','LEFT OUTER','RIGHT OUTER','FULL OUTER','NATURAL'],
        data_types: ['INTEGER','INT','BIGINT','SMALLINT','TINYINT','DECIMAL','NUMERIC',
                     'FLOAT','REAL','DOUBLE','TEXT','VARCHAR','CHAR','CLOB','BLOB',
                     'BOOLEAN','BOOL','DATE','TIME','DATETIME','TIMESTAMP'],
        commands: {
            // DQL
            'SELECT':        { syntax: 'SELECT [DISTINCT] cols FROM tbl [WHERE ...] [GROUP BY ...] [HAVING ...] [ORDER BY ...] [LIMIT n]', category: 'DQL' },
            'FROM':          { syntax: 'FROM <table> [alias]', category: 'DQL' },
            'WHERE':         { syntax: 'WHERE <condition>', category: 'DQL' },
            'GROUP BY':      { syntax: 'GROUP BY col1, col2, ...', category: 'DQL' },
            'HAVING':        { syntax: 'HAVING <aggregate condition>', category: 'DQL' },
            'ORDER BY':      { syntax: 'ORDER BY col [ASC|DESC], ...', category: 'DQL' },
            'LIMIT':         { syntax: 'LIMIT n [OFFSET m]', category: 'DQL' },
            'OFFSET':        { syntax: 'OFFSET n', category: 'DQL' },
            'DISTINCT':      { syntax: 'SELECT DISTINCT col ...', category: 'DQL' },
            'UNION':         { syntax: 'SELECT ... UNION [ALL] SELECT ...', category: 'DQL' },
            'INTERSECT':     { syntax: 'SELECT ... INTERSECT SELECT ...', category: 'DQL' },
            'EXCEPT':        { syntax: 'SELECT ... EXCEPT SELECT ...', category: 'DQL' },
            'JOIN':          { syntax: 'tbl1 JOIN tbl2 ON <condition>', category: 'DQL' },
            'INNER JOIN':    { syntax: 'tbl1 INNER JOIN tbl2 ON <condition>', category: 'DQL' },
            'LEFT JOIN':     { syntax: 'tbl1 LEFT [OUTER] JOIN tbl2 ON <condition>', category: 'DQL' },
            'RIGHT JOIN':    { syntax: 'tbl1 RIGHT [OUTER] JOIN tbl2 ON <condition>', category: 'DQL' },
            'FULL JOIN':     { syntax: 'tbl1 FULL [OUTER] JOIN tbl2 ON <condition>', category: 'DQL' },
            'CROSS JOIN':    { syntax: 'tbl1 CROSS JOIN tbl2', category: 'DQL' },
            'ON':            { syntax: 'ON <join condition>', category: 'DQL' },
            'AS':            { syntax: 'expr AS alias', category: 'DQL' },

            // DML
            'INSERT':        { syntax: 'INSERT INTO tbl (cols) VALUES (...), (...)', category: 'DML' },
            'INSERT INTO':   { syntax: 'INSERT INTO tbl [(cols)] VALUES (...)', category: 'DML' },
            'VALUES':        { syntax: 'VALUES (v1, v2, ...)', category: 'DML' },
            'UPDATE':        { syntax: 'UPDATE tbl SET col = expr [WHERE ...]', category: 'DML' },
            'SET':           { syntax: 'SET col = expr [, col2 = expr2 ...]', category: 'DML' },
            'DELETE':        { syntax: 'DELETE FROM tbl [WHERE ...]', category: 'DML' },
            'DELETE FROM':   { syntax: 'DELETE FROM tbl [WHERE ...]', category: 'DML' },
            'REPLACE':       { syntax: 'REPLACE INTO tbl ... (SQLite)', category: 'DML' },

            // DDL — Tables
            'CREATE TABLE':  { syntax: 'CREATE TABLE [IF NOT EXISTS] name (col type [constraints], ...)', category: 'DDL' },
            'ALTER TABLE':   { syntax: 'ALTER TABLE name ADD|DROP|RENAME ...', category: 'DDL' },
            'DROP TABLE':    { syntax: 'DROP TABLE [IF EXISTS] name', category: 'DDL' },
            'TRUNCATE':      { syntax: 'TRUNCATE TABLE name', category: 'DDL' },
            'RENAME TABLE':  { syntax: 'RENAME TABLE old TO new', category: 'DDL' },

            // DDL — Indexes / Views
            'CREATE INDEX':  { syntax: 'CREATE [UNIQUE] INDEX name ON tbl (cols)', category: 'DDL' },
            'DROP INDEX':    { syntax: 'DROP INDEX [IF EXISTS] name', category: 'DDL' },
            'CREATE VIEW':   { syntax: 'CREATE VIEW name AS <select>', category: 'DDL' },
            'DROP VIEW':     { syntax: 'DROP VIEW [IF EXISTS] name', category: 'DDL' },

            // DDL — Other objects (accepted, no-op)
            'CREATE SCHEMA': { syntax: 'CREATE SCHEMA name', category: 'DDL' },
            'DROP SCHEMA':   { syntax: 'DROP SCHEMA name', category: 'DDL' },
            'CREATE DATABASE': { syntax: 'CREATE DATABASE name', category: 'DDL' },
            'DROP DATABASE': { syntax: 'DROP DATABASE name', category: 'DDL' },
            'CREATE SEQUENCE': { syntax: 'CREATE SEQUENCE name', category: 'DDL' },
            'DROP SEQUENCE': { syntax: 'DROP SEQUENCE name', category: 'DDL' },
            'CREATE TRIGGER': { syntax: 'CREATE TRIGGER name ...', category: 'DDL' },
            'DROP TRIGGER':  { syntax: 'DROP TRIGGER name', category: 'DDL' },
            'CREATE FUNCTION': { syntax: 'CREATE FUNCTION name(...)', category: 'DDL' },
            'DROP FUNCTION': { syntax: 'DROP FUNCTION name', category: 'DDL' },
            'CREATE PROCEDURE': { syntax: 'CREATE PROCEDURE name(...)', category: 'DDL' },
            'DROP PROCEDURE': { syntax: 'DROP PROCEDURE name', category: 'DDL' },

            // DCL
            'GRANT':         { syntax: 'GRANT <privileges> ON <object> TO <user>', category: 'DCL' },
            'REVOKE':        { syntax: 'REVOKE <privileges> ON <object> FROM <user>', category: 'DCL' },
            'CREATE USER':   { syntax: 'CREATE USER name', category: 'DCL' },
            'DROP USER':     { syntax: 'DROP USER name', category: 'DCL' },
            'CREATE ROLE':   { syntax: 'CREATE ROLE name', category: 'DCL' },
            'DROP ROLE':     { syntax: 'DROP ROLE name', category: 'DCL' },
            'ALTER USER':    { syntax: 'ALTER USER name ...', category: 'DCL' },

            // TCL
            'BEGIN':         { syntax: 'BEGIN [TRANSACTION]', category: 'TCL' },
            'COMMIT':        { syntax: 'COMMIT [WORK]', category: 'TCL' },
            'ROLLBACK':      { syntax: 'ROLLBACK [TO SAVEPOINT name]', category: 'TCL' },
            'SAVEPOINT':     { syntax: 'SAVEPOINT name', category: 'TCL' },
            'RELEASE SAVEPOINT': { syntax: 'RELEASE SAVEPOINT name', category: 'TCL' },
            'SET TRANSACTION': { syntax: 'SET TRANSACTION <mode>', category: 'TCL' },

            // Other
            'EXPLAIN':       { syntax: 'EXPLAIN <statement>', category: 'Utility' },
            'PRAGMA':        { syntax: 'PRAGMA name [= value]', category: 'Utility' },
            'SHOW':          { syntax: 'SHOW <TABLES|COLUMNS|DATABASES>', category: 'Utility' },
            'DESCRIBE':      { syntax: 'DESCRIBE <table>', category: 'Utility' }
        }
    };
    CMD = FALLBACK_CMD;

    // ─────────────────────────────────────────────────────────────
    // 2. DATABASE STATE — starts EMPTY
    // ─────────────────────────────────────────────────────────────
    let db = {};          // no initial tables
    let views = {};
    let indexes = {};
    let history = [JSON.parse(JSON.stringify(db))];
    let historyIndex = 0;
    let transaction = null;

    // ─────────────────────────────────────────────────────────────
    // 3. STYLES
    // ─────────────────────────────────────────────────────────────
    const TABLE_COLORS = ['#ef4444','#3b82f6','#10b981','#f59e0b','#8b5cf6','#ec4899','#14b8a6','#f43f5e'];
    let currentTableColors = {};
    let currentColColors = {};
    let currentValueColors = {};

    const styles = `
        .sql-view-container {
            display: flex;
            flex-direction: column;
            gap: 16px;
            width: 100%;
            height: 100%;
            contain: strict;
            position: relative;
        }
        .sql-view-header {
            font-size: 1.5rem;
            font-weight: 600;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 12px;
            letter-spacing: -0.02em;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .sql-editor-wrapper {
            position: relative;
            display: flex;
            flex-direction: column;
            border: 1px solid var(--border-color);
            border-radius: 6px;
            background-color: var(--panel-bg);
            overflow: hidden;
            flex-shrink: 0;
        }
        .sql-editor-toolbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 12px;
            border-bottom: 1px solid var(--border-color);
            background-color: rgba(0,0,0,0.1);
            flex-wrap: wrap;
            gap: 8px;
        }
        .sql-editor-toolbar span {
            font-size: 0.8rem;
            font-weight: 500;
            color: var(--text-color);
            opacity: 0.7;
        }
        .sql-textarea-container {
            position: relative;
            width: 100%;
            height: 140px;
        }
        .sql-textarea, .sql-ghost-textarea {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            font-size: 0.95rem;
            padding: 12px;
            border: none;
            line-height: 1.5;
            white-space: pre-wrap;
            word-wrap: break-word;
            overflow-y: auto;
            margin: 0;
        }
        .sql-ghost-textarea {
            color: transparent;
            pointer-events: none;
            z-index: 1;
        }
        .sql-textarea {
            background: transparent;
            color: var(--text-color);
            resize: none;
            outline: none;
            z-index: 2;
        }
        .sql-btn {
            background-color: var(--accent-color);
            color: #ffffff;
            border: none;
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 0.85rem;
            font-weight: 500;
            cursor: pointer;
            transition: opacity 0.1s;
            font-family: inherit;
        }
        .sql-btn:hover { opacity: 0.9; }
        .sql-btn.secondary {
            background-color: transparent;
            color: var(--text-color);
            border: 1px solid var(--border-color);
        }
        .sql-btn.secondary:hover:not(:disabled) { background-color: rgba(128,128,128,0.1); }
        .sql-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .sql-highlight {
            background-color: color-mix(in srgb, var(--hi-color) 20%, transparent) !important;
            color: var(--hi-color) !important;
        }
        .sql-db-table-title.sql-highlight {
            background-color: color-mix(in srgb, var(--hi-color) 25%, transparent) !important;
            border-bottom: 1px solid var(--hi-color) !important;
        }
        .sql-results-container {
            flex: 0 1 200px;
            min-height: 120px;
            border: 1px solid var(--border-color);
            border-radius: 6px;
            background-color: var(--panel-bg);
            overflow: auto;
            contain: strict;
        }
        .sql-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
        .sql-table th, .sql-table td { padding: 8px 12px; border-bottom: 1px solid var(--border-color); text-align: left; }
        .sql-table th { font-weight: 600; background-color: rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 10; }
        .sql-empty-state { padding: 24px; text-align: center; color: var(--text-color); opacity: 0.5; font-size: 0.9rem; }
        .sql-tables-overview {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            overflow-y: auto;
            contain: content;
            flex: 1;
            min-height: 200px;
        }
        .sql-db-table-wrapper {
            background: var(--panel-bg);
            border: 1px solid var(--border-color);
            border-radius: 6px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            height: fit-content;
        }
        .sql-db-table-title {
            padding: 6px 12px;
            font-weight: 600;
            font-size: 0.85rem;
            background: rgba(0,0,0,0.1);
            border-bottom: 1px solid var(--border-color);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            transition: all 0.2s;
        }
        .sql-db-table-scroll { overflow: auto; flex: 1; }
        .sql-right-panel { display: none; flex-direction: column; height: 100%; gap: 16px; }
        .sql-right-panel.active { display: flex; }
        .sql-card {
            background-color: var(--panel-bg);
            border: 1px solid var(--border-color);
            border-radius: 6px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            flex-shrink: 0;
        }
        .sql-card-header {
            padding: 8px 12px;
            font-size: 0.85rem;
            font-weight: 600;
            border-bottom: 1px solid var(--border-color);
            background-color: rgba(0,0,0,0.1);
        }
        .sql-logs {
            height: 150px;
            overflow-y: auto;
            padding: 8px;
            font-family: monospace;
            font-size: 0.75rem;
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        .sql-log-entry { color: var(--text-color); opacity: 0.8; word-break: break-all; }
        .sql-log-entry.error { color: #ef4444; opacity: 1; }
        .sql-log-entry.success { color: #22c55e; opacity: 1; }

        /* ── COMPACT REFERENCE LIST WITH VERTICAL SCROLL ── */
        .sql-reference {
            padding: 6px;
            overflow-y: auto;
            overflow-x: hidden;
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 2px;
            scrollbar-width: thin;
            scrollbar-color: var(--border-color) transparent;
        }
        .sql-reference::-webkit-scrollbar { width: 8px; }
        .sql-reference::-webkit-scrollbar-track { background: transparent; }
        .sql-reference::-webkit-scrollbar-thumb {
            background: var(--border-color);
            border-radius: 4px;
        }
        .sql-reference::-webkit-scrollbar-thumb:hover {
            background: var(--accent-color);
        }

        .sql-ref-group {
            font-size: 0.65rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: var(--text-color);
            opacity: 0.45;
            padding: 8px 6px 4px 6px;
            position: sticky;
            top: 0;
            background: var(--panel-bg);
            z-index: 2;
            border-bottom: 1px solid var(--border-color);
            margin-bottom: 2px;
        }
        .sql-ref-group:first-child { padding-top: 4px; }

        .sql-ref-item {
            display: flex;
            flex-direction: column;
            padding: 3px 6px;
            background: transparent;
            border: 1px solid transparent;
            border-radius: 3px;
            cursor: pointer;
            transition: background 0.08s, border-color 0.08s;
            user-select: none;
            line-height: 1.2;
        }
        .sql-ref-item:hover {
            background: rgba(128,128,128,0.12);
            border-color: var(--accent-color);
        }
        .sql-ref-cmd {
            font-size: 0.72rem;
            font-family: 'Consolas', 'Monaco', monospace;
            color: var(--accent-color);
            font-weight: 600;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .sql-ref-desc {
            font-size: 0.65rem;
            color: var(--text-color);
            opacity: 0.55;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-top: 1px;
        }

        .sql-b-input { padding:6px; border:1px solid var(--border-color); background:transparent; color:var(--text-color); border-radius:4px; font-family:inherit; outline:none; width:100%; box-sizing:border-box; }
    `;
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);

    // ─────────────────────────────────────────────────────────────
    // 4. UI SETUP
    // ─────────────────────────────────────────────────────────────
    const sidebarEntry = document.createElement('div');
    sidebarEntry.className = 'settings-row';
    sidebarEntry.innerHTML = `<span>SQL Sandbox</span>`;

    const centerView = document.createElement('div');
    centerView.className = 'center-view hidden sql-view-container';
    centerView.id = 'sql-view';
    centerView.innerHTML = `
        <div class="sql-view-header">SQL Sandbox</div>
        <div class="sql-editor-wrapper">
            <div class="sql-editor-toolbar">
                <span>query.sql</span>
                <div style="display:flex; gap: 8px; flex-wrap: wrap;">
                    <button class="sql-btn secondary" id="sql-undo-btn" disabled>Undo</button>
                    <button class="sql-btn secondary" id="sql-redo-btn" disabled>Redo</button>
                    <button class="sql-btn secondary" id="sql-create-btn">Create DB</button>
                    <button class="sql-btn secondary" id="sql-random-btn">Random DB</button>
                    <button class="sql-btn secondary" id="sql-close-btn">Close DB</button>
                    <button class="sql-btn" id="sql-run-btn" title="Execute Query (Ctrl+Enter)">Execute Run</button>
                </div>
            </div>
            <div class="sql-textarea-container">
                <div id="sql-ghost" class="sql-ghost-textarea"></div>
                <textarea class="sql-textarea" id="sql-input" spellcheck="false" placeholder=""></textarea>
            </div>
        </div>
        <div class="sql-results-container" id="sql-results">
            <div class="sql-empty-state">Create a database or write a query to begin.</div>
        </div>
        <div class="sql-view-header" style="font-size: 1.1rem; padding-bottom: 4px; border-bottom: none; margin-top: 8px;">Live Database State</div>
        <div class="sql-tables-overview" id="sql-tables-overview"></div>

        <div id="sql-confirm-modal" style="display:none; position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:9999; align-items:center; justify-content:center; contain:strict; border-radius:inherit;">
            <div style="background:var(--panel-bg); border:1px solid var(--border-color); border-radius:6px; padding:20px; width:300px; box-shadow:0 10px 25px rgba(0,0,0,0.5); display:flex; flex-direction:column; gap:16px;">
                <div id="sql-confirm-msg" style="font-size:0.95rem; font-weight:500;">Are you sure?</div>
                <div style="display:flex; justify-content:flex-end; gap:8px;">
                    <button class="sql-btn secondary" id="sql-confirm-no">Cancel</button>
                    <button class="sql-btn" id="sql-confirm-yes" style="background:#ef4444;">Confirm</button>
                </div>
            </div>
        </div>

        <div id="sql-builder-modal" style="display:none; position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:9999; align-items:center; justify-content:center; contain:strict; border-radius:inherit;">
            <div style="background:var(--panel-bg); border:1px solid var(--border-color); border-radius:6px; padding:20px; width:380px; box-shadow:0 10px 25px rgba(0,0,0,0.5); display:flex; flex-direction:column; gap:12px;">
                <div style="font-size:0.95rem; font-weight:600;">Custom Database Builder</div>
                <div style="display:grid; grid-template-columns: 1fr 1.5fr; gap: 8px 12px; align-items:center;">
                    <div style="font-size:0.75rem; opacity:0.7; font-weight:500;">Table 1 Name</div>
                    <div style="font-size:0.75rem; opacity:0.7; font-weight:500;">Cols 1-3 (comma separated)</div>
                    <input id="sql-b-t1" placeholder="e.g. users" class="sql-b-input">
                    <input id="sql-b-c1" placeholder="id, username, email" class="sql-b-input">
                    <div style="font-size:0.75rem; opacity:0.7; font-weight:500; margin-top:4px;">Table 2 Name</div>
                    <div style="font-size:0.75rem; opacity:0.7; font-weight:500; margin-top:4px;">Cols 1-3 (comma separated)</div>
                    <input id="sql-b-t2" placeholder="e.g. posts" class="sql-b-input">
                    <input id="sql-b-c2" placeholder="id, title, views" class="sql-b-input">
                    <div style="font-size:0.75rem; opacity:0.7; font-weight:500; margin-top:4px;">Table 3 Name</div>
                    <div style="font-size:0.75rem; opacity:0.7; font-weight:500; margin-top:4px;">Cols 1-3 (comma separated)</div>
                    <input id="sql-b-t3" placeholder="e.g. comments" class="sql-b-input">
                    <input id="sql-b-c3" placeholder="id, text, likes" class="sql-b-input">
                </div>
                <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:16px;">
                    <button class="sql-btn secondary" id="sql-b-cancel">Cancel</button>
                    <button class="sql-btn" id="sql-b-confirm" style="background:#10b981;">Build</button>
                </div>
            </div>
        </div>
    `;

    const rightPanel = document.createElement('div');
    rightPanel.className = 'sql-right-panel';
    rightPanel.id = 'sql-right-view';
    rightPanel.innerHTML = `
        <div class="sql-card" style="flex: 0 0 auto;">
            <div class="sql-card-header">Execution Logs</div>
            <div class="sql-logs" id="sql-log-container"></div>
        </div>
        <div class="sql-card" style="flex: 1 1 auto; overflow: hidden;">
            <div class="sql-card-header">SQL Reference</div>
            <div class="sql-reference" id="sql-ref-container"></div>
        </div>
    `;

    api.ui.registerElement('left-sidebar-top', sidebarEntry);
    api.ui.registerElement('content-panel', centerView);
    api.ui.registerElement('right-sidebar-top', rightPanel);

    const elements = {
        input: centerView.querySelector('#sql-input'),
        ghost: centerView.querySelector('#sql-ghost'),
        runBtn: centerView.querySelector('#sql-run-btn'),
        undoBtn: centerView.querySelector('#sql-undo-btn'),
        redoBtn: centerView.querySelector('#sql-redo-btn'),
        createBtn: centerView.querySelector('#sql-create-btn'),
        randomBtn: centerView.querySelector('#sql-random-btn'),
        closeBtn: centerView.querySelector('#sql-close-btn'),
        results: centerView.querySelector('#sql-results'),
        logContainer: rightPanel.querySelector('#sql-log-container'),
        tablesOverview: centerView.querySelector('#sql-tables-overview'),
        refContainer: rightPanel.querySelector('#sql-ref-container'),
        modalOverlay: centerView.querySelector('#sql-confirm-modal'),
        modalMsg: centerView.querySelector('#sql-confirm-msg'),
        builderModal: centerView.querySelector('#sql-builder-modal'),
        t1: centerView.querySelector('#sql-b-t1'),
        c1: centerView.querySelector('#sql-b-c1'),
        t2: centerView.querySelector('#sql-b-t2'),
        c2: centerView.querySelector('#sql-b-c2'),
        t3: centerView.querySelector('#sql-b-t3'),
        c3: centerView.querySelector('#sql-b-c3'),
        bCancel: centerView.querySelector('#sql-b-cancel'),
        bConfirm: centerView.querySelector('#sql-b-confirm')
    };

    // Forward declarations
    let dictionary = [];
    let SQL_KEYWORDS_SET = new Set((CMD.sql_keywords || []).map(k => k.toLowerCase()));
    const dbNodes = { tables: {}, cols: {}, values: {} };
    let activeHighlights = [];

    const log = (msg, type = 'info') => {
        if (!elements.logContainer) return;
        const div = document.createElement('div');
        div.className = `sql-log-entry ${type}`;
        div.textContent = `[${new Date().toLocaleTimeString([], { hour12: false })}] ${msg}`;
        elements.logContainer.appendChild(div);
        elements.logContainer.scrollTop = elements.logContainer.scrollHeight;
    };

    // ─────────────────────────────────────────────────────────────
    // 5. ASYNC COMMAND LIST LOAD (optional — falls back to FALLBACK_CMD)
    // ─────────────────────────────────────────────────────────────
    (function loadCmdList() {
        const finish = (data, src) => {
            if (data && typeof data === 'object') {
                CMD = data;
                SQL_KEYWORDS_SET = new Set((CMD.sql_keywords || []).map(k => k.toLowerCase()));
                rebuildDictionary();
                renderReferences();
                log(`Loaded sql_cmd_list.json (${src}).`, 'info');
            }
        };
        try {
            fetch('sql_cmd_list.json', { cache: 'no-cache' })
                .then(r => r.ok ? r.json() : Promise.reject(r.status))
                .then(j => finish(j, 'fetch'))
                .catch(() => { /* silent — fallback is fine */ });
        } catch (e) { /* silent */ }
    })();

    // ─────────────────────────────────────────────────────────────
    // 6. TOKENIZER
    // ─────────────────────────────────────────────────────────────
    function tokenize(sql) {
        const tokens = [];
        let i = 0;
        const n = sql.length;
        const isWS = c => c === ' ' || c === '\t' || c === '\n' || c === '\r';
        const isDigit = c => c >= '0' && c <= '9';
        const isIdentStart = c => /[A-Za-z_]/.test(c);
        const isIdentPart = c => /[A-Za-z0-9_.]/.test(c);

        while (i < n) {
            const c = sql[i];
            if (isWS(c)) { i++; continue; }
            if (c === '-' && sql[i+1] === '-') { while (i < n && sql[i] !== '\n') i++; continue; }
            if (c === '/' && sql[i+1] === '*') { i += 2; while (i < n && !(sql[i] === '*' && sql[i+1] === '/')) i++; i += 2; continue; }
            if (c === "'" || c === '"') {
                const quote = c; let j = i + 1; let val = '';
                while (j < n) {
                    if (sql[j] === quote) {
                        if (sql[j+1] === quote) { val += quote; j += 2; continue; }
                        break;
                    }
                    val += sql[j++];
                }
                tokens.push({ type: 'string', value: val, raw: sql.slice(i, j+1) });
                i = j + 1; continue;
            }
            if (isDigit(c) || (c === '.' && isDigit(sql[i+1]))) {
                let j = i;
                while (j < n && (isDigit(sql[j]) || sql[j] === '.' || sql[j] === 'e' || sql[j] === 'E' || ((sql[j] === '+' || sql[j] === '-') && (sql[j-1] === 'e' || sql[j-1] === 'E')))) j++;
                tokens.push({ type: 'number', value: Number(sql.slice(i, j)) });
                i = j; continue;
            }
            if (isIdentStart(c)) {
                let j = i;
                while (j < n && isIdentPart(sql[j])) j++;
                const word = sql.slice(i, j);
                tokens.push({ type: 'ident', value: word, upper: word.toUpperCase() });
                i = j; continue;
            }
            const three = sql.substr(i, 3);
            const two = sql.substr(i, 2);
            if (['<=>'].includes(three)) { tokens.push({ type: 'op', value: three }); i += 3; continue; }
            if (['<=','>=','<>','!=','||','<<','>>'].includes(two)) { tokens.push({ type: 'op', value: two }); i += 2; continue; }
            if ('=<>+-*/%(),.;&|~'.includes(c)) { tokens.push({ type: 'op', value: c }); i++; continue; }
            throw new Error(`Unexpected character '${c}' at position ${i}`);
        }
        return tokens;
    }

    // ─────────────────────────────────────────────────────────────
    // 7. PARSER
    // ─────────────────────────────────────────────────────────────
    function parse(tokens) {
        let p = 0;
        const peek = (k = 0) => tokens[p + k];
        const next = () => tokens[p++];
        const eat = (val) => { if (peek() && peek().value.toUpperCase() === val.toUpperCase()) return next(); return null; };
        const expect = (val) => { const t = eat(val); if (!t) throw new Error(`Expected '${val}' but found '${peek() ? peek().value : 'EOF'}'`); return t; };
        const isKw = (t, kw) => t && t.type === 'ident' && t.upper === kw;
        const peekKw = (kw, k = 0) => isKw(peek(k), kw);

        function parseStatement() {
            if (peekKw('SELECT')) return parseSelect();
            if (peekKw('INSERT') || peekKw('REPLACE')) return parseInsert();
            if (peekKw('UPDATE')) return parseUpdate();
            if (peekKw('DELETE')) return parseDelete();
            if (peekKw('CREATE')) return parseCreate();
            if (peekKw('DROP')) return parseDrop();
            if (peekKw('ALTER')) return parseAlter();
            if (peekKw('TRUNCATE')) return parseTruncate();
            if (peekKw('BEGIN')) { next(); eat('TRANSACTION'); return { kind: 'BEGIN' }; }
            if (peekKw('COMMIT')) { next(); eat('WORK'); return { kind: 'COMMIT' }; }
            if (peekKw('ROLLBACK')) {
                next(); eat('WORK'); eat('TRANSACTION');
                let sp = null;
                if (eat('TO')) { eat('SAVEPOINT'); sp = next().value; }
                return { kind: 'ROLLBACK', savepoint: sp };
            }
            if (peekKw('SAVEPOINT')) { next(); return { kind: 'SAVEPOINT', name: next().value }; }
            if (peekKw('RELEASE')) {
                next(); expect('SAVEPOINT');
                return { kind: 'RELEASE_SAVEPOINT', name: next().value };
            }
            if (peekKw('GRANT') || peekKw('REVOKE')) {
                const kind = next().upper;
                const rest = [];
                while (peek()) rest.push(next().value);
                return { kind, tokens: rest };
            }
            if (peekKw('EXPLAIN') || peekKw('PRAGMA') || peekKw('SHOW') || peekKw('DESCRIBE')) {
                const kind = next().upper;
                const rest = [];
                while (peek()) rest.push(next().value);
                return { kind, tokens: rest };
            }
            throw new Error(`Unsupported or unknown statement starting with '${peek() ? peek().value : 'EOF'}'`);
        }

        function parseSelect() {
            expect('SELECT');
            let distinct = false, all = false;
            if (eat('DISTINCT')) distinct = true;
            else if (eat('ALL')) all = true;

            const columns = parseSelectList();

            let from = null;
            if (eat('FROM')) from = parseFrom();

            let where = null;
            if (eat('WHERE')) where = parseExpression();

            let groupBy = null;
            if (peekKw('GROUP')) { next(); expect('BY'); groupBy = parseExprList(); }

            let having = null;
            if (eat('HAVING')) having = parseExpression();

            let orderBy = null;
            if (peekKw('ORDER')) {
                next(); expect('BY');
                orderBy = [];
                do {
                    const expr = parseExpression();
                    let dir = 'ASC';
                    if (eat('ASC')) dir = 'ASC';
                    else if (eat('DESC')) dir = 'DESC';
                    orderBy.push({ expr, dir });
                } while (eat(','));
            }

            let limit = null, offset = null;
            if (eat('LIMIT')) { limit = parseExpression(); if (eat(',')) { offset = limit; limit = parseExpression(); } }
            if (eat('OFFSET')) offset = parseExpression();

            const sets = [];
            while (peekKw('UNION') || peekKw('INTERSECT') || peekKw('EXCEPT')) {
                const op = next().upper;
                const allFlag = !!eat('ALL');
                if (peekKw('SELECT')) {
                    const sub = parseSelect();
                    sets.push({ op, all: allFlag, select: sub });
                } else {
                    throw new Error(`Expected SELECT after ${op}`);
                }
            }

            return { kind: 'SELECT', distinct, all, columns, from, where, groupBy, having, orderBy, limit, offset, sets };
        }

        function parseSelectList() {
            if (eat('*')) return [{ star: true }];
            const list = [];
            do {
                if (peek() && peek().type === 'ident' && peek(1) && peek(1).value === '.' && peek(2) && peek(2).value === '*') {
                    const tbl = next().value; next(); next();
                    list.push({ star: true, table: tbl });
                    continue;
                }
                const expr = parseExpression();
                let alias = null;
                if (eat('AS')) alias = next().value;
                else if (peek() && peek().type === 'ident' && !isReservedFollow(peek().upper)) alias = next().value;
                list.push({ expr, alias });
            } while (eat(','));
            return list;
        }

        function isReservedFollow(upper) {
            return ['FROM','WHERE','GROUP','HAVING','ORDER','LIMIT','OFFSET','UNION','INTERSECT','EXCEPT','JOIN','INNER','LEFT','RIGHT','FULL','CROSS','ON','AS','ASC','DESC'].includes(upper);
        }

        function parseFrom() {
            let node = parseTableRef();
            while (true) {
                if (peekKw('JOIN') || peekKw('INNER') || peekKw('LEFT') || peekKw('RIGHT') || peekKw('FULL') || peekKw('CROSS')) {
                    let joinType = 'INNER';
                    if (peekKw('INNER')) { next(); expect('JOIN'); }
                    else if (peekKw('LEFT')) { next(); joinType = 'LEFT'; eat('OUTER'); expect('JOIN'); }
                    else if (peekKw('RIGHT')) { next(); joinType = 'RIGHT'; eat('OUTER'); expect('JOIN'); }
                    else if (peekKw('FULL')) { next(); joinType = 'FULL'; eat('OUTER'); expect('JOIN'); }
                    else if (peekKw('CROSS')) { next(); joinType = 'CROSS'; expect('JOIN'); }
                    else { expect('JOIN'); }
                    const right = parseTableRef();
                    let on = null;
                    if (eat('ON')) on = parseExpression();
                    else if (joinType !== 'CROSS') throw new Error(`${joinType} JOIN requires ON clause`);
                    node = { kind: 'Join', type: joinType, left: node, right, on };
                } else if (eat(',')) {
                    const right = parseTableRef();
                    node = { kind: 'Join', type: 'CROSS', left: node, right, on: null };
                } else break;
            }
            return node;
        }

        function parseTableRef() {
            if (eat('(')) {
                const sub = parseSelect();
                expect(')');
                let alias = null;
                if (eat('AS')) alias = next().value;
                else if (peek() && peek().type === 'ident' && !isReservedFollow(peek().upper)) alias = next().value;
                return { kind: 'Subquery', select: sub, alias };
            }
            const name = next().value;
            let alias = null;
            if (eat('AS')) alias = next().value;
            else if (peek() && peek().type === 'ident' && !isReservedFollow(peek().upper)) alias = next().value;
            return { kind: 'Table', name, alias: alias || name };
        }

        function parseExprList() {
            const list = [];
            do { list.push(parseExpression()); } while (eat(','));
            return list;
        }

        function parseExpression() { return parseOr(); }
        function parseOr() {
            let left = parseAnd();
            while (peekKw('OR')) { next(); left = { kind: 'Binary', op: 'OR', left, right: parseAnd() }; }
            return left;
        }
        function parseAnd() {
            let left = parseNot();
            while (peekKw('AND')) { next(); left = { kind: 'Binary', op: 'AND', left, right: parseNot() }; }
            return left;
        }
        function parseNot() {
            if (peekKw('NOT')) { next(); return { kind: 'Unary', op: 'NOT', expr: parseNot() }; }
            return parseComparison();
        }
        function parseComparison() {
            let left = parseAdditive();
            if (peekKw('IS')) {
                next();
                const neg = !!eat('NOT');
                expect('NULL');
                return { kind: 'IsNull', expr: left, negated: neg };
            }
            if (peekKw('IN') || (peekKw('NOT') && peekKw('IN', 1))) {
                const neg = !!eat('NOT');
                expect('IN'); expect('(');
                let items;
                if (peekKw('SELECT')) items = { kind: 'Subquery', select: parseSelect() };
                else items = { kind: 'List', items: parseExprList() };
                expect(')');
                return { kind: 'In', expr: left, items, negated: neg };
            }
            if (peekKw('BETWEEN') || (peekKw('NOT') && peekKw('BETWEEN', 1))) {
                const neg = !!eat('NOT');
                expect('BETWEEN');
                const lo = parseAdditive();
                expect('AND');
                const hi = parseAdditive();
                return { kind: 'Between', expr: left, lo, hi, negated: neg };
            }
            if (peekKw('LIKE') || peekKw('GLOB') || (peekKw('NOT') && (peekKw('LIKE',1) || peekKw('GLOB',1)))) {
                const neg = !!eat('NOT');
                const op = next().upper;
                const right = parseAdditive();
                return { kind: 'Binary', op: (neg ? 'NOT ' : '') + op, left, right };
            }
            const t = peek();
            if (t && t.type === 'op' && ['=','!=','<>','>','<','>=','<=','<=>'].includes(t.value)) {
                next();
                return { kind: 'Binary', op: t.value, left, right: parseAdditive() };
            }
            return left;
        }
        function parseAdditive() {
            let left = parseMultiplicative();
            while (peek() && peek().type === 'op' && (peek().value === '+' || peek().value === '-' || peek().value === '||')) {
                const op = next().value;
                left = { kind: 'Binary', op, left, right: parseMultiplicative() };
            }
            return left;
        }
        function parseMultiplicative() {
            let left = parseUnary();
            while (peek() && peek().type === 'op' && ['*','/','%'].includes(peek().value)) {
                const op = next().value;
                left = { kind: 'Binary', op, left, right: parseUnary() };
            }
            return left;
        }
        function parseUnary() {
            if (peek() && peek().type === 'op' && (peek().value === '-' || peek().value === '+' || peek().value === '~')) {
                const op = next().value;
                return { kind: 'Unary', op, expr: parseUnary() };
            }
            return parsePrimary();
        }
        function parsePrimary() {
            const t = peek();
            if (!t) throw new Error('Unexpected end of expression');
            if (t.type === 'number') { next(); return { kind: 'Literal', value: t.value }; }
            if (t.type === 'string') { next(); return { kind: 'Literal', value: t.value }; }
            if (t.value === '(') {
                next();
                const expr = parseExpression();
                expect(')');
                return expr;
            }
            if (t.value === '*') { next(); return { kind: 'Star' }; }
            if (t.type === 'ident') {
                const upper = t.upper;
                if (upper === 'NULL') { next(); return { kind: 'Literal', value: null }; }
                if (upper === 'TRUE') { next(); return { kind: 'Literal', value: true }; }
                if (upper === 'FALSE') { next(); return { kind: 'Literal', value: false }; }
                if (upper === 'CASE') return parseCase();
                if (upper === 'CAST') return parseCast();
                if (upper === 'EXISTS') {
                    next(); expect('(');
                    const sub = parseSelect();
                    expect(')');
                    return { kind: 'Exists', select: sub };
                }
                if (peek(1) && peek(1).value === '(') {
                    next(); next();
                    let distinct = false;
                    if (eat('DISTINCT')) distinct = true;
                    const args = [];
                    if (!peek() || peek().value !== ')') {
                        do { args.push(parseExpression()); } while (eat(','));
                    }
                    expect(')');
                    let over = null;
                    if (peekKw('OVER')) {
                        next(); expect('(');
                        let partitionBy = null, orderBy = null;
                        if (peekKw('PARTITION')) { next(); expect('BY'); partitionBy = parseExprList(); }
                        if (peekKw('ORDER')) { next(); expect('BY'); orderBy = []; do { const e = parseExpression(); let d = 'ASC'; if (eat('ASC')) d='ASC'; else if (eat('DESC')) d='DESC'; orderBy.push({expr:e,dir:d}); } while (eat(',')); }
                        expect(')');
                        over = { partitionBy, orderBy };
                    }
                    return { kind: 'Call', name: upper, args, distinct, over };
                }
                next();
                let ref = { kind: 'Column', table: null, name: t.value };
                if (peek() && peek().value === '.') {
                    next();
                    const col = next().value;
                    ref = { kind: 'Column', table: t.value, name: col };
                }
                return ref;
            }
            throw new Error(`Unexpected token '${t.value}'`);
        }
        function parseCase() {
            expect('CASE');
            let base = null;
            if (!peekKw('WHEN')) base = parseExpression();
            const whens = [];
            while (peekKw('WHEN')) {
                next();
                const cond = parseExpression();
                expect('THEN');
                const val = parseExpression();
                whens.push({ cond, val });
            }
            let elseVal = null;
            if (eat('ELSE')) elseVal = parseExpression();
            expect('END');
            return { kind: 'Case', base, whens, elseVal };
        }
        function parseCast() {
            expect('CAST'); expect('(');
            const expr = parseExpression();
            expect('AS');
            const type = next().value;
            expect(')');
            return { kind: 'Cast', expr, type };
        }

        function parseInsert() {
            expect('INSERT');
            eat('OR');
            if (peekKw('REPLACE')) { next(); }
            else if (peekKw('IGNORE')) { next(); }
            expect('INTO');
            const table = next().value;
            let cols = null;
            if (eat('(')) { cols = []; do { cols.push(next().value); } while (eat(',')); expect(')'); }
            if (!eat('VALUES')) throw new Error("INSERT requires VALUES");
            const rows = [];
            do {
                expect('(');
                const vals = [];
                if (!peek() || peek().value !== ')') {
                    do { vals.push(parseExpression()); } while (eat(','));
                }
                expect(')');
                rows.push(vals);
            } while (eat(','));
            return { kind: 'INSERT', table, columns: cols, rows };
        }

        function parseUpdate() {
            expect('UPDATE');
            const table = next().value;
            let alias = null;
            if (eat('AS')) alias = next().value;
            else if (peek() && peek().type === 'ident' && !peekKw('SET')) alias = next().value;
            expect('SET');
            const assignments = [];
            do {
                const col = next().value;
                expect('=');
                const expr = parseExpression();
                assignments.push({ col, expr });
            } while (eat(','));
            let where = null;
            if (eat('WHERE')) where = parseExpression();
            return { kind: 'UPDATE', table, alias, assignments, where };
        }

        function parseDelete() {
            expect('DELETE');
            expect('FROM');
            const table = next().value;
            let where = null;
            if (eat('WHERE')) where = parseExpression();
            return { kind: 'DELETE', table, where };
        }

        function parseCreate() {
            expect('CREATE');
            if (eat('UNIQUE')) { /* index hint */ }
            if (peekKw('INDEX')) {
                next();
                const name = next().value;
                expect('ON');
                const table = next().value;
                expect('(');
                const cols = [];
                do { cols.push(next().value); } while (eat(','));
                expect(')');
                return { kind: 'CREATE_INDEX', name, table, columns: cols };
            }
            if (peekKw('VIEW')) {
                next();
                const name = next().value;
                expect('AS');
                const select = parseSelect();
                return { kind: 'CREATE_VIEW', name, select };
            }
            // Not-yet-implemented DDL objects — accept gracefully
            if (peekKw('SCHEMA') || peekKw('DATABASE') || peekKw('SEQUENCE') || peekKw('TRIGGER') ||
                peekKw('FUNCTION') || peekKw('PROCEDURE') || peekKw('USER') || peekKw('ROLE')) {
                const what = next().upper;
                const rest = [];
                while (peek()) rest.push(next().value);
                return { kind: 'NOOP_DDL', msg: `CREATE ${what} is accepted but not simulated.` };
            }
            if (peekKw('TABLE')) {
                next();
                const ifNotExists = !!eat('IF') && !!eat('NOT') && !!eat('EXISTS');
                const name = next().value;
                expect('(');
                const columns = [];
                do {
                    const colName = next().value;
                    let type = 'TEXT';
                    if (peek() && peek().type === 'ident' && !['PRIMARY','NOT','NULL','UNIQUE','CHECK','DEFAULT','REFERENCES','FOREIGN','CONSTRAINT','AUTOINCREMENT'].includes(peek().upper)) {
                        type = next().value;
                        if (peek() && peek().type === 'ident' && ['PRECISION','VARYING'].includes(peek().upper)) next();
                    }
                    const constraints = [];
                    while (peek() && peek().value !== ',' && peek().value !== ')') {
                        const kw = next();
                        if (kw.upper === 'PRIMARY') { eat('KEY'); constraints.push('PRIMARY KEY'); }
                        else if (kw.upper === 'NOT') { eat('NULL'); constraints.push('NOT NULL'); }
                        else if (kw.upper === 'NULL') constraints.push('NULL');
                        else if (kw.upper === 'UNIQUE') constraints.push('UNIQUE');
                        else if (kw.upper === 'AUTOINCREMENT') constraints.push('AUTOINCREMENT');
                        else if (kw.upper === 'DEFAULT') { const v = parseExpression(); constraints.push({ default: v }); }
                        else if (kw.upper === 'REFERENCES') { constraints.push('REFERENCES ' + next().value); }
                        else if (kw.upper === 'CHECK') { expect('('); constraints.push('CHECK'); while (peek() && peek().value !== ')') next(); expect(')'); }
                        else constraints.push(kw.value);
                    }
                    columns.push({ name: colName, type: type.toUpperCase(), constraints });
                } while (eat(','));
                expect(')');
                return { kind: 'CREATE_TABLE', name, columns, ifNotExists };
            }
            throw new Error('Unsupported CREATE variant');
        }

        function parseDrop() {
            expect('DROP');
            if (peekKw('TABLE')) {
                next();
                const ifExists = !!eat('IF') && !!eat('EXISTS');
                const name = next().value;
                return { kind: 'DROP_TABLE', name, ifExists };
            }
            if (peekKw('INDEX')) { next(); return { kind: 'DROP_INDEX', name: next().value }; }
            if (peekKw('VIEW'))  { next(); return { kind: 'DROP_VIEW', name: next().value }; }
            if (peekKw('SCHEMA') || peekKw('DATABASE') || peekKw('SEQUENCE') || peekKw('TRIGGER') ||
                peekKw('FUNCTION') || peekKw('PROCEDURE') || peekKw('USER') || peekKw('ROLE')) {
                const what = next().upper;
                const rest = [];
                while (peek()) rest.push(next().value);
                return { kind: 'NOOP_DDL', msg: `DROP ${what} is accepted but not simulated.` };
            }
            throw new Error('Unsupported DROP variant');
        }

        function parseAlter() {
            expect('ALTER');
            if (peekKw('USER') || peekKw('ROLE')) {
                const what = next().upper;
                const rest = [];
                while (peek()) rest.push(next().value);
                return { kind: 'NOOP_DDL', msg: `ALTER ${what} is accepted but not simulated.` };
            }
            expect('TABLE');
            const name = next().value;
            if (eat('ADD')) {
                eat('COLUMN');
                const colName = next().value;
                let type = 'TEXT';
                if (peek() && peek().type === 'ident' && !['PRIMARY','NOT','NULL','UNIQUE'].includes(peek().upper)) type = next().value;
                return { kind: 'ALTER_TABLE', name, action: 'ADD', column: { name: colName, type: type.toUpperCase() } };
            }
            if (eat('DROP')) {
                eat('COLUMN');
                return { kind: 'ALTER_TABLE', name, action: 'DROP', column: { name: next().value } };
            }
            if (eat('RENAME')) {
                if (eat('TO')) return { kind: 'ALTER_TABLE', name, action: 'RENAME_TABLE', newName: next().value };
                eat('COLUMN');
                const oldName = next().value;
                expect('TO');
                return { kind: 'ALTER_TABLE', name, action: 'RENAME_COLUMN', oldName, newName: next().value };
            }
            throw new Error('Unsupported ALTER TABLE action');
        }

        function parseTruncate() {
            expect('TRUNCATE');
            eat('TABLE');
            return { kind: 'TRUNCATE', name: next().value };
        }

        const stmt = parseStatement();
        if (p < tokens.length) {
            if (tokens[p].value !== ';') throw new Error(`Unexpected token '${tokens[p].value}' after statement`);
        }
        return stmt;
    }

    // ─────────────────────────────────────────────────────────────
    // 8. EXPRESSION EVALUATOR
    // ─────────────────────────────────────────────────────────────
    function evaluateExpr(node, row, context) {
        if (!node) return null;
        switch (node.kind) {
            case 'Literal': return node.value;
            case 'Star': return row;
            case 'Column': {
                if (node.table) {
                    const key = node.table + '.' + node.name;
                    if (row && key in row) return row[key];
                    if (row && node.name in row) return row[node.name];
                    return null;
                }
                if (row && node.name in row) return row[node.name];
                if (row) {
                    const k = Object.keys(row).find(k => k.toLowerCase() === node.name.toLowerCase());
                    if (k) return row[k];
                }
                return null;
            }
            case 'Binary': return evalBinary(node, row, context);
            case 'Unary': {
                const v = evaluateExpr(node.expr, row, context);
                switch (node.op) {
                    case 'NOT': return !truthy(v);
                    case '-': return -Number(v);
                    case '+': return +Number(v);
                    case '~': return ~Number(v);
                }
                return null;
            }
            case 'IsNull': {
                const v = evaluateExpr(node.expr, row, context);
                return node.negated ? v !== null && v !== undefined : v === null || v === undefined;
            }
            case 'In': {
                const v = evaluateExpr(node.expr, row, context);
                let set;
                if (node.items.kind === 'Subquery') set = executeSelect(node.items.select).rows.map(r => Object.values(r)[0]);
                else set = node.items.items.map(e => evaluateExpr(e, row, context));
                const found = set.some(s => looseEq(s, v));
                return node.negated ? !found : found;
            }
            case 'Between': {
                const v = evaluateExpr(node.expr, row, context);
                const lo = evaluateExpr(node.lo, row, context);
                const hi = evaluateExpr(node.hi, row, context);
                const inRange = compare(v, lo) >= 0 && compare(v, hi) <= 0;
                return node.negated ? !inRange : inRange;
            }
            case 'Exists': {
                const r = executeSelect(node.select);
                return r.rows.length > 0;
            }
            case 'Call': return evalFunction(node, row, context);
            case 'Case': return evalCase(node, row, context);
            case 'Cast': return castValue(evaluateExpr(node.expr, row, context), node.type);
            default: throw new Error(`Unsupported expression kind: ${node.kind}`);
        }
    }

    function looseEq(a, b) {
        if (a === b) return true;
        if (a === null || b === null) return a === b;
        const na = Number(a), nb = Number(b);
        if (!isNaN(na) && !isNaN(nb)) return na === nb;
        return String(a) === String(b);
    }

    function compare(a, b) {
        if (a === null || a === undefined) return b === null || b === undefined ? 0 : -1;
        if (b === null || b === undefined) return 1;
        const na = Number(a), nb = Number(b);
        if (!isNaN(na) && !isNaN(nb)) return na < nb ? -1 : na > nb ? 1 : 0;
        const sa = String(a), sb = String(b);
        return sa < sb ? -1 : sa > sb ? 1 : 0;
    }

    function truthy(v) {
        if (v === null || v === undefined || v === false) return false;
        if (typeof v === 'number') return v !== 0;
        if (typeof v === 'string') return v.length > 0 && v !== 'false' && v !== '0';
        return Boolean(v);
    }

    function evalBinary(node, row, context) {
        const op = node.op;
        if (op === 'AND') return truthy(evaluateExpr(node.left, row, context)) && truthy(evaluateExpr(node.right, row, context));
        if (op === 'OR')  return truthy(evaluateExpr(node.left, row, context)) || truthy(evaluateExpr(node.right, row, context));

        const a = evaluateExpr(node.left, row, context);
        const b = evaluateExpr(node.right, row, context);

        switch (op) {
            case '=':  case '==': return looseEq(a, b);
            case '!=': case '<>': return !looseEq(a, b);
            case '>':  return compare(a, b) > 0;
            case '<':  return compare(a, b) < 0;
            case '>=': return compare(a, b) >= 0;
            case '<=': return compare(a, b) <= 0;
            case '+':  return Number(a) + Number(b);
            case '-':  return Number(a) - Number(b);
            case '*':  return Number(a) * Number(b);
            case '/':  return Number(a) / Number(b);
            case '%':  return Number(a) % Number(b);
            case '||': return String(a) + String(b);
            case 'LIKE':    return likeMatch(a, b);
            case 'NOT LIKE': return !likeMatch(a, b);
            case 'GLOB':    return globMatch(a, b);
            case 'NOT GLOB': return !globMatch(a, b);
            case 'REGEXP':
            case 'MATCH': {
                try { return new RegExp(String(b)).test(String(a)); } catch { return false; }
            }
        }
        throw new Error(`Unsupported operator: ${op}`);
    }

    function likeMatch(a, b) {
        if (a === null || b === null) return false;
        const pattern = String(b).replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/%/g, '.*').replace(/_/g, '.');
        return new RegExp('^' + pattern + '$', 'i').test(String(a));
    }
    function globMatch(a, b) {
        if (a === null || b === null) return false;
        const pattern = String(b).replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.');
        return new RegExp('^' + pattern + '$').test(String(a));
    }

    function evalCase(node, row, ctx) {
        const base = node.base ? evaluateExpr(node.base, row, ctx) : null;
        for (const w of node.whens) {
            const cond = evaluateExpr(w.cond, row, ctx);
            if (node.base ? looseEq(base, cond) : truthy(cond)) {
                return evaluateExpr(w.val, row, ctx);
            }
        }
        return node.elseVal ? evaluateExpr(node.elseVal, row, ctx) : null;
    }

    function castValue(v, type) {
        const t = String(type).toUpperCase();
        if (t.includes('INT')) return parseInt(v, 10);
        if (t.includes('REAL') || t.includes('FLOAT') || t.includes('DOUBLE') || t.includes('DECIMAL') || t.includes('NUMERIC')) return parseFloat(v);
        if (t.includes('BOOL')) return truthy(v);
        if (t.includes('TEXT') || t.includes('CHAR') || t.includes('CLOB')) return String(v);
        return v;
    }

    function evalFunction(node, row, ctx) {
        const name = node.name;
        const isAgg = CMD.aggregate_functions.includes(name);
        if (isAgg) {
            const rows = (ctx && ctx.groupRows) || [row];
            const values = rows.map(r => node.args.length ? evaluateExpr(node.args[0], r, ctx) : r);
            return aggregate(name, values, node.distinct);
        }
        const args = node.args.map(a => evaluateExpr(a, row, ctx));
        return scalarFunction(name, args);
    }

    function aggregate(name, values, distinct) {
        let vals = values.filter(v => v !== null && v !== undefined);
        if (distinct) vals = [...new Set(vals)];
        switch (name) {
            case 'COUNT': return vals.length;
            case 'SUM': return vals.reduce((a,b) => a + Number(b), 0);
            case 'AVG': return vals.length ? vals.reduce((a,b) => a + Number(b), 0) / vals.length : null;
            case 'MIN': return vals.length ? vals.reduce((a,b) => compare(a,b) < 0 ? a : b) : null;
            case 'MAX': return vals.length ? vals.reduce((a,b) => compare(a,b) > 0 ? a : b) : null;
            case 'GROUP_CONCAT':
            case 'STRING_AGG': return vals.join(',');
            case 'STDDEV': {
                if (!vals.length) return null;
                const m = vals.reduce((a,b)=>a+Number(b),0)/vals.length;
                return Math.sqrt(vals.reduce((a,b)=>a+(Number(b)-m)**2,0)/vals.length);
            }
            case 'VARIANCE': {
                if (!vals.length) return null;
                const m = vals.reduce((a,b)=>a+Number(b),0)/vals.length;
                return vals.reduce((a,b)=>a+(Number(b)-m)**2,0)/vals.length;
            }
            default: throw new Error(`Unknown aggregate: ${name}`);
        }
    }

    function scalarFunction(name, args) {
        switch (name) {
            case 'UPPER': return String(args[0]).toUpperCase();
            case 'LOWER': return String(args[0]).toLowerCase();
            case 'LENGTH': return String(args[0]).length;
            case 'SUBSTR':
            case 'SUBSTRING': return String(args[0]).substr(Number(args[1]) - 1, args[2] !== undefined ? Number(args[2]) : undefined);
            case 'TRIM': return String(args[0]).trim();
            case 'LTRIM': return String(args[0]).replace(/^\s+/, '');
            case 'RTRIM': return String(args[0]).replace(/\s+$/, '');
            case 'REPLACE': return String(args[0]).split(String(args[1])).join(String(args[2]));
            case 'CONCAT': return args.map(String).join('');
            case 'INSTR': return String(args[0]).indexOf(String(args[1])) + 1;
            case 'LEFT': return String(args[0]).substr(0, Number(args[1]));
            case 'RIGHT': return String(args[0]).substr(-Number(args[1]));
            case 'REVERSE': return String(args[0]).split('').reverse().join('');
            case 'ABS': return Math.abs(Number(args[0]));
            case 'CEIL': case 'CEILING': return Math.ceil(Number(args[0]));
            case 'FLOOR': return Math.floor(Number(args[0]));
            case 'ROUND': return args[1] !== undefined ? Number(Number(args[0]).toFixed(Number(args[1]))) : Math.round(Number(args[0]));
            case 'TRUNC': return Math.trunc(Number(args[0]));
            case 'SIGN': return Math.sign(Number(args[0]));
            case 'SQRT': return Math.sqrt(Number(args[0]));
            case 'POWER': case 'POW': return Math.pow(Number(args[0]), Number(args[1]));
            case 'EXP': return Math.exp(Number(args[0]));
            case 'LOG': return Math.log(Number(args[0]));
            case 'LOG10': return Math.log10(Number(args[0]));
            case 'MOD': return Number(args[0]) % Number(args[1]);
            case 'RANDOM': case 'RAND': return Math.random();
            case 'PI': return Math.PI;
            case 'NOW': case 'CURRENT_TIMESTAMP': return new Date().toISOString();
            case 'CURRENT_DATE': return new Date().toISOString().slice(0,10);
            case 'CURRENT_TIME': return new Date().toISOString().slice(11,19);
            case 'DATE': return new Date(args[0]).toISOString().slice(0,10);
            case 'YEAR': return new Date(args[0]).getFullYear();
            case 'MONTH': return new Date(args[0]).getMonth() + 1;
            case 'DAY': return new Date(args[0]).getDate();
            case 'HOUR': return new Date(args[0]).getHours();
            case 'MINUTE': return new Date(args[0]).getMinutes();
            case 'SECOND': return new Date(args[0]).getSeconds();
            case 'UNIXEPOCH': return Math.floor(new Date(args[0] || Date.now()).getTime() / 1000);
            case 'COALESCE': return args.find(a => a !== null && a !== undefined) ?? null;
            case 'NULLIF': return looseEq(args[0], args[1]) ? null : args[0];
            case 'IFNULL': case 'ISNULL': return args[0] === null || args[0] === undefined ? args[1] : args[0];
            case 'IF': return truthy(args[0]) ? args[1] : args[2];
            case 'TYPEOF': return typeof args[0];
            case 'QUOTE': return args[0] === null ? 'NULL' : `'${String(args[0]).replace(/'/g, "''")}'`;
            case 'HEX': return Array.from(String(args[0])).map(c=>c.charCodeAt(0).toString(16)).join('');
        }
        throw new Error(`Unknown function: ${name}`);
    }

    // ─────────────────────────────────────────────────────────────
    // 9. QUERY EXECUTION
    // ─────────────────────────────────────────────────────────────
    function executeSQL(query) {
        query = query.trim().replace(/;\s*$/, '');
        if (!query) throw new Error('Empty query string.');
        const tokens = tokenize(query);
        const ast = parse(tokens);
        return executeStatement(ast);
    }

    function executeStatement(ast) {
        switch (ast.kind) {
            case 'SELECT': return executeSelect(ast);
            case 'INSERT': return executeInsert(ast);
            case 'UPDATE': return executeUpdate(ast);
            case 'DELETE': return executeDelete(ast);
            case 'CREATE_TABLE': return executeCreateTable(ast);
            case 'ALTER_TABLE': return executeAlterTable(ast);
            case 'DROP_TABLE': return executeDropTable(ast);
            case 'TRUNCATE': return executeTruncate(ast);
            case 'CREATE_INDEX': return executeCreateIndex(ast);
            case 'DROP_INDEX': return executeDropIndex(ast);
            case 'CREATE_VIEW': return executeCreateView(ast);
            case 'DROP_VIEW': return executeDropView(ast);
            case 'BEGIN': return executeBegin();
            case 'COMMIT': return executeCommit();
            case 'ROLLBACK': return executeRollback(ast.savepoint);
            case 'SAVEPOINT': return executeSavepoint(ast.name);
            case 'RELEASE_SAVEPOINT': return { type: 'TCL', msg: `Savepoint '${ast.name}' released.` };
            case 'GRANT': case 'REVOKE':
                return { type: ast.kind, msg: `${ast.kind} is a no-op in this sandbox (no user system).` };
            case 'NOOP_DDL':
                return { type: 'DDL', msg: ast.msg };
            case 'EXPLAIN': case 'PRAGMA': case 'SHOW': case 'DESCRIBE':
                return { type: ast.kind, msg: `${ast.kind} is accepted but not simulated.` };
        }
        throw new Error(`Unsupported statement: ${ast.kind}`);
    }

    function executeSelect(ast) {
        let rows = [];
        if (ast.from) rows = buildRows(ast.from);
        else rows = [{}];

        if (ast.where) rows = rows.filter(r => truthy(evaluateExpr(ast.where, r, {})));

        const hasAggregate = ast.columns.some(c => c.expr && containsAggregate(c.expr)) || (ast.having && containsAggregate(ast.having));
        if (ast.groupBy || hasAggregate) {
            rows = applyGroupBy(rows, ast.groupBy, ast.columns, ast.having);
        } else if (ast.having) {
            rows = rows.filter(r => truthy(evaluateExpr(ast.having, r, {})));
        }

        if (ast.distinct) rows = dedupeRows(rows);

        let projected = projectRows(rows, ast.columns);

        for (const s of ast.sets || []) {
            const other = executeSelect(s.select).rows;
            if (s.op === 'UNION') {
                projected = projected.concat(other);
                if (!s.all) projected = dedupeRows(projected);
            } else if (s.op === 'INTERSECT') {
                const key = r => JSON.stringify(r);
                const set = new Set(other.map(key));
                projected = projected.filter(r => set.has(key(r)));
            } else if (s.op === 'EXCEPT') {
                const key = r => JSON.stringify(r);
                const set = new Set(other.map(key));
                projected = projected.filter(r => !set.has(key(r)));
            }
        }

        if (ast.orderBy) {
            projected.sort((a, b) => {
                for (const o of ast.orderBy) {
                    const va = evaluateExpr(o.expr, a, {});
                    const vb = evaluateExpr(o.expr, b, {});
                    const c = compare(va, vb);
                    if (c !== 0) return o.dir === 'DESC' ? -c : c;
                }
                return 0;
            });
        }

        if (ast.offset) projected = projected.slice(Number(evaluateExpr(ast.offset, {}, {})));
        if (ast.limit !== null && ast.limit !== undefined) projected = projected.slice(0, Number(evaluateExpr(ast.limit, {}, {})));

        return { type: 'SELECT', rows: projected };
    }

    function buildRows(fromNode) {
        if (fromNode.kind === 'Table') {
            let data;
            if (db[fromNode.name]) data = db[fromNode.name];
            else if (views[fromNode.name]) data = executeSelect(views[fromNode.name]).rows;
            else throw new Error(`Table or view '${fromNode.name}' does not exist.`);
            return data.map(r => prefixRow(r, fromNode.alias));
        }
        if (fromNode.kind === 'Subquery') {
            const rows = executeSelect(fromNode.select).rows;
            return rows.map(r => prefixRow(r, fromNode.alias));
        }
        if (fromNode.kind === 'Join') {
            const left = buildRows(fromNode.left);
            const right = buildRows(fromNode.right);
            const out = [];
            for (const l of left) {
                let matched = false;
                for (const r of right) {
                    const merged = { ...l, ...r };
                    if (fromNode.type === 'CROSS' || (fromNode.on && truthy(evaluateExpr(fromNode.on, merged, {})))) {
                        out.push(merged);
                        matched = true;
                    }
                }
                if (!matched && (fromNode.type === 'LEFT' || fromNode.type === 'FULL')) {
                    out.push({ ...l, ...nullify(right[0] || {}) });
                }
            }
            if ((fromNode.type === 'RIGHT' || fromNode.type === 'FULL')) {
                for (const r of right) {
                    const anyLeft = left.some(l => fromNode.on && truthy(evaluateExpr(fromNode.on, { ...l, ...r }, {})));
                    if (!anyLeft) out.push({ ...nullify(left[0] || {}), ...r });
                }
            }
            return out;
        }
        throw new Error('Unknown FROM node');
    }

    function prefixRow(row, alias) {
        const out = {};
        for (const [k, v] of Object.entries(row)) {
            out[k] = v;
            out[alias + '.' + k] = v;
        }
        return out;
    }
    function nullify(row) {
        const out = {};
        for (const k of Object.keys(row)) out[k] = null;
        return out;
    }

    function containsAggregate(node) {
        if (!node || typeof node !== 'object') return false;
        if (node.kind === 'Call' && CMD.aggregate_functions.includes(node.name)) return true;
        for (const k of Object.keys(node)) {
            const v = node[k];
            if (v && typeof v === 'object') {
                if (Array.isArray(v)) { if (v.some(containsAggregate)) return true; }
                else if (containsAggregate(v)) return true;
            }
        }
        return false;
    }

    function applyGroupBy(rows, groupByExprs, selectColumns, having) {
        const groups = new Map();
        for (const r of rows) {
            const key = groupByExprs ? JSON.stringify(groupByExprs.map(e => evaluateExpr(e, r, {}))) : '__all__';
            if (!groups.has(key)) groups.set(key, []);
            groups.get(key).push(r);
        }
        const out = [];
        for (const [_, groupRows] of groups) {
            const first = groupRows[0] || {};
            const ctx = { groupRows };
            const row = {};
            for (const col of selectColumns) {
                if (col.star) continue;
                if (col.expr) {
                    const v = evaluateExpr(col.expr, first, ctx);
                    const alias = col.alias || exprName(col.expr);
                    row[alias] = v;
                }
            }
            if (groupByExprs) {
                for (const e of groupByExprs) {
                    if (e.kind === 'Column') row[e.name] = evaluateExpr(e, first, ctx);
                }
            }
            if (having && !truthy(evaluateExpr(having, row, ctx))) continue;
            out.push(row);
        }
        return out;
    }

    function exprName(expr) {
        if (!expr) return '?';
        if (expr.kind === 'Column') return expr.name;
        if (expr.kind === 'Call') return expr.name.toLowerCase();
        if (expr.kind === 'Literal') return String(expr.value);
        return 'expr';
    }

    function dedupeRows(rows) {
        const seen = new Set();
        const out = [];
        for (const r of rows) {
            const k = JSON.stringify(r);
            if (!seen.has(k)) { seen.add(k); out.push(r); }
        }
        return out;
    }

    function projectRows(rows, columns) {
        if (columns.length === 1 && columns[0].star) {
            return rows.map(r => {
                const clean = {};
                for (const [k, v] of Object.entries(r)) if (!k.includes('.')) clean[k] = v;
                return clean;
            });
        }
        return rows.map(r => {
            const out = {};
            for (const c of columns) {
                if (c.star) {
                    for (const [k, v] of Object.entries(r)) if (!k.includes('.')) out[k] = v;
                    continue;
                }
                const v = evaluateExpr(c.expr, r, {});
                const name = c.alias || exprName(c.expr);
                out[name] = v;
            }
            return out;
        });
    }

    function executeInsert(ast) {
        if (!db[ast.table]) throw new Error(`Table '${ast.table}' does not exist.`);
        const table = db[ast.table];
        const cols = ast.columns || Object.keys(table[0] || {});
        let inserted = 0;
        for (const rowExprs of ast.rows) {
            const row = {};
            cols.forEach((c, i) => {
                row[c] = rowExprs[i] ? evaluateExpr(rowExprs[i], {}, {}) : null;
            });
            if (row.id === undefined) row.id = Math.floor(Math.random() * 9000) + 2000;
            table.push(row);
            inserted++;
        }
        saveState();
        return { type: 'INSERT', msg: `${inserted} row(s) inserted into ${ast.table}.` };
    }

    function executeUpdate(ast) {
        if (!db[ast.table]) throw new Error(`Table '${ast.table}' does not exist.`);
        let count = 0;
        db[ast.table] = db[ast.table].map(row => {
            const scope = ast.alias ? prefixRow(row, ast.alias) : row;
            if (!ast.where || truthy(evaluateExpr(ast.where, scope, {}))) {
                count++;
                const updated = { ...row };
                for (const a of ast.assignments) {
                    updated[a.col] = evaluateExpr(a.expr, scope, {});
                }
                return updated;
            }
            return row;
        });
        saveState();
        return { type: 'UPDATE', msg: `${count} row(s) updated in ${ast.table}.` };
    }

    function executeDelete(ast) {
        if (!db[ast.table]) throw new Error(`Table '${ast.table}' does not exist.`);
        const before = db[ast.table].length;
        if (ast.where) {
            db[ast.table] = db[ast.table].filter(r => !truthy(evaluateExpr(ast.where, r, {})));
        } else {
            db[ast.table] = [];
        }
        saveState();
        return { type: 'DELETE', msg: `${before - db[ast.table].length} row(s) deleted from ${ast.table}.` };
    }

    function executeCreateTable(ast) {
        if (db[ast.name] && ast.ifNotExists) return { type: 'DDL', msg: `Table '${ast.name}' already exists.` };
        if (db[ast.name]) throw new Error(`Table '${ast.name}' already exists.`);
        db[ast.name] = [];
        saveState();
        return { type: 'DDL', msg: `Table '${ast.name}' created with ${ast.columns.length} column(s).` };
    }

    function executeAlterTable(ast) {
        if (!db[ast.name]) throw new Error(`Table '${ast.name}' does not exist.`);
        switch (ast.action) {
            case 'ADD':
                db[ast.name].forEach(r => { if (!(ast.column.name in r)) r[ast.column.name] = null; });
                saveState();
                return { type: 'DDL', msg: `Column '${ast.column.name}' added to ${ast.name}.` };
            case 'DROP':
                db[ast.name].forEach(r => { delete r[ast.column.name]; });
                saveState();
                return { type: 'DDL', msg: `Column '${ast.column.name}' dropped from ${ast.name}.` };
            case 'RENAME_TABLE':
                db[ast.newName] = db[ast.name];
                delete db[ast.name];
                saveState();
                return { type: 'DDL', msg: `Table '${ast.name}' renamed to '${ast.newName}'.` };
            case 'RENAME_COLUMN':
                db[ast.name].forEach(r => { r[ast.newName] = r[ast.oldName]; delete r[ast.oldName]; });
                saveState();
                return { type: 'DDL', msg: `Column '${ast.oldName}' renamed to '${ast.newName}'.` };
        }
    }

    function executeDropTable(ast) {
        if (!db[ast.name]) {
            if (ast.ifExists) return { type: 'DDL', msg: `Table '${ast.name}' does not exist.` };
            throw new Error(`Table '${ast.name}' does not exist.`);
        }
        delete db[ast.name];
        saveState();
        return { type: 'DDL', msg: `Table '${ast.name}' dropped.` };
    }

    function executeTruncate(ast) {
        if (!db[ast.name]) throw new Error(`Table '${ast.name}' does not exist.`);
        db[ast.name] = [];
        saveState();
        return { type: 'DDL', msg: `Table '${ast.name}' truncated.` };
    }

    function executeCreateIndex(ast) {
        if (!db[ast.table]) throw new Error(`Table '${ast.table}' does not exist.`);
        indexes[ast.name] = { table: ast.table, columns: ast.columns };
        return { type: 'DDL', msg: `Index '${ast.name}' created on ${ast.table}(${ast.columns.join(', ')}).` };
    }
    function executeDropIndex(ast) {
        delete indexes[ast.name];
        return { type: 'DDL', msg: `Index '${ast.name}' dropped.` };
    }
    function executeCreateView(ast) {
        views[ast.name] = ast.select;
        return { type: 'DDL', msg: `View '${ast.name}' created.` };
    }
    function executeDropView(ast) {
        delete views[ast.name];
        return { type: 'DDL', msg: `View '${ast.name}' dropped.` };
    }

    function executeBegin() {
        if (transaction) throw new Error('Transaction already in progress.');
        transaction = { snapshot: JSON.parse(JSON.stringify(db)), savepoints: {} };
        return { type: 'TCL', msg: 'Transaction started.' };
    }
    function executeCommit() {
        if (!transaction) throw new Error('No active transaction.');
        transaction = null;
        return { type: 'TCL', msg: 'Transaction committed.' };
    }
    function executeRollback(savepoint) {
        if (!transaction) throw new Error('No active transaction.');
        if (savepoint) {
            if (!transaction.savepoints[savepoint]) throw new Error(`Savepoint '${savepoint}' not found.`);
            db = JSON.parse(JSON.stringify(transaction.savepoints[savepoint]));
            saveState();
            return { type: 'TCL', msg: `Rolled back to savepoint '${savepoint}'.` };
        }
        db = transaction.snapshot;
        transaction = null;
        saveState();
        return { type: 'TCL', msg: 'Transaction rolled back.' };
    }
    function executeSavepoint(name) {
        if (!transaction) throw new Error('No active transaction.');
        transaction.savepoints[name] = JSON.parse(JSON.stringify(db));
        return { type: 'TCL', msg: `Savepoint '${name}' set.` };
    }

    // ─────────────────────────────────────────────────────────────
    // 10. UI GLUE
    // ─────────────────────────────────────────────────────────────
    const saveState = () => {
        history = history.slice(0, historyIndex + 1);
        history.push(JSON.parse(JSON.stringify(db)));
        historyIndex++;
        updateButtonStates();
        renderDatabase();
    };

    const updateButtonStates = () => {
        elements.undoBtn.disabled = historyIndex <= 0;
        elements.redoBtn.disabled = historyIndex >= history.length - 1;
        const dbEmpty = Object.keys(db).length === 0;
        elements.closeBtn.disabled = dbEmpty;
    };

    const renderTable = (data) => {
        if (!data || data.length === 0) {
            elements.results.innerHTML = `<div class="sql-empty-state">Query returned 0 rows.</div>`;
            return;
        }
        const cols = Object.keys(data[0]);
        let html = `<table class="sql-table"><thead><tr>`;
        cols.forEach(c => html += `<th>${c}</th>`);
        html += `</tr></thead><tbody>`;
        data.forEach(row => {
            html += `<tr>`;
            cols.forEach(c => html += `<td>${row[c] === null ? '<i style="opacity:0.4">NULL</i>' : String(row[c])}</td>`);
            html += `</tr>`;
        });
        html += `</tbody></table>`;
        elements.results.innerHTML = html;
    };

    const renderDatabase = () => {
        let html = '';
        dbNodes.tables = {};
        dbNodes.cols = {};
        dbNodes.values = {};
        activeHighlights = [];

        const tableNames = Object.keys(db);
        if (tableNames.length === 0) {
            elements.tablesOverview.innerHTML = `<div class="sql-empty-state" style="grid-column: 1 / -1;">No tables yet. Click <b>Create DB</b> or run <code>CREATE TABLE ...</code> to begin.</div>`;
            rebuildDictionary();
            return;
        }

        tableNames.forEach((tableName, i) => {
            currentTableColors[tableName.toLowerCase()] = TABLE_COLORS[i % TABLE_COLORS.length];
            currentColColors[tableName.toLowerCase()] = TABLE_COLORS[(i + 3) % TABLE_COLORS.length];
            currentValueColors[tableName.toLowerCase()] = TABLE_COLORS[(i + 6) % TABLE_COLORS.length];
        });

        for (const [tableName, tableData] of Object.entries(db)) {
            html += `<div class="sql-db-table-wrapper" id="sql-table-wrap-${tableName}">
                <div class="sql-db-table-title" id="sql-table-title-${tableName}">${tableName} <span style="opacity:0.6; font-size:0.75rem; font-weight:normal;">(${tableData.length} rows)</span></div>
                <div class="sql-db-table-scroll">`;
            if (tableData.length === 0) {
                html += `<div class="sql-empty-state" style="padding:12px;">Empty Table</div>`;
            } else {
                const cols = Object.keys(tableData[0]);
                html += `<table class="sql-table"><thead><tr>`;
                cols.forEach(c => html += `<th class="sql-col-${tableName}-${c}">${c}</th>`);
                html += `</tr></thead><tbody>`;
                tableData.forEach(row => {
                    html += `<tr>`;
                    cols.forEach(c => html += `<td class="sql-col-${tableName}-${c}">${row[c]}</td>`);
                    html += `</tr>`;
                });
                html += `</tbody></table>`;
            }
            html += `</div></div>`;
        }
        elements.tablesOverview.innerHTML = html;

        Object.keys(db).forEach(tableName => {
            const titleNode = document.getElementById(`sql-table-title-${tableName}`);
            if (titleNode) dbNodes.tables[tableName.toLowerCase()] = [titleNode];
            if (db[tableName].length > 0) {
                Object.keys(db[tableName][0]).forEach(c => {
                    const colNameLower = c.toLowerCase();
                    if (!dbNodes.cols[colNameLower]) dbNodes.cols[colNameLower] = [];
                    const nodes = elements.tablesOverview.querySelectorAll(`.sql-col-${tableName}-${c}`);
                    nodes.forEach(n => {
                        n.dataset.table = tableName.toLowerCase();
                        dbNodes.cols[colNameLower].push(n);
                        if (n.tagName === 'TD') {
                            const valString = String(n.textContent).toLowerCase();
                            if (!dbNodes.values[valString]) dbNodes.values[valString] = [];
                            dbNodes.values[valString].push(n);
                        }
                    });
                });
            }
        });

        rebuildDictionary();
        if (typeof updateHighlights === 'function') updateHighlights();
    };

    function rebuildDictionary() {
        if (!CMD) return;
        const keywords = CMD.sql_keywords || [];
        let dbCols = [];
        Object.keys(db).forEach(t => { if (db[t][0]) Object.keys(db[t][0]).forEach(c => dbCols.push(c)); });
        const allFuncs = Object.values(CMD.scalar_functions || {}).flat().concat(CMD.aggregate_functions || []);
        dictionary = [...new Set([...keywords, ...allFuncs, ...Object.keys(db), ...dbCols])];
    }

    const updateHighlights = () => {
        activeHighlights.forEach(n => n.classList.remove('sql-highlight'));
        activeHighlights = [];

        const query = elements.input.value.toLowerCase();
        if (!query) return;

        const tokens = new Set(query.match(/\b[a-z0-9_]+\b/g) || []);
        const mentionedTables = Object.keys(dbNodes.tables).filter(t => tokens.has(t));
        const mentionedCols = Object.keys(dbNodes.cols).filter(c => tokens.has(c));
        const mentionedVals = Object.keys(dbNodes.values).filter(v => tokens.has(v));

        mentionedTables.forEach(t => {
            const color = currentTableColors[t];
            dbNodes.tables[t].forEach(n => {
                n.style.setProperty('--hi-color', color);
                n.classList.add('sql-highlight');
                activeHighlights.push(n);
            });
        });

        mentionedCols.forEach(c => {
            dbNodes.cols[c].forEach(n => {
                if (mentionedTables.length === 0 || mentionedTables.includes(n.dataset.table)) {
                    const color = currentColColors[n.dataset.table];
                    n.style.setProperty('--hi-color', color || TABLE_COLORS[0]);
                    n.classList.add('sql-highlight');
                    activeHighlights.push(n);
                }
            });
        });

        mentionedVals.forEach(v => {
            if (SQL_KEYWORDS_SET.has(v) && v !== 'true' && v !== 'false') return;
            dbNodes.values[v].forEach(n => {
                if (mentionedTables.length === 0 || mentionedTables.includes(n.dataset.table)) {
                    const color = currentValueColors[n.dataset.table];
                    n.style.setProperty('--hi-color', color || TABLE_COLORS[0]);
                    n.classList.add('sql-highlight');
                    activeHighlights.push(n);
                }
            });
        });
    };

    let currentGhostSuggestion = "";
    let currentGhostReplaceLength = 0;

    const updateGhostText = () => {
        const val = elements.input.value;
        const cursor = elements.input.selectionStart;
        const before = val.substring(0, cursor);
        const after = val.substring(cursor);

        const match = before.match(/([a-zA-Z_0-9]+)$/);
        currentGhostSuggestion = "";
        let ghostHtml = '';

        const escapeHTML = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

        if (match) {
            const word = match[1].toLowerCase();
            const suggestions = dictionary.filter(w => w.toLowerCase().startsWith(word) && w.toLowerCase() !== word);
            if (suggestions.length > 0) {
                currentGhostSuggestion = suggestions[0];
                currentGhostReplaceLength = word.length;
                const remainder = currentGhostSuggestion.substring(word.length);
                ghostHtml = escapeHTML(before) + `<span style="color:var(--text-color); opacity:0.35;">${escapeHTML(remainder)}</span>` + escapeHTML(after);
            } else {
                ghostHtml = escapeHTML(before) + escapeHTML(after);
            }
        } else {
            ghostHtml = escapeHTML(before) + escapeHTML(after);
        }

        if (val.endsWith('\n')) ghostHtml += ' ';
        elements.ghost.innerHTML = ghostHtml;
    };

    elements.input.addEventListener('input', () => {
        const val = elements.input.value;
        const cursor = elements.input.selectionStart;

        if (cursor > 0) {
            const match = val.substring(0, cursor).match(/([a-zA-Z_]+)(\s+)$/);
            if (match) {
                const word = match[1];
                const whitespace = match[2];
                if (SQL_KEYWORDS_SET.has(word.toLowerCase()) && word !== word.toUpperCase()) {
                    const newBefore = val.substring(0, cursor - word.length - whitespace.length) + word.toUpperCase() + whitespace;
                    elements.input.value = newBefore + val.substring(cursor);
                    elements.input.selectionStart = elements.input.selectionEnd = cursor;
                }
            }
        }

        updateHighlights();
        updateGhostText();
    }, { passive: true });

    elements.input.addEventListener('scroll', () => {
        elements.ghost.scrollTop = elements.input.scrollTop;
        elements.ghost.scrollLeft = elements.input.scrollLeft;
    }, { passive: true });

    elements.input.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            elements.runBtn.click();
            return;
        }
        if (currentGhostSuggestion && (e.key === 'Tab' || e.key === 'ArrowRight')) {
            if (e.key === 'ArrowRight') {
                const val = elements.input.value;
                const cursor = elements.input.selectionStart;
                const match = val.substring(0, cursor).match(/([a-zA-Z_0-9]+)$/);
                if (!match) return;
            }
            e.preventDefault();
            const val = elements.input.value;
            const cursor = elements.input.selectionStart;
            const before = val.substring(0, cursor - currentGhostReplaceLength);
            const after = val.substring(cursor);
            elements.input.value = before + currentGhostSuggestion + ' ' + after;
            elements.input.selectionStart = elements.input.selectionEnd = before.length + currentGhostSuggestion.length + 1;
            elements.input.dispatchEvent(new Event('input'));
        }
    });

    const showConfirm = (msg, onConfirm) => {
        elements.modalMsg.textContent = msg;
        elements.modalOverlay.style.display = 'flex';

        const confirmBtn = elements.modalOverlay.querySelector('#sql-confirm-yes');
        const cancelBtn = elements.modalOverlay.querySelector('#sql-confirm-no');

        const newConfirm = confirmBtn.cloneNode(true);
        const newCancel = cancelBtn.cloneNode(true);
        confirmBtn.replaceWith(newConfirm);
        cancelBtn.replaceWith(newCancel);

        newCancel.addEventListener('click', () => elements.modalOverlay.style.display = 'none');
        newConfirm.addEventListener('click', () => {
            elements.modalOverlay.style.display = 'none';
            onConfirm();
        });
    };

    elements.undoBtn.addEventListener('click', () => {
        if (historyIndex > 0) {
            historyIndex--;
            db = JSON.parse(JSON.stringify(history[historyIndex]));
            renderDatabase();
            updateButtonStates();
            log('Undid last action.', 'info');
        }
    });

    elements.redoBtn.addEventListener('click', () => {
        if (historyIndex < history.length - 1) {
            historyIndex++;
            db = JSON.parse(JSON.stringify(history[historyIndex]));
            renderDatabase();
            updateButtonStates();
            log('Redid last action.', 'info');
        }
    });

    const pushNewState = (newState, logMsg) => {
        db = newState;
        history = [JSON.parse(JSON.stringify(db))];
        historyIndex = 0;
        renderDatabase();
        updateButtonStates();
        elements.results.innerHTML = `<div class="sql-empty-state">Run a query to see results here.</div>`;
        log(logMsg, 'success');
    };

    elements.closeBtn.addEventListener('click', () => {
        showConfirm("Are you sure you want to close and delete all current database tables?", () => {
            pushNewState({}, 'Database closed (cleared entirely).');
        });
    });

    elements.randomBtn.addEventListener('click', () => {
        showConfirm("Are you sure you want to overwrite your data with a newly generated random database?", () => {
            const randomDB = {};
            const tableNames = ['clients', 'logs', 'assets', 'metrics', 'staff', 'records', 'inventory'];
            const selectedTables = tableNames.sort(() => 0.5 - Math.random()).slice(0, 3);
            selectedTables.forEach(t => {
                const numRows = 6;
                randomDB[t] = [];
                const cols = ['id', ...['name', 'status', 'type', 'amount', 'created_at'].sort(() => 0.5 - Math.random()).slice(0, 2)];
                for (let i = 0; i < numRows; i++) {
                    const row = {};
                    cols.forEach(c => {
                        if (c === 'id') row[c] = i + 1;
                        else if (c === 'amount') row[c] = Math.floor(Math.random() * 1000);
                        else row[c] = ['alpha', 'beta', 'active', 'pending', 'done'][Math.floor(Math.random() * 5)];
                    });
                    randomDB[t].push(row);
                }
            });
            pushNewState(randomDB, 'Generated new random database.');
        });
    });

    elements.createBtn.addEventListener('click', () => {
        showConfirm("Are you sure you want to create a new custom database? Current data will be lost.", () => {
            elements.builderModal.style.display = 'flex';
        });
    });

    elements.bCancel.addEventListener('click', () => {
        elements.builderModal.style.display = 'none';
    });

    elements.bConfirm.addEventListener('click', () => {
        const rows = 6;
        const customDB = {};
        const tables = [
            { t: elements.t1.value.trim().toLowerCase(), c: elements.c1.value },
            { t: elements.t2.value.trim().toLowerCase(), c: elements.c2.value },
            { t: elements.t3.value.trim().toLowerCase(), c: elements.c3.value }
        ];
        let createdCount = 0;
        tables.forEach(({ t, c }) => {
            if (!t) return;
            let cols = c.split(',').map(col => col.trim().toLowerCase()).filter(col => col).slice(0, 3);
            if (cols.length === 0) cols = ['id', 'name', 'value'];
            customDB[t] = [];
            for (let i = 0; i < rows; i++) {
                const row = {};
                cols.forEach(colName => {
                    if (colName === 'id') row[colName] = i + 1;
                    else if (colName.includes('price') || colName.includes('amount') || colName.includes('stock') || colName.includes('views') || colName.includes('likes')) {
                        row[colName] = Math.floor(Math.random() * 1000);
                    } else row[colName] = `data_${Math.floor(Math.random() * 10000)}`;
                });
                customDB[t].push(row);
            }
            createdCount++;
        });
        if (createdCount === 0) {
            customDB['custom_table'] = [];
            for (let i = 0; i < rows; i++) customDB['custom_table'].push({ id: i + 1, name: `data_${i}`, value: Math.random() });
            createdCount = 1;
        }
        elements.builderModal.style.display = 'none';
        elements.t1.value = elements.c1.value = '';
        elements.t2.value = elements.c2.value = '';
        elements.t3.value = elements.c3.value = '';
        pushNewState(customDB, `Created custom database with ${createdCount} table(s).`);
    });

    elements.runBtn.addEventListener('click', () => {
        const query = elements.input.value;
        if (!query) return;
        try {
            const start = performance.now();
            const result = executeSQL(query);
            const ms = (performance.now() - start).toFixed(2);
            if (result.type === 'SELECT') {
                renderTable(result.rows);
                log(`SELECT returned ${result.rows.length} row(s) in ${ms}ms.`, 'success');
            } else {
                elements.results.innerHTML = `<div class="sql-empty-state">Query executed successfully.<br>${result.msg}</div>`;
                log(`${result.type} executed in ${ms}ms. ${result.msg}`, 'success');
            }
        } catch (error) {
            elements.results.innerHTML = `<div class="sql-empty-state" style="color:#ef4444;">Error: ${error.message}</div>`;
            log(error.message, 'error');
        }
    });

    // ─────────────────────────────────────────────────────────────
    // 11. REFERENCE PANEL — compact grouped list of ALL commands
    // ─────────────────────────────────────────────────────────────
    function renderReferences() {
        if (!CMD) return;

        // Group commands by their `category`
        const groups = {}; // { DQL: [...], DML: [...], ... }
        for (const [cmd, meta] of Object.entries(CMD.commands || {})) {
            const cat = meta.category || 'Other';
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push({ cmd, snippet: cmd + ' ', desc: meta.syntax || '' });
        }
        // Aggregate all functions under a single "Functions" group
        const fns = [];
        for (const [group, list] of Object.entries(CMD.scalar_functions || {})) {
            for (const fn of list) fns.push({ cmd: fn, snippet: fn + '(', desc: `${group} function` });
        }
        for (const fn of CMD.aggregate_functions || []) {
            fns.push({ cmd: fn, snippet: fn + '(', desc: 'aggregate function' });
        }
        groups['Functions'] = fns;

        // Operators
        const ops = [];
        for (const [group, list] of Object.entries(CMD.operators || {})) {
            ops.push({ cmd: group, snippet: list[0] + ' ', desc: list.join('  ') });
        }
        groups['Operators'] = ops;

        // Join types
        if (CMD.join_types) {
            groups['Join Types'] = CMD.join_types.map(j => ({ cmd: j, snippet: j + ' JOIN ', desc: 'join clause' }));
        }
        // Data types
        if (CMD.data_types) {
            groups['Data Types'] = CMD.data_types.map(d => ({ cmd: d, snippet: d + ' ', desc: 'column type' }));
        }

        // Preserve a nice category order
        const ORDER = ['DQL','DML','DDL','DCL','TCL','Utility','Operators','Join Types','Functions','Data Types'];
        const orderedKeys = ORDER.filter(k => groups[k]).concat(Object.keys(groups).filter(k => !ORDER.includes(k)));

        let html = '';
        for (const cat of orderedKeys) {
            html += `<div class="sql-ref-group">${cat}</div>`;
            for (const r of groups[cat]) {
                const safeSnippet = (r.snippet || '').replace(/"/g, '&quot;');
                const safeDesc = (r.desc || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                html += `<div class="sql-ref-item" data-snippet="${safeSnippet}" title="${safeDesc}">
                    <div class="sql-ref-cmd">${r.cmd}</div>
                    ${r.desc ? `<div class="sql-ref-desc">${safeDesc}</div>` : ''}
                </div>`;
            }
        }

        elements.refContainer.innerHTML = html;
        elements.refContainer.querySelectorAll('.sql-ref-item').forEach(el => {
            el.addEventListener('click', () => {
                const snippet = el.getAttribute('data-snippet');
                const val = elements.input.value;
                const cursor = elements.input.selectionStart;
                const before = val.substring(0, cursor);
                const after = val.substring(elements.input.selectionEnd);
                elements.input.value = before + snippet + after;
                elements.input.selectionStart = elements.input.selectionEnd = before.length + snippet.length;
                elements.input.focus();
                elements.input.dispatchEvent(new Event('input'));
            });
        });
    }

    // ─────────────────────────────────────────────────────────────
    // 12. BOOT
    // ─────────────────────────────────────────────────────────────
    renderDatabase();
    rebuildDictionary();
    renderReferences();
    updateButtonStates();

    sidebarEntry.addEventListener('click', () => {
        const mainContainer = document.getElementById('content-area');
        Array.from(mainContainer.children).forEach(child => {
            if (child.classList.contains('center-view')) child.classList.add('hidden');
        });
        centerView.classList.remove('hidden');

        const rightContainer = document.getElementById('right-sidebar-top');
        Array.from(rightContainer.children).forEach(child => {
            if (child.id !== 'sql-right-view') child.style.display = 'none';
        });
        rightPanel.classList.add('active');
    });

})();