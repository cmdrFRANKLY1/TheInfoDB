/**
 * SQL Sandbox — UI
 * Path: modules/sql/functions/sql_ui.js
 *
 * Builds the DOM, wires events, and exposes NS.buildUI / NS.bootUI.
 */

(function (NS) {
    'use strict';

    // ─────────────────────────────────────────────────────────────
    // buildUI — creates and registers the DOM, returns a UI facade
    // ─────────────────────────────────────────────────────────────
    NS.buildUI = function (api) {
        // ── Sidebar entry ──
        const sidebarEntry = document.createElement('div');
        sidebarEntry.className = 'settings-row';
        sidebarEntry.innerHTML = '<span>SQL Sandbox</span>';

        // ── Center view ──
        const centerView = document.createElement('div');
        centerView.className = 'center-view hidden sql-view-container';
        centerView.id = 'sql-view';
        centerView.innerHTML = `
            <div class="sql-view-header">SQL Sandbox</div>

            <!-- Editor + Results side-by-side -->
            <div class="sql-editor-results-row">
                <div class="sql-editor-wrapper">
                    <div class="sql-editor-toolbar">
                        <span>query.sql</span>
                        <div style="display:flex; gap: 8px; flex-wrap: wrap;">
                            <button class="sql-btn secondary" id="sql-undo-btn" disabled>Undo</button>
                            <button class="sql-btn secondary" id="sql-redo-btn" disabled>Redo</button>
                            <button class="sql-btn secondary" id="sql-create-btn">Create DB</button>
                            <button class="sql-btn secondary" id="sql-random-btn">Random DB</button>
                            <button class="sql-btn secondary" id="sql-close-btn" disabled>Close DB</button>
                            <button class="sql-btn" id="sql-run-btn" title="Execute Query (Ctrl+Enter)">Execute Run</button>
                        </div>
                    </div>
                    <div class="sql-textarea-container">
                        <div id="sql-ghost" class="sql-ghost-textarea"></div>
                        <textarea class="sql-textarea" id="sql-input" spellcheck="false" placeholder=""></textarea>
                    </div>
                </div>

                <div class="sql-results-container" id="sql-results">
                    <div class="sql-empty-state">Run a query to see results here.</div>
                </div>
            </div>

            <!-- Live Database State -->
            <div class="sql-view-header sql-view-header-sub">Live Database State</div>
            <div class="sql-tables-overview" id="sql-tables-overview"></div>

            <!-- Confirmation modal -->
            <div id="sql-confirm-modal" style="display:none; position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:9999; align-items:center; justify-content:center; contain:strict; border-radius:inherit;">
                <div style="background:var(--panel-bg); border:1px solid var(--border-color); border-radius:6px; padding:20px; width:320px; box-shadow:0 10px 25px rgba(0,0,0,0.5); display:flex; flex-direction:column; gap:16px;">
                    <div id="sql-confirm-msg" style="font-size:0.95rem; font-weight:500;">Are you sure?</div>
                    <div style="display:flex; justify-content:flex-end; gap:8px;">
                        <button class="sql-btn secondary" id="sql-confirm-no">Cancel</button>
                        <button class="sql-btn" id="sql-confirm-yes" style="background:#ef4444;">Confirm</button>
                    </div>
                </div>
            </div>

            <!-- Custom DB builder modal -->
            <div id="sql-builder-modal" style="display:none; position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:9999; align-items:center; justify-content:center; contain:strict; border-radius:inherit;">
                <div style="background:var(--panel-bg); border:1px solid var(--border-color); border-radius:6px; padding:20px; width:400px; box-shadow:0 10px 25px rgba(0,0,0,0.5); display:flex; flex-direction:column; gap:12px;">
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

        // ── Right panel ──
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

        // ── Register with the app shell ──
        api.ui.registerElement('left-sidebar-top', sidebarEntry);
        api.ui.registerElement('content-panel', centerView);
        api.ui.registerElement('right-sidebar-top', rightPanel);

        // ── Element cache ──
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

        // Private closure state — set via _setState / attachExecutor
        let state = null;

        const ui = {
            sidebarEntry,
            centerView,
            rightPanel,
            elements,
            executor: null,

            _setState(s) {
                state = s;
            },

            attachExecutor(executor, s) {
                if (s) state = s;
                ui.executor = executor;

                if (!state) {
                    console.error('[SQL Sandbox] attachExecutor called with null state.');
                    return;
                }

                wireEvents(state, ui);
            }
        };

        return ui;
    };

    // ─────────────────────────────────────────────────────────────
    // bootUI — sidebar click handler + initial render
    // ─────────────────────────────────────────────────────────────
    NS.bootUI = function (state, ui) {
        ui._setState(state);

        ui.sidebarEntry.addEventListener('click', () => {
            const mainContainer = document.getElementById('content-area');
            Array.from(mainContainer.children).forEach(child => {
                if (child.classList.contains('center-view')) child.classList.add('hidden');
            });
            ui.centerView.classList.remove('hidden');

            const rightContainer = document.getElementById('right-sidebar-top');
            Array.from(rightContainer.children).forEach(child => {
                if (child.id !== 'sql-right-view') child.style.display = 'none';
            });
            ui.rightPanel.classList.add('active');
        });

        // Initial render
        NS.renderDatabase(state, ui);
        NS.rebuildDictionary(state);
        NS.updateButtonStates(state, ui);
    };

    // ─────────────────────────────────────────────────────────────
    // wireEvents — hooks up all interactive controls
    // ─────────────────────────────────────────────────────────────
    function wireEvents(state, ui) {
        const el = ui.elements;
        const executor = ui.executor;

        // ── Log helper ──
        const log = (msg, type = 'info') => {
            const div = document.createElement('div');
            div.className = `sql-log-entry ${type}`;
            div.textContent = `[${new Date().toLocaleTimeString([], { hour12: false })}] ${msg}`;
            el.logContainer.appendChild(div);
            el.logContainer.scrollTop = el.logContainer.scrollHeight;
        };
        ui.log = log;

        // ── saveState (called by executor after each mutation) ──
        const saveState = () => {
            state.history = state.history.slice(0, state.historyIndex + 1);
            state.history.push(JSON.parse(JSON.stringify(state.db)));
            state.historyIndex++;
            NS.updateButtonStates(state, ui);
            NS.renderDatabase(state, ui);
        };
        ui.saveState = saveState;

        // ── Run query ──
        el.runBtn.addEventListener('click', () => {
            const query = el.input.value;
            if (!query) return;
            try {
                const start = performance.now();
                const result = executor.executeSQL(query);
                const ms = (performance.now() - start).toFixed(2);
                if (result.type === 'SELECT') {
                    NS.renderTable(result.rows, ui);
                    log(`SELECT returned ${result.rows.length} row(s) in ${ms}ms.`, 'success');
                } else {
                    el.results.innerHTML = `<div class="sql-empty-state">Query executed successfully.<br>${result.msg}</div>`;
                    log(`${result.type} executed in ${ms}ms. ${result.msg}`, 'success');
                }
            } catch (error) {
                el.results.innerHTML = `<div class="sql-empty-state" style="color:#ef4444;">Error: ${error.message}</div>`;
                log(error.message, 'error');
            }
        });

        // ── Undo / Redo ──
        el.undoBtn.addEventListener('click', () => {
            if (state.historyIndex > 0) {
                state.historyIndex--;
                state.db = JSON.parse(JSON.stringify(state.history[state.historyIndex]));
                NS.renderDatabase(state, ui);
                NS.updateButtonStates(state, ui);
                log('Undid last action.', 'info');
            }
        });

        el.redoBtn.addEventListener('click', () => {
            if (state.historyIndex < state.history.length - 1) {
                state.historyIndex++;
                state.db = JSON.parse(JSON.stringify(state.history[state.historyIndex]));
                NS.renderDatabase(state, ui);
                NS.updateButtonStates(state, ui);
                log('Redid last action.', 'info');
            }
        });

        // ── Confirmation modal helper ──
        const showConfirm = (msg, onConfirm) => {
            el.modalMsg.textContent = msg;
            el.modalOverlay.style.display = 'flex';

            const confirmBtn = el.modalOverlay.querySelector('#sql-confirm-yes');
            const cancelBtn = el.modalOverlay.querySelector('#sql-confirm-no');

            const newConfirm = confirmBtn.cloneNode(true);
            const newCancel = cancelBtn.cloneNode(true);
            confirmBtn.replaceWith(newConfirm);
            cancelBtn.replaceWith(newCancel);

            newCancel.addEventListener('click', () => { el.modalOverlay.style.display = 'none'; });
            newConfirm.addEventListener('click', () => {
                el.modalOverlay.style.display = 'none';
                onConfirm();
            });
        };

        // ── Push a new DB state (resets history) ──
        const pushNewState = (newState, logMsg) => {
            state.db = newState;
            state.history = [JSON.parse(JSON.stringify(state.db))];
            state.historyIndex = 0;
            NS.renderDatabase(state, ui);
            NS.updateButtonStates(state, ui);
            el.results.innerHTML = `<div class="sql-empty-state">Run a query to see results here.</div>`;
            log(logMsg, 'success');
        };

        // ── Confirm only if data exists ──
        const dbHasData = () => Object.keys(state.db).length > 0;
        const confirmIfData = (msg, action) => {
            if (dbHasData()) showConfirm(msg, action);
            else action();
        };

        // ── Close DB ──
        el.closeBtn.addEventListener('click', () => {
            showConfirm("Are you sure you want to close and delete all current database tables?", () => {
                pushNewState({}, 'Database closed (cleared entirely).');
            });
        });

        // ── Random DB ──
        el.randomBtn.addEventListener('click', () => {
            confirmIfData(
                "Are you sure you want to overwrite your data with a newly generated random database?",
                () => {
                    const randomDB = NS.generateRandomDB();
                    pushNewState(randomDB, 'Generated new random database.');
                }
            );
        });

        // ── Custom DB builder ──
        el.createBtn.addEventListener('click', () => {
            confirmIfData(
                "Are you sure you want to create a new custom database? Current data will be lost.",
                () => { el.builderModal.style.display = 'flex'; }
            );
        });

        el.bCancel.addEventListener('click', () => {
            el.builderModal.style.display = 'none';
        });

        el.bConfirm.addEventListener('click', () => {
            const rows = 20;
            const customDB = {};
            const tables = [
                { t: el.t1.value.trim().toLowerCase(), c: el.c1.value },
                { t: el.t2.value.trim().toLowerCase(), c: el.c2.value },
                { t: el.t3.value.trim().toLowerCase(), c: el.c3.value }
            ];
            let createdCount = 0;
            tables.forEach(({ t, c }) => {
                if (!t) return;
                let cols = c.split(',').map(col => col.trim().toLowerCase()).filter(Boolean).slice(0, 3);
                if (cols.length === 0) cols = ['id', 'name', 'value'];
                customDB[t] = [];
                for (let i = 0; i < rows; i++) {
                    const row = {};
                    cols.forEach(colName => {
                        if (colName === 'id') row[colName] = i + 1;
                        else if (/price|amount|stock|views|likes/.test(colName)) {
                            row[colName] = Math.floor(Math.random() * 1000);
                        } else row[colName] = `data_${Math.floor(Math.random() * 10000)}`;
                    });
                    customDB[t].push(row);
                }
                createdCount++;
            });
            if (createdCount === 0) {
                customDB['custom_table'] = [];
                for (let i = 0; i < rows; i++) {
                    customDB['custom_table'].push({ id: i + 1, name: `data_${i}`, value: Math.random() });
                }
                createdCount = 1;
            }
            el.builderModal.style.display = 'none';
            el.t1.value = el.c1.value = '';
            el.t2.value = el.c2.value = '';
            el.t3.value = el.c3.value = '';
            pushNewState(customDB, `Created custom database with ${createdCount} table(s).`);
        });

        // ── Editor input: keyword auto-uppercase (skipped for identifiers) ──
        el.input.addEventListener('input', () => {
            const val = el.input.value;
            const cursor = el.input.selectionStart;

            // Auto-uppercase the tail word if it's a SQL keyword AND is NOT a
            // known identifier (table/column/value) in the current DB.
            if (cursor > 0) {
                const match = val.substring(0, cursor).match(/([a-zA-Z_]+)(\s+)$/);
                if (match) {
                    const word = match[1];
                    const lower = word.toLowerCase();

                    // Is the word an identifier in the current DB?
                    const isIdentifier = !!(
                        state.dbNodes.cols[lower] ||
                        state.dbNodes.tables[lower] ||
                        state.dbNodes.values[lower]
                    );

                    if (!isIdentifier &&
                        NS.SQL_KEYWORDS_SET.has(lower) &&
                        word !== word.toUpperCase()) {
                        const ws = match[2];
                        el.input.value =
                            val.substring(0, cursor - word.length - ws.length) +
                            word.toUpperCase() + ws +
                            val.substring(cursor);
                        el.input.selectionStart = el.input.selectionEnd = cursor;
                    }
                }
            }

            NS.scheduleHighlight(state, ui);
            NS.scheduleGhost(state, ui);
        }, { passive: true });

        el.input.addEventListener('scroll', () => {
            el.ghost.scrollTop = el.input.scrollTop;
            el.ghost.scrollLeft = el.input.scrollLeft;
        }, { passive: true });

        el.input.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter → run
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                el.runBtn.click();
                return;
            }

            // Tab or Right arrow → accept ghost suggestion
            if (state.currentGhostSuggestion && (e.key === 'Tab' || e.key === 'ArrowRight')) {
                if (e.key === 'ArrowRight') {
                    const val = el.input.value;
                    const cursor = el.input.selectionStart;
                    if (!val.substring(0, cursor).match(/([a-zA-Z_0-9]+)$/)) return;
                }
                e.preventDefault();
                const val = el.input.value;
                const cursor = el.input.selectionStart;
                const before = val.substring(0, cursor - state.currentGhostReplaceLength);
                const after = val.substring(cursor);
                el.input.value = before + state.currentGhostSuggestion + ' ' + after;
                el.input.selectionStart = el.input.selectionEnd =
                    before.length + state.currentGhostSuggestion.length + 1;
                el.input.dispatchEvent(new Event('input'));
            }
        });
    }

})(window.SQLSandbox);