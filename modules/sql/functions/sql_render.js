/**
 * SQL Sandbox — Render helpers
 * Path: modules/sql/functions/sql_render.js
 *
 * Owns:
 *   - renderTable(rows, ui)          → results pane
 *   - renderDatabase(state, ui)      → Live Database State grid
 *   - rebuildDictionary(state)       → autocomplete index
 *   - updateButtonStates(state, ui)  → undo/redo/close enable logic
 *   - scheduleHighlight / updateHighlights
 *   - scheduleGhost / updateGhostText
 */

(function (NS) {
    'use strict';

    // ─────────────────────────────────────────────────────────────
    // 1. Results table (query output)
    // ─────────────────────────────────────────────────────────────
    NS.renderTable = function (rows, ui) {
        const el = ui.elements;
        if (!rows || rows.length === 0) {
            el.results.innerHTML = '<div class="sql-empty-state">Query returned 0 rows.</div>';
            return;
        }

        const cols = Object.keys(rows[0]);
        const parts = [];
        parts.push('<table class="sql-table"><thead><tr>');
        for (let i = 0; i < cols.length; i++) {
            parts.push('<th>');
            parts.push(escapeHTML(cols[i]));
            parts.push('</th>');
        }
        parts.push('</tr></thead><tbody>');

        for (let r = 0; r < rows.length; r++) {
            const row = rows[r];
            parts.push('<tr>');
            for (let c = 0; c < cols.length; c++) {
                const v = row[cols[c]];
                parts.push('<td>');
                parts.push(v === null || v === undefined
                    ? '<i style="opacity:0.4">NULL</i>'
                    : escapeHTML(String(v)));
                parts.push('</td>');
            }
            parts.push('</tr>');
        }
        parts.push('</tbody></table>');
        el.results.innerHTML = parts.join('');
    };

    // ─────────────────────────────────────────────────────────────
    // 2. Live Database State render
    // ─────────────────────────────────────────────────────────────
    NS.renderDatabase = function (state, ui) {
        const el = ui.elements;

        // Reset caches
        state.dbNodes.tables = {};
        state.dbNodes.cols = {};
        state.dbNodes.values = {};
        state.activeHighlights = [];

        const tableNames = Object.keys(state.db);
        if (tableNames.length === 0) {
            el.tablesOverview.innerHTML =
                '<div class="sql-empty-state" style="grid-column: 1 / -1;">' +
                'No tables yet. Click <b>Create DB</b> or run <code>CREATE TABLE ...</code> to begin.' +
                '</div>';
            NS.rebuildDictionary(state);
            return;
        }

        // Assign per-table colors
        const palette = NS.TABLE_COLORS;
        for (let i = 0; i < tableNames.length; i++) {
            const key = tableNames[i].toLowerCase();
            state.currentTableColors[key] = palette[i % palette.length];
            state.currentColColors[key]   = palette[(i + 3) % palette.length];
            state.currentValueColors[key] = palette[(i + 6) % palette.length];
        }

        // ── Build all table HTML in one pass ──
        const overviewParts = [];
        for (const tableName of tableNames) {
            const tableData = state.db[tableName];
            const lowerTable = tableName.toLowerCase();

            overviewParts.push(
                '<div class="sql-db-table-wrapper" id="sql-table-wrap-' + tableName + '">'
            );
            overviewParts.push(
                '<div class="sql-db-table-title" id="sql-table-title-' + tableName + '">' +
                    escapeHTML(tableName) +
                    ' <span style="opacity:0.6; font-size:0.75rem; font-weight:normal;">(' +
                        tableData.length + ' rows)</span>' +
                '</div>'
            );
            overviewParts.push('<div class="sql-db-table-scroll">');

            if (tableData.length === 0) {
                overviewParts.push('<div class="sql-empty-state" style="padding:12px;">Empty Table</div>');
            } else {
                const cols = Object.keys(tableData[0]);

                overviewParts.push('<table class="sql-table"><thead><tr>');
                for (let c = 0; c < cols.length; c++) {
                    // th and td share the same class so column highlighting covers both
                    overviewParts.push(
                        '<th class="sql-col-' + tableName + '-' + cols[c] + '">' +
                            escapeHTML(cols[c]) +
                        '</th>'
                    );
                }
                overviewParts.push('</tr></thead><tbody>');

                for (let r = 0; r < tableData.length; r++) {
                    const row = tableData[r];
                    overviewParts.push('<tr>');
                    for (let c = 0; c < cols.length; c++) {
                        const v = row[cols[c]];
                        overviewParts.push(
                            '<td class="sql-col-' + tableName + '-' + cols[c] + '">' +
                                escapeHTML(v === null || v === undefined ? '' : String(v)) +
                            '</td>'
                        );
                    }
                    overviewParts.push('</tr>');
                }
                overviewParts.push('</tbody></table>');
            }

            overviewParts.push('</div></div>');
        }

        // Single assignment → one reflow
        el.tablesOverview.innerHTML = overviewParts.join('');

        // ── Cache DOM nodes for highlighting ──
        for (let t = 0; t < tableNames.length; t++) {
            const tableName = tableNames[t];
            const lowerTable = tableName.toLowerCase();

            const titleNode = document.getElementById('sql-table-title-' + tableName);
            if (titleNode) {
                state.dbNodes.tables[lowerTable] = [titleNode];
            }

            if (state.db[tableName].length === 0) continue;

            const cols = Object.keys(state.db[tableName][0]);
            for (let c = 0; c < cols.length; c++) {
                const colName = cols[c];
                const colNameLower = colName.toLowerCase();

                if (!state.dbNodes.cols[colNameLower]) state.dbNodes.cols[colNameLower] = [];

                // Grab BOTH th and td with this class (needed for column-name highlighting)
                const nodes = el.tablesOverview.querySelectorAll(
                    '.sql-col-' + tableName + '-' + colName
                );

                for (let n = 0; n < nodes.length; n++) {
                    const node = nodes[n];
                    node.dataset.table = lowerTable;
                    state.dbNodes.cols[colNameLower].push(node);

                    // Only index <td> for value-based highlighting
                    if (node.tagName === 'TD') {
                        const valString = String(node.textContent).toLowerCase();
                        if (!valString) continue;
                        if (!state.dbNodes.values[valString]) state.dbNodes.values[valString] = [];
                        state.dbNodes.values[valString].push(node);
                    }
                }
            }
        }

        NS.rebuildDictionary(state);
        NS.scheduleHighlight(state, ui);
    };

    // ─────────────────────────────────────────────────────────────
    // 3. Autocomplete dictionary
    // ─────────────────────────────────────────────────────────────
    NS.rebuildDictionary = function (state) {
        if (!NS.CMD) return;

        const keywords = NS.CMD.sql_keywords || [];
        const dbCols = [];
        for (const t of Object.keys(state.db)) {
            if (state.db[t][0]) {
                for (const c of Object.keys(state.db[t][0])) dbCols.push(c);
            }
        }

        const allFuncs = [];
        for (const list of Object.values(NS.CMD.scalar_functions || {})) {
            for (const f of list) allFuncs.push(f);
        }
        for (const f of (NS.CMD.aggregate_functions || [])) allFuncs.push(f);

        state.prefixIndex = new Map();
        state.dictionary = [];
        const seen = new Set();

        const add = (word) => {
            if (!word || seen.has(word)) return;
            seen.add(word);
            state.dictionary.push(word);
            const lower = word.toLowerCase();
            for (let i = 1; i <= lower.length; i++) {
                const p = lower.slice(0, i);
                if (!state.prefixIndex.has(p)) state.prefixIndex.set(p, word);
            }
        };

        for (const k of keywords) add(k);
        for (const f of allFuncs) add(f);
        for (const t of Object.keys(state.db)) add(t);
        for (const c of dbCols) add(c);
    };

    // ─────────────────────────────────────────────────────────────
    // 4. Button state
    // ─────────────────────────────────────────────────────────────
    NS.updateButtonStates = function (state, ui) {
        const el = ui.elements;
        el.undoBtn.disabled = state.historyIndex <= 0;
        el.redoBtn.disabled = state.historyIndex >= state.history.length - 1;
        el.closeBtn.disabled = Object.keys(state.db).length === 0;
    };

    // ─────────────────────────────────────────────────────────────
    // 5. Highlighting (batched via rAF)
    // ─────────────────────────────────────────────────────────────
    NS.scheduleHighlight = function (state, ui) {
        if (state.highlightQueued) return;
        state.highlightQueued = true;
        requestAnimationFrame(() => {
            state.highlightQueued = false;
            NS.updateHighlights(state, ui);
        });
    };

    NS.updateHighlights = function (state, ui) {
        const el = ui.elements;

        // Clear previous highlights
        const prev = state.activeHighlights;
        for (let i = 0; i < prev.length; i++) prev[i].classList.remove('sql-highlight');
        state.activeHighlights = [];

        const query = el.input.value.toLowerCase();
        if (!query) return;

        const tokens = new Set(query.match(/\b[a-z0-9_]+\b/g) || []);
        if (tokens.size === 0) return;

        const mentionedTables = Object.keys(state.dbNodes.tables).filter(t => tokens.has(t));
        const mentionedCols   = Object.keys(state.dbNodes.cols).filter(c => tokens.has(c));
        const mentionedVals   = Object.keys(state.dbNodes.values).filter(v => tokens.has(v));

        // Highlight mentioned table titles
        for (let i = 0; i < mentionedTables.length; i++) {
            const t = mentionedTables[i];
            const color = state.currentTableColors[t];
            const list = state.dbNodes.tables[t];
            for (let j = 0; j < list.length; j++) {
                const n = list[j];
                n.style.setProperty('--hi-color', color);
                n.classList.add('sql-highlight');
                state.activeHighlights.push(n);
            }
        }

        // Highlight mentioned columns
        for (let i = 0; i < mentionedCols.length; i++) {
            const c = mentionedCols[i];
            const list = state.dbNodes.cols[c];
            for (let j = 0; j < list.length; j++) {
                const n = list[j];
                if (mentionedTables.length === 0 || mentionedTables.includes(n.dataset.table)) {
                    const color = state.currentColColors[n.dataset.table];
                    n.style.setProperty('--hi-color', color || NS.TABLE_COLORS[0]);
                    n.classList.add('sql-highlight');
                    state.activeHighlights.push(n);
                }
            }
        }

        // Highlight mentioned cell values (skip SQL keywords)
        const kwSet = NS.SQL_KEYWORDS_SET;
        for (let i = 0; i < mentionedVals.length; i++) {
            const v = mentionedVals[i];
            if (kwSet.has(v) && v !== 'true' && v !== 'false') continue;
            const list = state.dbNodes.values[v];
            for (let j = 0; j < list.length; j++) {
                const n = list[j];
                if (mentionedTables.length === 0 || mentionedTables.includes(n.dataset.table)) {
                    const color = state.currentValueColors[n.dataset.table];
                    n.style.setProperty('--hi-color', color || NS.TABLE_COLORS[0]);
                    n.classList.add('sql-highlight');
                    state.activeHighlights.push(n);
                }
            }
        }
    };

    // ─────────────────────────────────────────────────────────────
    // 6. Ghost text (autocomplete preview)
    // ─────────────────────────────────────────────────────────────
    NS.scheduleGhost = function (state, ui) {
        if (state.ghostQueued) return;
        state.ghostQueued = true;
        requestAnimationFrame(() => {
            state.ghostQueued = false;
            NS.updateGhostText(state, ui);
        });
    };

    NS.updateGhostText = function (state, ui) {
        const input = ui.elements.input;
        const ghost = ui.elements.ghost;

        const val = input.value;
        const cursor = input.selectionStart;
        const before = val.substring(0, cursor);
        const after = val.substring(cursor);

        const match = before.match(/([a-zA-Z_0-9]+)$/);
        state.currentGhostSuggestion = '';
        state.currentGhostReplaceLength = 0;

        if (match) {
            const word = match[1];
            const lower = word.toLowerCase();
            const suggestion = state.prefixIndex.get(lower);
            if (suggestion && suggestion.toLowerCase() !== lower) {
                state.currentGhostSuggestion = suggestion;
                state.currentGhostReplaceLength = word.length;
            }
        }

        // Fast path: no suggestion → just mirror the textarea
        if (!state.currentGhostSuggestion) {
            const text = val + (val.endsWith('\n') ? ' ' : '');
            if (ghost.textContent !== text) ghost.textContent = text;
            return;
        }

        const remainder = state.currentGhostSuggestion.substring(state.currentGhostReplaceLength);
        ghost.innerHTML =
            escapeHTML(before) +
            '<span style="color:var(--text-color); opacity:0.35;">' + escapeHTML(remainder) + '</span>' +
            escapeHTML(after) +
            (val.endsWith('\n') ? ' ' : '');
    };

    // ─────────────────────────────────────────────────────────────
    // Helpers
    // ─────────────────────────────────────────────────────────────
    function escapeHTML(s) {
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

})(window.SQLSandbox);