/**
 * SQL Sandbox — Reference panel
 * Path: modules/sql/functions/sql_reference.js
 */

(function (NS) {
    'use strict';

    let delegated = false;

    NS.renderReferences = function (CMD, ui) {
        const container = ui.elements.refContainer;
        if (!container || !CMD) return;

        const groups = {};
        for (const [cmd, meta] of Object.entries(CMD.commands || {})) {
            const cat = meta.category || 'Other';
            (groups[cat] = groups[cat] || []).push({
                cmd, snippet: cmd + ' ', desc: meta.syntax || ''
            });
        }

        const fns = [];
        for (const list of Object.values(CMD.scalar_functions || {})) {
            for (const fn of list) fns.push({ cmd: fn, snippet: fn + '(', desc: 'scalar function' });
        }
        for (const fn of CMD.aggregate_functions || []) {
            fns.push({ cmd: fn, snippet: fn + '(', desc: 'aggregate function' });
        }
        groups['Functions'] = fns;

        const ops = [];
        for (const [group, list] of Object.entries(CMD.operators || {})) {
            ops.push({ cmd: group, snippet: list[0] + ' ', desc: list.join('  ') });
        }
        groups['Operators'] = ops;

        if (CMD.join_types) {
            groups['Join Types'] = CMD.join_types.map(j => ({
                cmd: j, snippet: j + ' JOIN ', desc: 'join clause'
            }));
        }
        if (CMD.data_types) {
            groups['Data Types'] = CMD.data_types.map(d => ({
                cmd: d, snippet: d + ' ', desc: 'column type'
            }));
        }

        const ORDER = ['DQL','DML','DDL','DCL','TCL','Utility','Operators','Join Types','Functions','Data Types'];
        const keys = ORDER.filter(k => groups[k])
                          .concat(Object.keys(groups).filter(k => !ORDER.includes(k)));

        const frag = document.createDocumentFragment();
        for (const cat of keys) {
            const g = document.createElement('div');
            g.className = 'sql-ref-group';
            const label = document.createElement('span');
            label.className = 'sql-ref-group-label';
            label.textContent = cat;
            g.appendChild(label);
            frag.appendChild(g);

            for (const r of groups[cat]) {
                const item = document.createElement('div');
                item.className = 'sql-ref-item';
                item.dataset.snippet = r.snippet || '';
                if (r.desc) item.title = r.desc;

                const cmdEl = document.createElement('div');
                cmdEl.className = 'sql-ref-cmd';
                cmdEl.textContent = r.cmd;
                item.appendChild(cmdEl);

                if (r.desc) {
                    const descEl = document.createElement('div');
                    descEl.className = 'sql-ref-desc';
                    descEl.textContent = r.desc;
                    item.appendChild(descEl);
                }
                frag.appendChild(item);
            }
        }
        container.innerHTML = '';
        container.appendChild(frag);

        if (!delegated) {
            delegated = true;
            container.addEventListener('click', (e) => {
                const item = e.target.closest('.sql-ref-item');
                if (!item) return;
                const snippet = item.dataset.snippet || '';
                const input = ui.elements.input;
                const val = input.value;
                const cursor = input.selectionStart;
                input.value = val.substring(0, cursor) + snippet + val.substring(input.selectionEnd);
                input.selectionStart = input.selectionEnd = cursor + snippet.length;
                input.focus();
                input.dispatchEvent(new Event('input'));
            });
        }
    };

})(window.SQLSandbox);