/**
 * SQL Sandbox — Quest Module
 * Path: modules/sql/functions/sql_quest.js
 *
 * A "normalization speedrun" that generates an unnormalized database
 * (NF0) and walks the player through NF1 → NF2 → NF3.
 *
 * Panel states:
 *   setup   — difficulty selector, then Start/Close beneath it, centered
 *   running — timer + progress + actions (Check/Hint/Skip/New Round/Close)
 *   done    — same as running, but Check is disabled
 *
 * Closing the panel with a live database prompts for confirmation,
 * then clears the sandbox database.
 */

(function (NS) {
    'use strict';

    const QUEST_STYLE_ID = 'sql-quest-styles-v11';
    const BEST_TIME_KEY = 'sql-quest-best-time-v1';
    const DIFF_KEY = 'sql-quest-difficulty-v1';

    const QUEST_STYLES = `
        /* ── Banner ── */
        .sql-quest-banner {
            border: 1px solid var(--border-color);
            border-radius: 6px;
            background: var(--panel-bg);
            padding: 8px 12px;
            display: none;
            flex-direction: column;
            gap: 6px;
            flex-shrink: 0;
            font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto,
                         'Helvetica Neue', Arial, sans-serif;
            font-size: 0.82rem;
            line-height: 1.45;
            color: var(--text-color);
            letter-spacing: -0.005em;
        }
        .sql-quest-banner.active { display: flex; }

        .sql-quest-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
        }
        .sql-quest-title {
            display: inline-flex;
            align-items: baseline;
            gap: 8px;
            font-size: 0.88rem;
            font-weight: 600;
            letter-spacing: -0.01em;
            color: var(--text-color);
            flex: 1 1 auto;
        }
        .sql-quest-stage-tag {
            font-size: 0.65rem;
            font-weight: 600;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            color: var(--text-color);
            opacity: 0.55;
        }

        .sql-quest-timer {
            font-size: 0.85rem;
            font-weight: 600;
            font-variant-numeric: tabular-nums;
            letter-spacing: 0.01em;
            color: var(--text-color);
            opacity: 0.9;
            padding: 1px 7px;
            border-radius: 4px;
            background: rgba(0,0,0,0.2);
            flex: 0 0 auto;
        }
        :root.theme-light .sql-quest-timer { background: rgba(0,0,0,0.05); }
        .sql-quest-timer.stopped { color: #22c55e; opacity: 1; }

        .sql-quest-progress {
            display: flex;
            align-items: center;
            gap: 5px;
            flex-wrap: wrap;
            font-size: 0.7rem;
            font-weight: 500;
            letter-spacing: 0.02em;
            user-select: none;
            min-height: 0;
        }
        .sql-quest-step {
            color: var(--text-color);
            opacity: 0.4;
            transition: opacity 0.1s, color 0.1s;
        }
        .sql-quest-step.done { opacity: 0.75; }
        .sql-quest-step.current {
            color: var(--accent-color);
            opacity: 1;
            font-weight: 600;
        }
        .sql-quest-arrow { opacity: 0.25; font-size: 0.7rem; }

        .sql-quest-desc {
            font-size: 0.78rem;
            line-height: 1.5;
            color: var(--text-color);
            opacity: 0.85;
        }
        .sql-quest-desc b { font-weight: 600; opacity: 1; }
        .sql-quest-desc code {
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            font-size: 0.85em;
            padding: 1px 5px;
            border-radius: 3px;
            background: rgba(128,128,128,0.12);
        }

        /* Status messages — no left-border stripe */
        .sql-quest-status {
            font-size: 0.75rem;
            line-height: 1.45;
            padding: 5px 10px;
            border-radius: 4px;
            background: rgba(128,128,128,0.06);
            display: none;
            color: var(--text-color);
        }
        .sql-quest-status.show { display: block; }
        .sql-quest-status.ok   { background: rgba(34,197,94,0.08); }
        .sql-quest-status.err  { background: rgba(239,68,68,0.08); }
        .sql-quest-status.info { background: color-mix(in srgb, var(--accent-color) 8%, transparent); }
        .sql-quest-status ul { margin: 3px 0 0 16px; padding: 0; }
        .sql-quest-status li { margin: 1px 0; }

        /* Centered action rows */
        .sql-quest-row {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            margin-top: 2px;
        }
        .sql-quest-row.setup-actions { margin-top: 4px; }

        .sql-quest-diff-row {
            display: inline-flex;
            align-items: stretch;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            overflow: hidden;
        }
        .sql-quest-diff-label {
            font-size: 0.68rem;
            opacity: 0.5;
            padding: 3px 9px 3px 11px;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            font-weight: 600;
            border-right: 1px solid var(--border-color);
            display: inline-flex;
            align-items: center;
        }
        .sql-quest-diff-btn {
            background: transparent;
            border: none;
            color: var(--text-color);
            font-family: inherit;
            font-size: 0.75rem;
            font-weight: 500;
            padding: 3px 12px;
            cursor: pointer;
            opacity: 0.55;
            border-right: 1px solid var(--border-color);
            transition: background 0.1s, opacity 0.1s, color 0.1s;
        }
        .sql-quest-diff-btn:last-child { border-right: none; }
        .sql-quest-diff-btn:hover:not(.active):not(:disabled) {
            background: rgba(128,128,128,0.1);
            opacity: 0.85;
        }
        .sql-quest-diff-btn.active {
            background: var(--accent-color);
            color: #ffffff;
            opacity: 1;
            font-weight: 600;
        }
        .sql-quest-diff-btn:disabled { cursor: not-allowed; }

        .sql-quest-btn {
            background: transparent;
            border: 1px solid var(--border-color);
            color: var(--text-color);
            padding: 3px 10px;
            border-radius: 4px;
            font-family: inherit;
            font-size: 0.76rem;
            font-weight: 500;
            letter-spacing: -0.005em;
            cursor: pointer;
            transition: background 0.1s, border-color 0.1s;
        }
        .sql-quest-btn:hover:not(:disabled) {
            background: rgba(128,128,128,0.1);
            border-color: var(--accent-color);
        }
        .sql-quest-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .sql-quest-btn.primary {
            background: var(--accent-color);
            border-color: var(--accent-color);
            color: #ffffff;
        }
        .sql-quest-btn.primary:hover:not(:disabled) { opacity: 0.9; background: var(--accent-color); }
        .sql-quest-btn.warn {
            border-color: rgba(239,68,68,0.5);
            color: #ef4444;
        }
        .sql-quest-btn.warn:hover:not(:disabled) {
            background: rgba(239,68,68,0.1);
            border-color: #ef4444;
        }

        .sql-quest-best { font-size: 0.7rem; opacity: 0.55; }
        .sql-quest-best strong {
            color: #22c55e; opacity: 0.9; font-weight: 600;
            font-variant-numeric: tabular-nums;
        }

        /* ── Hint modal ── */
        .sql-quest-modal-backdrop {
            position: absolute; inset: 0;
            background: rgba(0,0,0,0.6);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            border-radius: inherit;
        }
        .sql-quest-modal-backdrop.show { display: flex; }
        .sql-quest-modal {
            background: var(--panel-bg);
            border: 1px solid var(--border-color);
            border-radius: 6px;
            width: min(620px, 92%);
            max-height: 80%;
            display: flex; flex-direction: column;
            box-shadow: 0 20px 40px rgba(0,0,0,0.4);
            font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto,
                         'Helvetica Neue', Arial, sans-serif;
            font-size: 0.85rem;
            letter-spacing: -0.005em;
        }
        .sql-quest-modal-head {
            padding: 10px 14px;
            font-weight: 600;
            font-size: 0.88rem;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .sql-quest-modal-body {
            padding: 12px 14px;
            overflow-y: auto;
            font-size: 0.82rem;
            line-height: 1.55;
        }
        .sql-quest-modal-body h3 {
            font-size: 0.7rem; text-transform: uppercase;
            letter-spacing: 0.08em; opacity: 0.55;
            margin: 14px 0 5px 0; font-weight: 700;
        }
        .sql-quest-modal-body h3:first-child { margin-top: 0; }
        .sql-quest-modal-body p { margin: 0.5em 0; }
        .sql-quest-modal-body ul,
        .sql-quest-modal-body ol { margin: 0.5em 0 0.5em 1.3em; }
        .sql-quest-modal-body li { margin: 0.3em 0; }
        .sql-quest-modal-body code {
            font-family: 'Consolas','Monaco','Courier New',monospace;
            font-size: 0.85em; padding: 1px 5px; border-radius: 3px;
            background: rgba(128,128,128,0.12);
        }
        .sql-quest-modal-body pre {
            background: rgba(0,0,0,0.25);
            border: 1px solid var(--border-color);
            border-radius: 5px;
            padding: 10px 12px;
            font-family: 'Consolas','Monaco','Courier New',monospace;
            font-size: 0.74rem;
            line-height: 1.5;
            overflow-x: auto;
            margin: 8px 0;
            white-space: pre;
            max-height: 240px;
        }
        :root.theme-light .sql-quest-modal-body pre { background: rgba(0,0,0,0.04); }
        .sql-quest-modal-body pre .kw { color: var(--accent-color); font-weight: 600; }
        .sql-quest-modal-body pre .str { color: #10b981; }
        .sql-quest-modal-body pre .num { color: #f59e0b; }
        .sql-quest-modal-body pre .cm { opacity: 0.5; font-style: italic; }

        /* ── Live Database State layout ── */
        .sql-tables-overview {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            align-items: flex-start;
            justify-content: flex-start;
            gap: 12px;
            overflow-x: auto;
            overflow-y: auto;
            contain: content;
            flex: 1 1 auto;
            min-height: 0;
            min-width: 0;
            scrollbar-width: auto;
            scrollbar-color: #6b7280 rgba(255,255,255,0.06);
        }
        .sql-tables-overview::-webkit-scrollbar { width: 14px; height: 14px; background: transparent; }
        .sql-tables-overview::-webkit-scrollbar-track {
            background: rgba(255,255,255,0.06); border-radius: 7px; margin: 2px;
        }
        .sql-tables-overview::-webkit-scrollbar-thumb {
            background: #6b7280; border-radius: 7px; border: 3px solid transparent;
            background-clip: padding-box; min-width: 40px; min-height: 40px;
        }
        .sql-tables-overview::-webkit-scrollbar-thumb:hover {
            background: var(--accent-color); background-clip: padding-box;
        }
        .sql-tables-overview::-webkit-scrollbar-corner { background: transparent; }

        .sql-db-table-wrapper {
            background: var(--panel-bg);
            border: 1px solid var(--border-color);
            border-radius: 6px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            flex: 0 0 auto;
            min-width: 240px;
            max-width: none;
            height: auto;
            max-height: 100%;
            align-self: flex-start;
        }
        .sql-tables-overview > .sql-db-table-wrapper:only-child {
            flex: 1 1 auto;
            min-width: 0;
            align-self: stretch;
            height: auto;
            max-height: 100%;
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
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            flex-shrink: 0;
        }
        .sql-db-table-title > span { flex-shrink: 0; }

        .sql-db-table-scroll {
            overflow: auto;
            overflow-x: auto;
            overflow-y: auto;
            flex: 0 1 auto;
            min-height: 0;
            scrollbar-width: auto;
            scrollbar-color: #6b7280 rgba(255,255,255,0.06);
        }
        .sql-db-table-scroll::-webkit-scrollbar { width: 12px; height: 12px; background: transparent; }
        .sql-db-table-scroll::-webkit-scrollbar-track {
            background: rgba(255,255,255,0.04); border-radius: 6px; margin: 2px;
        }
        .sql-db-table-scroll::-webkit-scrollbar-thumb {
            background: #6b7280; border-radius: 6px; border: 3px solid transparent;
            background-clip: padding-box; min-height: 30px; min-width: 30px;
        }
        .sql-db-table-scroll::-webkit-scrollbar-thumb:hover {
            background: var(--accent-color); background-clip: padding-box;
        }
        .sql-db-table-scroll::-webkit-scrollbar-thumb:active {
            background: var(--accent-color); background-clip: padding-box;
        }
        .sql-db-table-scroll::-webkit-scrollbar-corner { background: transparent; }
    `;

    function installQuestStyles() {
        document.querySelectorAll('style[id^="sql-quest-styles"]').forEach(el => {
            if (el.id !== QUEST_STYLE_ID) el.remove();
        });
        if (document.getElementById(QUEST_STYLE_ID)) return;
        const el = document.createElement('style');
        el.id = QUEST_STYLE_ID;
        el.textContent = QUEST_STYLES;
        document.head.appendChild(el);
    }

    // ─────────────────────────────────────────────────────────────
    // Difficulty
    // ─────────────────────────────────────────────────────────────
    const DIFFICULTIES = {
        easy:   { key: 'easy',   label: 'Easy',   minRows: 3,  maxRows: 5,  maxItems: 2, nullRate: 0.0  },
        medium: { key: 'medium', label: 'Medium', minRows: 6,  maxRows: 9,  maxItems: 3, nullRate: 0.15 },
        hard:   { key: 'hard',   label: 'Hard',   minRows: 12, maxRows: 16, maxItems: 4, nullRate: 0.30 }
    };
    function normalizeDifficultyKey(k) {
        if (!k) return 'medium';
        const v = String(k).toLowerCase();
        return DIFFICULTIES[v] ? v : 'medium';
    }
    function loadDifficulty() {
        try { return normalizeDifficultyKey(localStorage.getItem(DIFF_KEY)); }
        catch (_) { return 'medium'; }
    }
    function saveDifficulty(k) {
        try { localStorage.setItem(DIFF_KEY, normalizeDifficultyKey(k)); } catch (_) {}
    }

    // ─────────────────────────────────────────────────────────────
    // Random data
    // ─────────────────────────────────────────────────────────────
    const FIRST = ['Alice','Bob','Carol','David','Emma','Frank','Grace','Henry','Iris','Jack','Kate','Liam','Mia','Noah','Olivia','Peter','Quinn','Rachel','Sam','Tara'];
    const LAST  = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez','Wilson','Anderson','Thomas','Taylor','Moore','Jackson','Martin','Lee','Perez','White'];
    const CITIES = ['Paris','London','Berlin','Madrid','Rome','Vienna','Lisbon','Prague','Dublin','Oslo'];
    const COUNTRIES = {
        Paris:'France', London:'UK', Berlin:'Germany', Madrid:'Spain',
        Rome:'Italy', Vienna:'Austria', Lisbon:'Portugal',
        Prague:'Czechia', Dublin:'Ireland', Oslo:'Norway'
    };
    const PRODUCTS = ['Laptop','Monitor','Keyboard','Mouse','Headset','Webcam','Speaker','Charger','Cable','Adapter'];

    const rand = n => Math.floor(Math.random() * n);
    const pick = arr => arr[rand(arr.length)];
    const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    function randomName() { return pick(FIRST) + ' ' + pick(LAST); }
    function randomPhone() { return '+1-' + randInt(200,999) + '-' + randInt(100,999) + '-' + randInt(1000,9999); }

    function buildNF0Database(difficultyKey) {
        const d = DIFFICULTIES[normalizeDifficultyKey(difficultyKey)];
        const rows = [];
        const numRows = randInt(d.minRows, d.maxRows);

        for (let i = 0; i < numRows; i++) {
            const customerName = randomName();
            const customerEmail = customerName.toLowerCase().replace(/[^a-z]/g, '.') + '@mail.test';
            const customerPhone = randomPhone();
            const city = pick(CITIES);
            const country = COUNTRIES[city];

            const numItems = randInt(1, d.maxItems);
            const items = [];
            for (let k = 0; k < numItems; k++) {
                items.push({ product: pick(PRODUCTS), qty: randInt(1, 5) });
            }

            const orderId = 'ORD-' + (1000 + i);
            const nullify = (slotIdx) => Math.random() < d.nullRate && slotIdx >= numItems;

            const row = {
                order_id: orderId,
                customer_name: customerName,
                customer_email: customerEmail,
                customer_phone: customerPhone,
                city: city,
                country: country,
                item1: items[0] ? items[0].product : (nullify(0) ? null : pick(PRODUCTS)),
                qty1:  items[0] ? items[0].qty     : (nullify(0) ? null : randInt(1, 5)),
                item2: items[1] ? items[1].product : (nullify(1) ? null : pick(PRODUCTS)),
                qty2:  items[1] ? items[1].qty     : (nullify(1) ? null : randInt(1, 5))
            };
            if (d.maxItems >= 3) {
                row.item3 = items[2] ? items[2].product : null;
                row.qty3  = items[2] ? items[2].qty     : null;
            }
            if (d.maxItems >= 4) {
                row.item4 = items[3] ? items[3].product : null;
                row.qty4  = items[3] ? items[3].qty     : null;
            }
            rows.push(row);
        }
        return { orders_raw: rows };
    }

    // ─────────────────────────────────────────────────────────────
    // Inspection helpers
    // ─────────────────────────────────────────────────────────────
    function tableColumns(db, table) {
        const rows = db[table] || [];
        const cols = new Set();
        for (const r of rows) for (const k of Object.keys(r)) cols.add(k);
        return Array.from(cols);
    }
    function isRepeatingSuffix(col) { return /^(.*?)([1-9]\d*)$/.test(col); }
    function hasListishValues(db, table, col) {
        const rows = db[table] || [];
        for (const r of rows) {
            const v = r[col];
            if (typeof v === 'string' && /[,;|]/.test(v)) return true;
        }
        return false;
    }
    function areColumnsEquivalent(db, table, colA, colB) {
        const rows = db[table] || [];
        const seen = new Map(); const reverse = new Map();
        for (const r of rows) {
            const a = r[colA], b = r[colB];
            if (a === null || b === null) continue;
            if (seen.has(a) && seen.get(a) !== b) return false;
            if (reverse.has(b) && reverse.get(b) !== a) return false;
            seen.set(a, b); reverse.set(b, a);
        }
        return seen.size > 0;
    }
    function functionallyDependent(db, table, a, b) {
        const rows = db[table] || [];
        const map = new Map(); const back = new Map();
        for (const r of rows) {
            const va = r[a], vb = r[b];
            if (va === null || vb === null) continue;
            if (map.has(va) && map.get(va) !== vb) return false;
            map.set(va, vb);
            if (!back.has(vb)) back.set(vb, new Set());
            back.get(vb).add(va);
        }
        if (map.size === 0) return false;
        for (const set of back.values()) if (set.size > 1) return true;
        return true;
    }
    function escapePre(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // ─────────────────────────────────────────────────────────────
    // Validators
    // ─────────────────────────────────────────────────────────────
    function validateNF1(db) {
        const problems = [];
        const tables = Object.keys(db);
        if (!tables.length) { problems.push('No tables found.'); return { ok: false, problems }; }
        let anyRepeating = false, anyComposite = false;
        for (const t of tables) {
            const cols = tableColumns(db, t);
            for (const c of cols) {
                if (isRepeatingSuffix(c)) {
                    const base = c.replace(/[1-9]\d*$/, '');
                    if (cols.includes(base) || cols.some(x => x !== c && x.replace(/[1-9]\d*$/, '') === base)) {
                        anyRepeating = true;
                        problems.push('Table "' + t + '" still has repeating-group column "' + c + '".');
                    }
                }
                if (hasListishValues(db, t, c)) {
                    anyComposite = true;
                    problems.push('Table "' + t + '", column "' + c + '" contains comma/semicolon-separated lists — not atomic.');
                }
            }
        }
        if (!anyRepeating && !anyComposite && tables.length === 1 && tables[0] === 'orders_raw') {
            problems.push('It looks like you renamed nothing — start by splitting "orders_raw" into properly named tables.');
            return { ok: false, problems };
        }
        return { ok: problems.length === 0, problems };
    }

    function validateNF2(db) {
        const problems = [];
        for (const t of Object.keys(db)) {
            const cols = tableColumns(db, t);
            const rows = db[t] || [];
            if (!rows.length) continue;
            const keyCols = cols.filter(c => /(_id|id)$/i.test(c));
            if (keyCols.length < 2) continue;
            for (let i = 0; i < keyCols.length; i++) {
                for (let j = 0; j < keyCols.length; j++) {
                    if (i === j) continue;
                    const k1 = keyCols[i], k2 = keyCols[j];
                    for (const c of cols) {
                        if (keyCols.includes(c)) continue;
                        if (functionallyDependent(db, t, k1, c) &&
                            !functionallyDependent(db, t, k2, c)) {
                            problems.push('Table "' + t + '": column "' + c +
                                '" depends only on "' + k1 + '" (partial dependency) — move it to its own table.');
                        }
                    }
                }
            }
        }
        return { ok: problems.length === 0, problems };
    }

    function validateNF3(db) {
        const problems = [];
        for (const t of Object.keys(db)) {
            const cols = tableColumns(db, t);
            const rows = db[t] || [];
            if (rows.length < 2) continue;
            const keyCols = cols.filter(c => /(_id|id)$/i.test(c));
            for (let i = 0; i < cols.length; i++) {
                for (let j = 0; j < cols.length; j++) {
                    if (i === j) continue;
                    const a = cols[i], b = cols[j];
                    if (keyCols.includes(a) || keyCols.includes(b)) continue;
                    if (functionallyDependent(db, t, a, b) &&
                        !functionallyDependent(db, t, b, a) &&
                        !areColumnsEquivalent(db, t, a, b)) {
                        problems.push('Table "' + t + '": "' + a + '" determines "' + b +
                            '" transitively — extract "' + a + '" into its own table.');
                    }
                }
            }
        }
        return { ok: problems.length === 0, problems };
    }

    // ─────────────────────────────────────────────────────────────
    // Stages
    // ─────────────────────────────────────────────────────────────
    function sampleRowFor(db) {
        if (db.orders_raw && db.orders_raw[0]) return db.orders_raw[0];
        for (const t of Object.keys(db)) if (db[t] && db[t][0]) return db[t][0];
        return {};
    }
    function currentRawTableName(db) {
        if (db.orders_raw) return 'orders_raw';
        for (const t of Object.keys(db)) {
            const cols = tableColumns(db, t);
            if (cols.some(c => /^item\d+$/.test(c)) || cols.some(c => /^qty\d+$/.test(c))) return t;
        }
        return null;
    }

    const STAGES = [
        {
            key: 'NF1', title: 'First Normal Form', short: 'NF1',
            desc: 'Atomic columns only. No repeating groups, no comma-separated lists in cells.',
            hint: function (db) {
                const rawName = currentRawTableName(db);
                const row = sampleRowFor(db);
                const cols = Object.keys(row);
                const itemCols = cols.filter(c => /^item\d+$/.test(c));
                const qtyCols  = cols.filter(c => /^qty\d+$/.test(c));
                const otherCols = cols.filter(c => !/^(item|qty)\d+$/.test(c));
                const fmtList = arr => arr.length ? arr.map(c => '<code>' + c + '</code>').join(', ') : '<i>none</i>';
                const lines = ['<h3>What you have right now</h3>'];
                lines.push('<p>' + (rawName ? 'Your unnormalized table <code>' + rawName + '</code> has one row like this:' : 'Your current schema (one row):') + '</p>');
                lines.push('<pre>' + escapePre(JSON.stringify(row, null, 2)) + '</pre>');
                if (itemCols.length) {
                    lines.push('<p>Notice the repeating columns: ' + fmtList(itemCols) +
                               (qtyCols.length ? ' and ' + fmtList(qtyCols) : '') +
                               '. Each row crams multiple items into the same line.</p>');
                } else if (otherCols.length) {
                    lines.push('<p>Your columns: ' + fmtList(cols) + '.</p>');
                }
                lines.push('<h3>Goal</h3>');
                lines.push('<p>Every cell holds <b>one value</b>. Each order-item gets its own row.</p>');
                lines.push('<h3>Step-by-step</h3><ol>');
                lines.push('<li>Create <b>customers</b>:<br><code>CREATE TABLE customers (customer_id, name, email, phone, city, country);</code></li>');
                lines.push('<li>Create <b>orders</b>:<br><code>CREATE TABLE orders (order_id, customer_id);</code></li>');
                lines.push('<li>Create <b>order_items</b>:<br><code>CREATE TABLE order_items (order_id, product, qty);</code></li>');
                lines.push('<li>Copy data over with <code>INSERT INTO</code> — one row per item.</li>');
                if (rawName) lines.push('<li>Drop the old table:<br><code>DROP TABLE ' + rawName + ';</code></li>');
                lines.push('</ol>');
                lines.push('<h3>Checklist</h3><ul>');
                if (itemCols.length) lines.push('<li>No column named ' + fmtList(itemCols) + '.</li>');
                if (qtyCols.length)  lines.push('<li>No column named ' + fmtList(qtyCols) + '.</li>');
                lines.push('<li>No cell contains commas or lists.</li>');
                lines.push('<li>Each item is on its own row.</li>');
                lines.push('</ul>');
                return lines.join('');
            }
        },
        {
            key: 'NF2', title: 'Second Normal Form', short: 'NF2',
            desc: 'Every non-key column must depend on the whole primary key, not just part of it.',
            hint: function (db) {
                const tables = Object.keys(db);
                let exTable = null, exKeys = null, exBad = null;
                for (const t of tables) {
                    const cols = tableColumns(db, t);
                    const keys = cols.filter(c => /(_id|id)$/i.test(c));
                    if (keys.length < 2) continue;
                    for (const k of keys) {
                        for (const c of cols) {
                            if (keys.includes(c)) continue;
                            const dK = functionallyDependent(db, t, k, c);
                            const dOther = keys.filter(kk => kk !== k).some(kk => functionallyDependent(db, t, kk, c));
                            if (dK && !dOther) { exTable = t; exKeys = keys.slice(0, 2); exBad = { col: c, onlyNeeds: k }; break; }
                        }
                        if (exBad) break;
                    }
                    if (exBad) break;
                }
                const lines = ['<h3>What you have right now</h3>'];
                if (exTable) {
                    lines.push('<p>Table <code>' + exTable + '</code> has a composite key: ' +
                               exKeys.map(k => '<code>' + k + '</code>').join(' + ') + '.</p>');
                    const rows = db[exTable] || [];
                    if (rows.length) lines.push('<pre>' + escapePre(JSON.stringify(rows[0], null, 2)) + '</pre>');
                    lines.push('<p>Column <code>' + exBad.col + '</code> only depends on <code>' +
                               exBad.onlyNeeds + '</code> — a <b>partial dependency</b>.</p>');
                } else {
                    lines.push('<p>No composite-key table detected. Apply the rule to any table with two or more <code>*_id</code> columns.</p>');
                }
                lines.push('<h3>Rule</h3>');
                lines.push('<p>If two columns together form the key, every other column must need both halves. Anything that needs only one belongs in a smaller table.</p>');
                lines.push('<h3>Step-by-step</h3><ol>');
                lines.push('<li>Find every table with two or more <code>*_id</code> columns.</li>');
                lines.push('<li>For each non-key column, ask: does it change if only one half of the key changes? If yes → move it.</li>');
                lines.push('<li>Create the smaller reference table (e.g. <code>products(product_id, product_name)</code>).</li>');
                lines.push('<li>Remove the moved column from the join table.</li>');
                lines.push('</ol>');
                return lines.join('');
            }
        },
        {
            key: 'NF3', title: 'Third Normal Form', short: 'NF3',
            desc: 'No transitive dependencies: no non-key column may determine another non-key column.',
            hint: function (db) {
                const tables = Object.keys(db);
                let exTable = null, exPair = null;
                outer:
                for (const t of tables) {
                    const rows = db[t] || [];
                    if (rows.length < 2) continue;
                    const cols = tableColumns(db, t);
                    const keys = cols.filter(c => /(_id|id)$/i.test(c));
                    for (let i = 0; i < cols.length; i++) {
                        for (let j = 0; j < cols.length; j++) {
                            if (i === j) continue;
                            const a = cols[i], b = cols[j];
                            if (keys.includes(a) || keys.includes(b)) continue;
                            if (functionallyDependent(db, t, a, b) &&
                                !functionallyDependent(db, t, b, a) &&
                                !areColumnsEquivalent(db, t, a, b)) {
                                exTable = t; exPair = [a, b]; break outer;
                            }
                        }
                    }
                }
                const lines = ['<h3>What you have right now</h3>'];
                if (exTable && exPair) {
                    lines.push('<p>Table <code>' + exTable + '</code> has a transitive dependency:</p>');
                    lines.push('<p><code>' + exPair[0] + '</code> determines <code>' + exPair[1] + '</code>.</p>');
                    const rows = db[exTable] || [];
                    if (rows.length) lines.push('<pre>' + escapePre(JSON.stringify(rows[0], null, 2)) + '</pre>');
                } else {
                    lines.push('<p>No transitive dependency detected. Classic offenders: <code>city</code> and <code>country</code> in the same table.</p>');
                }
                lines.push('<h3>Rule</h3>');
                lines.push('<p>If column A always decides column B, and neither A nor B is a key, they belong in a separate lookup table.</p>');
                lines.push('<h3>Example</h3>');
                lines.push('<pre>customers(customer_id, name, city, country)\n-- city determines country → extract:\ncities(city_id, city, country)\ncustomers(customer_id, name, city_id)</pre>');
                lines.push('<h3>Step-by-step</h3><ol>');
                lines.push('<li>Scan for a non-key column that always predicts another non-key column.</li>');
                lines.push('<li>Create a lookup table for the pair — with its own ID.</li>');
                lines.push('<li>Replace the extra column with the new ID.</li>');
                lines.push('</ol>');
                return lines.join('');
            }
        }
    ];

    // ─────────────────────────────────────────────────────────────
    // Mount
    // ─────────────────────────────────────────────────────────────
    NS.mountQuest = function (ui, executor) {
        console.log('[SQL Quest] mountQuest called', { hasUi: !!ui, hasCenterView: !!(ui && ui.centerView) });
        installQuestStyles();

        const container = ui.centerView;
        if (!container) { console.warn('[SQL Quest] No centerView — aborting.'); return; }
        if (container.querySelector('.sql-quest-banner')) { console.log('[SQL Quest] Already mounted.'); return; }

        const banner = document.createElement('div');
        banner.className = 'sql-quest-banner';
        banner.innerHTML = `
            <div class="sql-quest-top">
                <div class="sql-quest-title">
                    <span>Normalization Speedrun</span>
                    <span class="sql-quest-stage-tag" id="sql-quest-stage-tag">setup</span>
                </div>
                <div class="sql-quest-timer" id="sql-quest-timer" style="display:none;">00:00.00</div>
            </div>

            <div class="sql-quest-setup" id="sql-quest-setup">
                <div class="sql-quest-desc" id="sql-quest-setup-desc"></div>
            </div>

            <div class="sql-quest-running" id="sql-quest-running" style="display:none;">
                <div class="sql-quest-progress" id="sql-quest-progress"></div>
                <div class="sql-quest-desc" id="sql-quest-desc"></div>
                <div class="sql-quest-status" id="sql-quest-status"></div>
            </div>

            <div class="sql-quest-row" id="sql-quest-diff-row-wrap">
                <div class="sql-quest-diff-row" id="sql-quest-diff">
                    <span class="sql-quest-diff-label">Difficulty</span>
                    <button class="sql-quest-diff-btn" data-diff="easy">Easy</button>
                    <button class="sql-quest-diff-btn" data-diff="medium">Medium</button>
                    <button class="sql-quest-diff-btn" data-diff="hard">Hard</button>
                </div>
            </div>

            <div class="sql-quest-row setup-actions" id="sql-quest-setup-actions">
                <button class="sql-quest-btn primary" id="sql-quest-start">Start</button>
                <button class="sql-quest-btn warn" id="sql-quest-close">Close</button>
            </div>

            <div class="sql-quest-row" id="sql-quest-run-actions" style="display:none;">
                <button class="sql-quest-btn primary" id="sql-quest-check" disabled>Check</button>
                <button class="sql-quest-btn" id="sql-quest-hint" disabled>Hint</button>
                <button class="sql-quest-btn" id="sql-quest-skip" disabled>Skip</button>
                <button class="sql-quest-btn" id="sql-quest-reset">New Round</button>
                <button class="sql-quest-btn warn" id="sql-quest-close-2">Close</button>
                <span class="sql-quest-best" id="sql-quest-best"></span>
            </div>
        `;

        const editorRow = container.querySelector('.sql-editor-results-row');
        if (editorRow && editorRow.parentNode) editorRow.parentNode.insertBefore(banner, editorRow);
        else container.insertBefore(banner, container.firstChild);

        const modal = document.createElement('div');
        modal.className = 'sql-quest-modal-backdrop';
        modal.id = 'sql-quest-modal';
        modal.innerHTML = `
            <div class="sql-quest-modal">
                <div class="sql-quest-modal-head">
                    <span id="sql-quest-modal-title">Hint</span>
                    <button class="sql-quest-btn" id="sql-quest-modal-close">Close</button>
                </div>
                <div class="sql-quest-modal-body" id="sql-quest-modal-body"></div>
            </div>
        `;
        container.appendChild(modal);

        const el = {
            banner,
            stageTag: banner.querySelector('#sql-quest-stage-tag'),
            timer: banner.querySelector('#sql-quest-timer'),
            setupWrap: banner.querySelector('#sql-quest-setup'),
            setupDesc: banner.querySelector('#sql-quest-setup-desc'),
            runningWrap: banner.querySelector('#sql-quest-running'),
            progress: banner.querySelector('#sql-quest-progress'),
            desc: banner.querySelector('#sql-quest-desc'),
            status: banner.querySelector('#sql-quest-status'),
            diffRowWrap: banner.querySelector('#sql-quest-diff-row-wrap'),
            diffWrap: banner.querySelector('#sql-quest-diff'),
            diffBtns: Array.from(banner.querySelectorAll('.sql-quest-diff-btn')),
            setupActions: banner.querySelector('#sql-quest-setup-actions'),
            runActions: banner.querySelector('#sql-quest-run-actions'),
            startBtn: banner.querySelector('#sql-quest-start'),
            checkBtn: banner.querySelector('#sql-quest-check'),
            hintBtn: banner.querySelector('#sql-quest-hint'),
            skipBtn: banner.querySelector('#sql-quest-skip'),
            resetBtn: banner.querySelector('#sql-quest-reset'),
            closeBtn: banner.querySelector('#sql-quest-close'),
            closeBtn2: banner.querySelector('#sql-quest-close-2'),
            bestEl: banner.querySelector('#sql-quest-best'),
            modal,
            modalTitle: modal.querySelector('#sql-quest-modal-title'),
            modalBody: modal.querySelector('#sql-quest-modal-body'),
            modalClose: modal.querySelector('#sql-quest-modal-close')
        };

        const qs = {
            stageIdx: -1, startedAt: 0, elapsed: 0, running: false, rafId: 0,
            bestMs: loadBestTime(), complete: false, open: false, started: false,
            difficulty: loadDifficulty()
        };

        function fmtTime(ms) {
            const total = Math.floor(ms);
            const m = Math.floor(total / 60000);
            const s = Math.floor((total % 60000) / 1000);
            const cs = Math.floor((total % 1000) / 10);
            return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0') + '.' + String(cs).padStart(2, '0');
        }
        function tick() {
            if (!qs.running) return;
            qs.elapsed = performance.now() - qs.startedAt;
            el.timer.textContent = fmtTime(qs.elapsed);
            qs.rafId = requestAnimationFrame(tick);
        }
        function startTimer() {
            qs.startedAt = performance.now() - qs.elapsed;
            qs.running = true;
            el.timer.classList.remove('stopped');
            cancelAnimationFrame(qs.rafId);
            qs.rafId = requestAnimationFrame(tick);
        }
        function stopTimer() {
            qs.running = false;
            cancelAnimationFrame(qs.rafId);
            el.timer.textContent = fmtTime(qs.elapsed);
            el.timer.classList.add('stopped');
        }

        function loadBestTime() {
            try { const v = localStorage.getItem(BEST_TIME_KEY); return v ? Number(v) : null; }
            catch (_) { return null; }
        }
        function saveBestTime(ms) {
            try { localStorage.setItem(BEST_TIME_KEY, String(Math.floor(ms))); } catch (_) {}
        }
        function refreshBestTime() {
            if (qs.bestMs) el.bestEl.innerHTML = 'best: <strong>' + fmtTime(qs.bestMs) + '</strong>';
            else el.bestEl.textContent = '';
        }

        function renderDifficulty() {
            for (const btn of el.diffBtns) {
                const k = btn.getAttribute('data-diff');
                btn.classList.toggle('active', k === qs.difficulty);
                btn.disabled = qs.started;
            }
        }
        function setDifficulty(k) {
            if (qs.started) return;
            const newKey = normalizeDifficultyKey(k);
            if (newKey === qs.difficulty) return;
            qs.difficulty = newKey;
            saveDifficulty(newKey);
            renderDifficulty();
            if (ui && typeof ui.log === 'function')
                ui.log('Quest: difficulty set to ' + DIFFICULTIES[newKey].label + '.', 'info');
        }

        function renderProgress() {
            const steps = ['NF0', 'NF1', 'NF2', 'NF3'];
            const parts = [];
            for (let i = 0; i < steps.length; i++) {
                let cls = 'sql-quest-step';
                if (i <= qs.stageIdx) cls += ' done';
                else if (i === qs.stageIdx + 1) cls += ' current';
                parts.push('<span class="' + cls + '">' + steps[i] + '</span>');
                if (i < steps.length - 1) parts.push('<span class="sql-quest-arrow">→</span>');
            }
            el.progress.innerHTML = parts.join('');
        }

        function setStatus(kind, html) {
            if (!html) { el.status.className = 'sql-quest-status'; el.status.innerHTML = ''; return; }
            el.status.className = 'sql-quest-status show ' + kind;
            el.status.innerHTML = html;
        }

        function updateBannerForStage() {
            if (!qs.started) {
                el.stageTag.textContent = 'setup';
                el.timer.style.display = 'none';
                el.diffRowWrap.style.display = '';
                el.setupWrap.style.display = '';
                el.runningWrap.style.display = 'none';
                el.setupActions.style.display = '';
                el.runActions.style.display = 'none';
                el.setupDesc.innerHTML =
                    'Choose a <b>difficulty</b> and press <b>Start</b>. ' +
                    'You will receive an unnormalized <code>orders_raw</code> table ' +
                    'and must normalize it step by step: <b>NF1</b> → <b>NF2</b> → <b>NF3</b>.';
                renderDifficulty();
                return;
            }

            el.timer.style.display = '';
            el.diffRowWrap.style.display = 'none';
            el.setupWrap.style.display = 'none';
            el.runningWrap.style.display = '';
            el.setupActions.style.display = 'none';
            el.runActions.style.display = '';

            if (qs.stageIdx >= STAGES.length) {
                el.stageTag.textContent = 'done';
                el.desc.innerHTML = '<b>All stages complete.</b> Press <b>New Round</b> to try again for a faster time.';
                el.checkBtn.disabled = true;
                el.skipBtn.disabled = true;
                el.hintBtn.disabled = false;
                return;
            }

            const s = STAGES[qs.stageIdx];
            el.stageTag.textContent = s.key;
            el.desc.innerHTML = '<b>' + s.title + ':</b> ' + s.desc +
                                ' <span style="opacity:0.55">(' +
                                DIFFICULTIES[qs.difficulty].label +
                                ' — click <b>Hint</b> for step-by-step guidance)</span>';
            el.checkBtn.disabled = false;
            el.skipBtn.disabled = false;
            el.hintBtn.disabled = false;
        }

        function hasExistingDatabase() {
            if (ui && typeof ui._dbExists === 'function') {
                try { return !!ui._dbExists(); } catch (_) { /* fall through */ }
            }
            const state = ui && ui._getState ? ui._getState() : null;
            return !!(state && state.db && Object.keys(state.db).length > 0);
        }

        function startOrConfirm() {
            if (!hasExistingDatabase()) { newRound(); return; }
            const msg = 'The quest will replace the current database with a fresh NF0 set. Continue?';
            if (ui && typeof ui.showConfirm === 'function') {
                try { ui.showConfirm(msg, newRound); return; } catch (_) { /* fall through */ }
            }
            if (window.confirm(msg)) newRound();
        }

        function newRound() {
            qs.stageIdx = 0;
            qs.elapsed = 0;
            qs.complete = false;
            qs.started = true;
            const nf0 = buildNF0Database(qs.difficulty);

            if (ui && typeof ui._replaceDatabase === 'function') ui._replaceDatabase(nf0);
            else {
                const state = ui && ui._getState ? ui._getState() : null;
                if (state) {
                    state.db = nf0;
                    state.history = [JSON.parse(JSON.stringify(nf0))];
                    state.historyIndex = 0;
                    if (typeof NS.renderDatabase === 'function') NS.renderDatabase(state, ui);
                    if (typeof NS.updateButtonStates === 'function') NS.updateButtonStates(state, ui);
                }
            }

            renderProgress();
            updateBannerForStage();
            refreshBestTime();
            setStatus(null, null);
            startTimer();
            if (ui && typeof ui.log === 'function')
                ui.log('Quest: round started (' + DIFFICULTIES[qs.difficulty].label + ').', 'info');
        }

        function openPanel() {
            qs.open = true;
            banner.classList.add('active');
            qs.started = false;
            qs.stageIdx = -1;
            qs.elapsed = 0;
            qs.complete = false;
            stopTimer();
            el.timer.textContent = '00:00.00';
            el.timer.classList.remove('stopped');
            setStatus(null, null);
            renderDifficulty();
            renderProgress();
            updateBannerForStage();
            refreshBestTime();
            if (ui && typeof ui.log === 'function')
                ui.log('Quest: panel opened — pick a difficulty and press Start.', 'info');
        }

        function closePanel() {
            if (hasExistingDatabase()) {
                const msg = 'Closing the speedrun will delete the current database. Continue?';
                const doClose = () => {
                    if (ui && typeof ui._clearDatabase === 'function') {
                        try { ui._clearDatabase(); } catch (_) { /* ignore */ }
                    }
                    qs.open = false;
                    qs.started = false;
                    banner.classList.remove('active');
                    stopTimer();
                    el.timer.classList.remove('stopped');
                    el.timer.textContent = '00:00.00';
                    if (ui && typeof ui.log === 'function') ui.log('Quest: panel closed; database cleared.', 'info');
                };
                if (ui && typeof ui.showConfirm === 'function') {
                    try { ui.showConfirm(msg, doClose); return; } catch (_) { /* fall through */ }
                }
                if (window.confirm(msg)) doClose();
                return;
            }

            qs.open = false;
            qs.started = false;
            banner.classList.remove('active');
            stopTimer();
            el.timer.classList.remove('stopped');
            el.timer.textContent = '00:00.00';
            if (ui && typeof ui.log === 'function') ui.log('Quest: panel closed.', 'info');
        }

        function currentDb() {
            if (ui && ui._getState) return (ui._getState() || {}).db || {};
            return {};
        }

        function checkAnswer() {
            if (!qs.started) return;
            if (qs.stageIdx < 0 || qs.stageIdx >= STAGES.length) return;
            const db = currentDb();
            const stage = STAGES[qs.stageIdx];

            let result;
            if (stage.key === 'NF1') result = validateNF1(db);
            else if (stage.key === 'NF2') result = validateNF2(db);
            else if (stage.key === 'NF3') result = validateNF3(db);

            if (!result || result.ok) {
                qs.stageIdx++;
                renderProgress();
                updateBannerForStage();

                if (qs.stageIdx >= STAGES.length) {
                    qs.complete = true;
                    stopTimer();
                    if (!qs.bestMs || qs.elapsed < qs.bestMs) {
                        qs.bestMs = qs.elapsed;
                        saveBestTime(qs.elapsed);
                        setStatus('ok', 'New personal best! ' + fmtTime(qs.elapsed));
                    } else {
                        setStatus('ok', 'Complete. Time: ' + fmtTime(qs.elapsed) + ' — best: ' + fmtTime(qs.bestMs));
                    }
                    refreshBestTime();
                    if (ui && typeof ui.log === 'function') ui.log('Quest: all stages complete.', 'success');
                } else {
                    setStatus('ok', stage.short + ' complete. Now on ' + STAGES[qs.stageIdx].key + '.');
                    if (ui && typeof ui.log === 'function') ui.log('Quest: ' + stage.short + ' passed.', 'success');
                }
            } else {
                const items = result.problems.map(p => '<li>' + p + '</li>').join('');
                setStatus('err', '<b>' + stage.short + ' issues:</b><ul>' + items + '</ul>');
                if (ui && typeof ui.log === 'function') ui.log('Quest: ' + stage.short + ' failed.', 'error');
            }
        }

        function openHint() {
            if (!qs.started || qs.stageIdx < 0 || qs.stageIdx >= STAGES.length) {
                el.modalTitle.textContent = 'How to play';
                el.modalBody.innerHTML =
                    '<p>Choose a <b>difficulty</b>, press <b>Start</b>, then rewrite the ' +
                    'generated <code>orders_raw</code> table step by step until it satisfies ' +
                    '<b>NF1</b>, <b>NF2</b>, and <b>NF3</b>.</p>' +
                    '<p>Use <b>Check</b> after each step — the validator inspects your schema.</p>';
            } else {
                const s = STAGES[qs.stageIdx];
                el.modalTitle.textContent = s.title + ' — Hint';
                el.modalBody.innerHTML = (typeof s.hint === 'function') ? s.hint(currentDb()) : String(s.hint || '');
            }
            el.modal.classList.add('show');
        }
        function closeHint() { el.modal.classList.remove('show'); }

        for (const btn of el.diffBtns) {
            btn.addEventListener('click', () => setDifficulty(btn.getAttribute('data-diff')));
        }
        el.startBtn.addEventListener('click', startOrConfirm);
        el.checkBtn.addEventListener('click', checkAnswer);
        el.hintBtn.addEventListener('click', openHint);
        el.skipBtn.addEventListener('click', () => {
            if (!qs.started) return;
            if (qs.stageIdx < 0) return;
            qs.stageIdx++;
            renderProgress();
            updateBannerForStage();
            if (qs.stageIdx >= STAGES.length) {
                stopTimer();
                setStatus('info', 'Skipped to end. Time: ' + fmtTime(qs.elapsed));
            } else {
                setStatus('info', 'Skipped. Now on ' + STAGES[qs.stageIdx].key + '.');
            }
        });
        el.resetBtn.addEventListener('click', startOrConfirm);
        el.closeBtn.addEventListener('click', closePanel);
        el.closeBtn2.addEventListener('click', closePanel);
        el.modalClose.addEventListener('click', closeHint);
        el.modal.addEventListener('click', (e) => { if (e.target === el.modal) closeHint(); });

        renderDifficulty();
        renderProgress();
        updateBannerForStage();
        refreshBestTime();

        NS._questStartRound = newRound;
        NS._questOpenPanel  = openPanel;
        NS._questClosePanel = closePanel;

        console.log('[SQL Quest] Mounted.');
    };

    NS.questOpen = function (ui, executor) {
        if (typeof NS._questOpenPanel === 'function') NS._questOpenPanel();
        else console.warn('[SQL Quest] Not mounted yet.');
    };
    NS.questClose = function () {
        if (typeof NS._questClosePanel === 'function') NS._questClosePanel();
    };
    NS.questNewRound = function (ui, executor) {
        if (typeof NS._questStartRound === 'function') NS._questStartRound();
        else {
            const btn = ui && ui.centerView && ui.centerView.querySelector('#sql-quest-reset');
            if (btn) btn.click();
        }
    };

})(window.SQLSandbox);