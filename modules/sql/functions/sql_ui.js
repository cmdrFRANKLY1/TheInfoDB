/**
 * SQL Sandbox — UI
 * Path: modules/sql/functions/sql_ui.js
 *
 * Builds the DOM, wires events, and exposes NS.buildUI / NS.bootUI.
 */

(function (NS) {
    'use strict';

    NS.buildUI = function (api, existingSidebarEntry) {
        
        // ── Sidebar entry (reuse the one the orchestrator registered) ──
        const sidebarEntry = existingSidebarEntry || (function () {
            const div = document.createElement('div');
            div.className = 'settings-row sql-sidebar-entry';
            div.innerHTML = '<span>SQL Sandbox</span>';
            api.ui.registerElement('left-sidebar-top', div);
            return div;
        })();

        // ── Center view ──
        const centerView = document.createElement('div');
        centerView.className = 'center-view hidden sql-view-container';
        centerView.id = 'sql-view';
        centerView.innerHTML = `
            <div class="sql-view-header">SQL Sandbox</div>

            <div class="sql-editor-results-row">
                <div class="sql-editor-wrapper">
                    <div class="sql-editor-toolbar">
                        <span>query.sql</span>
                        <div style="display:flex; gap: 8px; flex-wrap: wrap; align-items: center;">
                            <button class="sql-btn secondary sql-icon-btn" id="sql-undo-btn" disabled
                                    title="Undo (Ctrl+Z)" aria-label="Undo">
                                <svg viewBox="0 0 24 24" width="16" height="16"
                                     fill="none" stroke="currentColor" stroke-width="2"
                                     stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M3 7v6h6"/>
                                    <path d="M3.51 13a9 9 0 1 0 2.13-5.36L3 10"/>
                                </svg>
                            </button>
                            <button class="sql-btn secondary sql-icon-btn" id="sql-redo-btn" disabled
                                    title="Redo (Ctrl+Y)" aria-label="Redo">
                                <svg viewBox="0 0 24 24" width="16" height="16"
                                     fill="none" stroke="currentColor" stroke-width="2"
                                     stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M21 7v6h-6"/>
                                    <path d="M20.49 13a9 9 0 1 1-2.13-5.36L21 10"/>
                                </svg>
                            </button>
                            <button class="sql-btn secondary" id="sql-create-btn">Create DB</button>
                            <button class="sql-btn secondary" id="sql-random-btn">Random DB</button>
                            <button class="sql-btn secondary" id="sql-close-btn" disabled>Close DB</button>
                            <button class="sql-btn secondary" id="sql-quest-btn">Quest DB</button>
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

            <div class="sql-view-header sql-view-header-sub">Live Database State</div>
            <div class="sql-tables-overview" id="sql-tables-overview"></div>

            <div id="sql-confirm-modal" style="display:none; position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:9999; align-items:center; justify-content:center; contain:strict; border-radius:inherit;">
                <div style="background:var(--panel-bg); border:1px solid var(--border-color); border-radius:6px; padding:20px; width:320px; box-shadow:0 10px 25px rgba(0,0,0,0.5); display:flex; flex-direction:column; gap:16px;">
                    <div id="sql-confirm-msg" style="font-size:0.95rem; font-weight:500;">Are you sure?</div>
                    <div style="display:flex; justify-content:flex-end; gap:8px;">
                        <button class="sql-btn secondary" id="sql-confirm-no">Cancel</button>
                        <button class="sql-btn" id="sql-confirm-yes" style="background:#ef4444;">Confirm</button>
                    </div>
                </div>
            </div>

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

        // Register panels with the app shell
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
            questBtn: centerView.querySelector('#sql-quest-btn'),
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

        let state = null;
        let showConfirmModal = (msg, onConfirm) => {
            if (window.confirm(msg)) onConfirm();
        };

        const ui = {
            sidebarEntry,
            centerView,
            rightPanel,
            elements,
            executor: null,

            _setState(s) { state = s; },
            _getState() { return state; },

            _replaceDatabase(newDb) {
                if (!state) return;
                state.db = newDb || {};
                state.history = [JSON.parse(JSON.stringify(state.db))];
                state.historyIndex = 0;
                if (typeof NS.renderDatabase === 'function') NS.renderDatabase(state, ui);
                if (typeof NS.updateButtonStates === 'function') NS.updateButtonStates(state, ui);
                if (typeof NS.rebuildDictionary === 'function') NS.rebuildDictionary(state);
                if (elements.results) {
                    elements.results.innerHTML = '<div class="sql-empty-state">Run a query to see results here.</div>';
                }
            },

            showConfirm(msg, onConfirm) { showConfirmModal(msg, onConfirm); },
            _dbExists() { return !!(state && state.db && Object.keys(state.db).length > 0); },
            _clearDatabase() {
                if (!state) return;
                state.db = {};
                state.history = [{}];
                state.historyIndex = 0;
                if (typeof NS.renderDatabase === 'function') NS.renderDatabase(state, ui);
                if (typeof NS.updateButtonStates === 'function') NS.updateButtonStates(state, ui);
                if (typeof NS.rebuildDictionary === 'function') NS.rebuildDictionary(state);
                if (elements.results) {
                    elements.results.innerHTML = '<div class="sql-empty-state">Run a query to see results here.</div>';
                }
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

    NS.bootUI = function (state, ui) {
        ui._setState(state);

        // Sidebar click handler — Exclusive Center View logic
        ui.sidebarEntry.addEventListener('click', () => {
            const mainContainer = document.getElementById('content-area');
            Array.from(mainContainer.children).forEach(child => {
                if (child.classList.contains('center-view')) child.classList.add('hidden');
            });
            ui.centerView.classList.remove('hidden');

            const rightContainer = document.getElementById('right-sidebar-top');
            Array.from(rightContainer.children).forEach(child => {
                if (child.id !== 'sql-right-view') {
                    child.style.display = 'none';
                    child.classList.remove('active');
                } else {
                    child.classList.add('active');
                    child.style.display = 'flex';
                }
            });
        });

        NS.renderDatabase(state, ui);
        NS.rebuildDictionary(state);
        NS.updateButtonStates(state, ui);
    };

    function wireEvents(state, ui) {
        const el = ui.elements;
        const executor = ui.executor;

        const log = (msg, type = 'info') => {
            const div = document.createElement('div');
            div.className = `sql-log-entry ${type}`;
            div.textContent = `[${new Date().toLocaleTimeString([], { hour12: false })}] ${msg}`;
            el.logContainer.appendChild(div);
            el.logContainer.scrollTop = el.logContainer.scrollHeight;
        };
        ui.log = log;

        const saveState = () => {
            state.history = state.history.slice(0, state.historyIndex + 1);
            state.history.push(JSON.parse(JSON.stringify(state.db)));
            state.historyIndex++;
            NS.updateButtonStates(state, ui);
            NS.renderDatabase(state, ui);
        };
        ui.saveState = saveState;

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

        let showConfirmModal = (msg, onConfirm) => {
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

        const pushNewState = (newState, logMsg) => {
            state.db = newState;
            state.history = [JSON.parse(JSON.stringify(state.db))];
            state.historyIndex = 0;
            NS.renderDatabase(state, ui);
            NS.updateButtonStates(state, ui);
            el.results.innerHTML = `<div class="sql-empty-state">Run a query to see results here.</div>`;
            log(logMsg, 'success');
        };

        const dbHasData = () => Object.keys(state.db).length > 0;
        const confirmIfData = (msg, action) => {
            if (dbHasData()) showConfirmModal(msg, action);
            else action();
        };

        el.closeBtn.addEventListener('click', () => {
            showConfirmModal("Are you sure you want to close and delete all current database tables?", () => {
                pushNewState({}, 'Database closed (cleared entirely).');
            });
        });

        el.randomBtn.addEventListener('click', () => {
            confirmIfData(
                "Are you sure you want to overwrite your data with a newly generated random database?",
                () => {
                    const randomDB = NS.generateRandomDB();
                    pushNewState(randomDB, 'Generated new random database.');
                }
            );
        });

        el.questBtn.addEventListener('click', () => {
            if (typeof NS.questOpen === 'function') {
                NS.questOpen(ui, executor);
            } else {
                console.warn('[SQL Sandbox] sql_quest.js not loaded — no Quest to open.');
            }
        });

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

        el.input.addEventListener('input', () => {
            const val = el.input.value;
            const cursor = el.input.selectionStart;

            if (cursor > 0) {
                const match = val.substring(0, cursor).match(/([a-zA-Z_]+)(\s+)$/);
                if (match) {
                    const word = match[1];
                    const lower = word.toLowerCase();

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
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                el.runBtn.click();
                return;
            }

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