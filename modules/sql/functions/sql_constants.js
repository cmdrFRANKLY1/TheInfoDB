/**
 * SQL Sandbox — Constants & Catalog Loader
 * Path: modules/sql/functions/sql_constants.js
 */

(function (NS) {
    'use strict';

    // ── Fallback command catalog ──
    NS.FALLBACK_CMD = {
        sql_keywords: [
            'SELECT','FROM','WHERE','INSERT','INTO','VALUES','UPDATE','SET',
            'DELETE','LIMIT','OFFSET','LIKE','ORDER','BY','GROUP','HAVING','JOIN','INNER',
            'LEFT','RIGHT','FULL','OUTER','CROSS','ON','AS','AND','OR','NOT','NULL','IS',
            'IN','BETWEEN','EXISTS','CASE','WHEN','THEN','ELSE','END','DISTINCT','UNION',
            'ALL','INTERSECT','EXCEPT','ASC','DESC','CREATE','TABLE','DROP','ALTER','ADD',
            'COLUMN','RENAME','TO','TRUNCATE','INDEX','VIEW','PRIMARY','KEY','FOREIGN',
            'REFERENCES','UNIQUE','CHECK','DEFAULT','CONSTRAINT','AUTOINCREMENT','BEGIN',
            'COMMIT','ROLLBACK','SAVEPOINT','TRANSACTION','GRANT','REVOKE','WITH','OVER',
            'PARTITION','ROWS','RANGE','PRECEDING','FOLLOWING','UNBOUNDED','CURRENT','ROW',
            'CAST','TRUE','FALSE','IF','REPLACE','TOP','FETCH','NEXT','FIRST','ONLY','TIES',
            'DATABASE','SCHEMA','SEQUENCE','TRIGGER','FUNCTION','PROCEDURE','USER',
            'ROLE','PRIVILEGES','WORK','CHAIN','IMMEDIATE','DEFERRED','EXCLUSIVE','LOCK',
            'MODE','SHARE','NOWAIT','SKIP','LOCKED'
        ],
        aggregate_functions: [
            'COUNT','SUM','AVG','MIN','MAX','GROUP_CONCAT','STRING_AGG','STDDEV','VARIANCE','MEDIAN'
        ],
        scalar_functions: {
            string: [
                'UPPER','LOWER','LENGTH','SUBSTR','SUBSTRING','TRIM','LTRIM','RTRIM',
                'REPLACE','CONCAT','INSTR','LEFT','RIGHT','REVERSE','REPLICATE','SPACE',
                'CHAR','ASCII','UNICODE','FORMAT'
            ],
            numeric: [
                'ABS','CEIL','CEILING','FLOOR','ROUND','TRUNC','SIGN','SQRT','POWER',
                'POW','EXP','LOG','LOG10','MOD','RANDOM','RAND','PI'
            ],
            date: [
                'NOW','CURRENT_DATE','CURRENT_TIME','CURRENT_TIMESTAMP','DATE','TIME',
                'YEAR','MONTH','DAY','HOUR','MINUTE','SECOND','STRFTIME','JULIANDAY',
                'UNIXEPOCH'
            ],
            null: ['COALESCE','NULLIF','IFNULL','ISNULL','IF'],
            type: ['CAST','TYPEOF'],
            misc: ['PRINTF','QUOTE','HEX','RANDOMBLOB','ZEROBLOB']
        },
        operators: {
            comparison: ['=','!=','<>','>','<','>=','<=','<=>'],
            logical:    ['AND','OR','NOT','XOR'],
            arithmetic: ['+','-','*','/','%','||'],
            bitwise:    ['&','|','<<','>>','~'],
            pattern:    ['LIKE','GLOB','REGEXP','MATCH'],
            set:        ['IN','NOT IN','BETWEEN','NOT BETWEEN','EXISTS','NOT EXISTS'],
            null:       ['IS NULL','IS NOT NULL']
        },
        join_types: [
            'INNER','LEFT','RIGHT','FULL','CROSS',
            'LEFT OUTER','RIGHT OUTER','FULL OUTER','NATURAL'
        ],
        data_types: [
            'INTEGER','INT','BIGINT','SMALLINT','TINYINT','DECIMAL','NUMERIC',
            'FLOAT','REAL','DOUBLE','TEXT','VARCHAR','CHAR','CLOB','BLOB',
            'BOOLEAN','BOOL','DATE','TIME','DATETIME','TIMESTAMP'
        ],
        commands: {
            // DQL
            'SELECT':       { syntax: 'SELECT [DISTINCT] cols FROM tbl [WHERE ...] [GROUP BY ...] [HAVING ...] [ORDER BY ...] [LIMIT n]', category: 'DQL' },
            'FROM':         { syntax: 'FROM <table> [alias]', category: 'DQL' },
            'WHERE':        { syntax: 'WHERE <condition>', category: 'DQL' },
            'GROUP BY':     { syntax: 'GROUP BY col1, col2, ...', category: 'DQL' },
            'HAVING':       { syntax: 'HAVING <aggregate condition>', category: 'DQL' },
            'ORDER BY':     { syntax: 'ORDER BY col [ASC|DESC], ...', category: 'DQL' },
            'LIMIT':        { syntax: 'LIMIT n [OFFSET m]', category: 'DQL' },
            'OFFSET':       { syntax: 'OFFSET n', category: 'DQL' },
            'DISTINCT':     { syntax: 'SELECT DISTINCT col ...', category: 'DQL' },
            'UNION':        { syntax: 'SELECT ... UNION [ALL] SELECT ...', category: 'DQL' },
            'INTERSECT':    { syntax: 'SELECT ... INTERSECT SELECT ...', category: 'DQL' },
            'EXCEPT':       { syntax: 'SELECT ... EXCEPT SELECT ...', category: 'DQL' },
            'JOIN':         { syntax: 'tbl1 JOIN tbl2 ON <condition>', category: 'DQL' },
            'INNER JOIN':   { syntax: 'tbl1 INNER JOIN tbl2 ON <condition>', category: 'DQL' },
            'LEFT JOIN':    { syntax: 'tbl1 LEFT [OUTER] JOIN tbl2 ON <condition>', category: 'DQL' },
            'RIGHT JOIN':   { syntax: 'tbl1 RIGHT [OUTER] JOIN tbl2 ON <condition>', category: 'DQL' },
            'FULL JOIN':    { syntax: 'tbl1 FULL [OUTER] JOIN tbl2 ON <condition>', category: 'DQL' },
            'CROSS JOIN':   { syntax: 'tbl1 CROSS JOIN tbl2', category: 'DQL' },
            'ON':           { syntax: 'ON <join condition>', category: 'DQL' },
            'AS':           { syntax: 'expr AS alias', category: 'DQL' },

            // DML
            'INSERT':       { syntax: 'INSERT INTO tbl (cols) VALUES (...), (...)', category: 'DML' },
            'INSERT INTO':  { syntax: 'INSERT INTO tbl [(cols)] VALUES (...)', category: 'DML' },
            'VALUES':       { syntax: 'VALUES (v1, v2, ...)', category: 'DML' },
            'UPDATE':       { syntax: 'UPDATE tbl SET col = expr [WHERE ...]', category: 'DML' },
            'SET':          { syntax: 'SET col = expr [, col2 = expr2 ...]', category: 'DML' },
            'DELETE':       { syntax: 'DELETE FROM tbl [WHERE ...]', category: 'DML' },
            'DELETE FROM':  { syntax: 'DELETE FROM tbl [WHERE ...]', category: 'DML' },
            'REPLACE':      { syntax: 'REPLACE INTO tbl ... (SQLite)', category: 'DML' },

            // DDL — Tables
            'CREATE TABLE': { syntax: 'CREATE TABLE [IF NOT EXISTS] name (col type [constraints], ...)', category: 'DDL' },
            'ALTER TABLE':  { syntax: 'ALTER TABLE name ADD|DROP|RENAME ...', category: 'DDL' },
            'DROP TABLE':   { syntax: 'DROP TABLE [IF EXISTS] name', category: 'DDL' },
            'TRUNCATE':     { syntax: 'TRUNCATE TABLE name', category: 'DDL' },
            'RENAME TABLE': { syntax: 'RENAME TABLE old TO new', category: 'DDL' },

            // DDL — Indexes / Views
            'CREATE INDEX': { syntax: 'CREATE [UNIQUE] INDEX name ON tbl (cols)', category: 'DDL' },
            'DROP INDEX':   { syntax: 'DROP INDEX [IF EXISTS] name', category: 'DDL' },
            'CREATE VIEW':  { syntax: 'CREATE VIEW name AS <select>', category: 'DDL' },
            'DROP VIEW':    { syntax: 'DROP VIEW [IF EXISTS] name', category: 'DDL' },

            // DDL — Other objects (accepted, no-op)
            'CREATE SCHEMA':    { syntax: 'CREATE SCHEMA name', category: 'DDL' },
            'DROP SCHEMA':      { syntax: 'DROP SCHEMA name', category: 'DDL' },
            'CREATE DATABASE':  { syntax: 'CREATE DATABASE name', category: 'DDL' },
            'DROP DATABASE':    { syntax: 'DROP DATABASE name', category: 'DDL' },
            'CREATE SEQUENCE':  { syntax: 'CREATE SEQUENCE name', category: 'DDL' },
            'DROP SEQUENCE':    { syntax: 'DROP SEQUENCE name', category: 'DDL' },
            'CREATE TRIGGER':   { syntax: 'CREATE TRIGGER name ...', category: 'DDL' },
            'DROP TRIGGER':     { syntax: 'DROP TRIGGER name', category: 'DDL' },
            'CREATE FUNCTION':  { syntax: 'CREATE FUNCTION name(...)', category: 'DDL' },
            'DROP FUNCTION':    { syntax: 'DROP FUNCTION name', category: 'DDL' },
            'CREATE PROCEDURE': { syntax: 'CREATE PROCEDURE name(...)', category: 'DDL' },
            'DROP PROCEDURE':   { syntax: 'DROP PROCEDURE name', category: 'DDL' },

            // DCL
            'GRANT':        { syntax: 'GRANT <privileges> ON <object> TO <user>', category: 'DCL' },
            'REVOKE':       { syntax: 'REVOKE <privileges> ON <object> FROM <user>', category: 'DCL' },
            'CREATE USER':  { syntax: 'CREATE USER name', category: 'DCL' },
            'DROP USER':    { syntax: 'DROP USER name', category: 'DCL' },
            'CREATE ROLE':  { syntax: 'CREATE ROLE name', category: 'DCL' },
            'DROP ROLE':    { syntax: 'DROP ROLE name', category: 'DCL' },
            'ALTER USER':   { syntax: 'ALTER USER name ...', category: 'DCL' },

            // TCL
            'BEGIN':            { syntax: 'BEGIN [TRANSACTION]', category: 'TCL' },
            'COMMIT':           { syntax: 'COMMIT [WORK]', category: 'TCL' },
            'ROLLBACK':         { syntax: 'ROLLBACK [TO SAVEPOINT name]', category: 'TCL' },
            'SAVEPOINT':        { syntax: 'SAVEPOINT name', category: 'TCL' },
            'RELEASE SAVEPOINT':{ syntax: 'RELEASE SAVEPOINT name', category: 'TCL' },
            'SET TRANSACTION':  { syntax: 'SET TRANSACTION <mode>', category: 'TCL' },

            // Utility
            'EXPLAIN':  { syntax: 'EXPLAIN <statement>', category: 'Utility' },
            'PRAGMA':   { syntax: 'PRAGMA name [= value]', category: 'Utility' },
            'SHOW':     { syntax: 'SHOW <TABLES|COLUMNS|DATABASES>', category: 'Utility' },
            'DESCRIBE': { syntax: 'DESCRIBE <table>', category: 'Utility' }
        }
    };

    NS.TABLE_COLORS = [
        '#ef4444','#3b82f6','#10b981','#f59e0b',
        '#8b5cf6','#ec4899','#14b8a6','#f43f5e'
    ];

    NS.FIRST_NAMES = [
        'Alice','Bob','Carol','David','Emma','Frank','Grace','Henry','Iris','Jack',
        'Kate','Liam','Mia','Noah','Olivia','Peter','Quinn','Rachel','Sam','Tara',
        'Uma','Victor','Wendy','Xander','Yara','Zane','Nora','Ethan','Chloe','Mason'
    ];
    NS.LAST_NAMES = [
        'Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez',
        'Martinez','Hernandez','Lopez','Gonzalez','Wilson','Anderson','Thomas','Taylor',
        'Moore','Jackson','Martin','Lee','Perez','Thompson','White','Harris','Sanchez'
    ];
    NS.DOMAINS = ['example.com','mail.test','acme.io','demo.dev','sample.net','inbox.app'];
    NS.BOOK_TITLES = [
        'The Silent Algorithm','Echoes of Tomorrow','Neon Horizon','The Last Compiler',
        'Quantum Gardens','Midnight Protocol','The Glass Server','Ashes of Cobalt',
        'Paper Cities',"The Cartographer's Knot",'Wolves of the Wire','Skyline Fracture',
        'The Lantern Keeper','Saltwater Signals','The Orchard at Dusk'
    ];
    NS.BOOK_GENRES = ['Fiction','Sci-Fi','Mystery','Fantasy','History','Biography','Tech','Poetry','Thriller'];
    NS.LAPTOP_BRANDS = ['Acer','Asus','Dell','Framework','HP','Lenovo','MSI','Razer','Samsung','Tuxedo'];
    NS.LAPTOP_MODELS = ['Aero 14','Zenith Pro','Nimbus X','Vertex 7','Slate 13','Titan R','Feather Lite','Nova 16','Pulse Air','Forge 15'];
    NS.CPUS = ['i5-1240P','i7-1360P','i9-13980HX','Ryzen 5 7640U','Ryzen 7 7840HS','Apple M3','Apple M3 Pro','Snapdragon X Elite'];
    NS.ORDER_STATUSES = ['pending','processing','shipped','delivered','cancelled','refunded'];

    // ── Command catalog loader ──
    NS.loadCommandCatalog = function (api, onDone) {
        NS.CMD = NS.FALLBACK_CMD;
        NS.SQL_KEYWORDS_SET = new Set(NS.CMD.sql_keywords.map(k => k.toLowerCase()));

        const base = NS.BASE_DIR || '';
        const url = base + 'sql_cmd_list.json';

        let finished = false;
        const finish = (source) => {
            if (finished) return;
            finished = true;
            NS.SQL_KEYWORDS_SET = new Set(NS.CMD.sql_keywords.map(k => k.toLowerCase()));
            console.log(source
                ? `[SQL Sandbox] Command catalog loaded from ${source}.`
                : '[SQL Sandbox] Using embedded command catalog.');
            onDone();
        };

        try {
            fetch(url, { cache: 'no-cache' })
                .then(r => r.ok ? r.json() : Promise.reject(r.status))
                .then(json => {
                    if (json && typeof json === 'object') {
                        NS.CMD = json;
                        finish('sql_cmd_list.json');
                    } else finish(null);
                })
                .catch(() => finish(null));
        } catch (e) {
            finish(null);
        }
    };

    // ── Live database state factory ──
    NS.createState = function () {
        return {
            db: {},
            views: {},
            indexes: {},
            transaction: null,
            history: [{}],
            historyIndex: 0,
            currentTableColors: {},
            currentColColors: {},
            currentValueColors: {},
            dbNodes: { tables: {}, cols: {}, values: {} },
            activeHighlights: [],
            dictionary: [],
            prefixIndex: new Map(),
            highlightQueued: false,
            ghostQueued: false,
            currentGhostSuggestion: '',
            currentGhostReplaceLength: 0
        };
    };

})(window.SQLSandbox);