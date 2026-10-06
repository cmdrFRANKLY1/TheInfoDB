/**
 * SQL Sandbox — Executor
 * Path: modules/sql/functions/sql_executor.js
 */

(function (NS) {
    'use strict';

    NS.createExecutor = function (state, ui) {
        const saveState = ui.saveState;

        function executeSQL(query) {
            query = query.trim().replace(/;\s*$/, '');
            if (!query) throw new Error('Empty query string.');
            const tokens = NS.tokenize(query);
            const ast = NS.parse(tokens);
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
                case 'RELEASE_SAVEPOINT':
                    return { type: 'TCL', msg: `Savepoint '${ast.name}' released.` };
                case 'GRANT': case 'REVOKE':
                    return { type: ast.kind, msg: `${ast.kind} is a no-op in this sandbox.` };
                case 'NOOP_DDL':
                    return { type: 'DDL', msg: ast.msg };
                case 'EXPLAIN': case 'PRAGMA': case 'SHOW': case 'DESCRIBE':
                    return { type: ast.kind, msg: `${ast.kind} is accepted but not simulated.` };
            }
            throw new Error(`Unsupported statement: ${ast.kind}`);
        }

        function executeSelect(ast) {
            let rows;
            if (ast.from) rows = buildRows(ast.from);
            else rows = [{}];

            if (ast.where) {
                rows = rows.filter(r => NS.truthy(NS.evaluateExpr(ast.where, r, {})));
            }

            const hasAgg = ast.columns.some(c => c.expr && containsAggregate(c.expr)) ||
                           (ast.having && containsAggregate(ast.having));
            if (ast.groupBy || hasAgg) {
                rows = applyGroupBy(rows, ast.groupBy, ast.columns, ast.having);
            } else if (ast.having) {
                rows = rows.filter(r => NS.truthy(NS.evaluateExpr(ast.having, r, {})));
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
                        const va = NS.evaluateExpr(o.expr, a, {});
                        const vb = NS.evaluateExpr(o.expr, b, {});
                        const c = NS.compare(va, vb);
                        if (c !== 0) return o.dir === 'DESC' ? -c : c;
                    }
                    return 0;
                });
            }

            if (ast.offset) projected = projected.slice(Number(NS.evaluateExpr(ast.offset, {}, {})));
            if (ast.limit !== null && ast.limit !== undefined) {
                projected = projected.slice(0, Number(NS.evaluateExpr(ast.limit, {}, {})));
            }

            return { type: 'SELECT', rows: projected };
        }

        function buildRows(fromNode) {
            if (fromNode.kind === 'Table') {
                let data;
                if (state.db[fromNode.name]) data = state.db[fromNode.name];
                else if (state.views[fromNode.name]) data = executeSelect(state.views[fromNode.name]).rows;
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
                        if (fromNode.type === 'CROSS' ||
                            (fromNode.on && NS.truthy(NS.evaluateExpr(fromNode.on, merged, {})))) {
                            out.push(merged);
                            matched = true;
                        }
                    }
                    if (!matched && (fromNode.type === 'LEFT' || fromNode.type === 'FULL')) {
                        out.push({ ...l, ...nullify(right[0] || {}) });
                    }
                }

                if (fromNode.type === 'RIGHT' || fromNode.type === 'FULL') {
                    for (const r of right) {
                        const anyLeft = left.some(l =>
                            fromNode.on && NS.truthy(NS.evaluateExpr(fromNode.on, { ...l, ...r }, {}))
                        );
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
            if (node.kind === 'Call' && NS.CMD.aggregate_functions.includes(node.name)) return true;
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
                const key = groupByExprs
                    ? JSON.stringify(groupByExprs.map(e => NS.evaluateExpr(e, r, {})))
                    : '__all__';
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
                        const v = NS.evaluateExpr(col.expr, first, ctx);
                        const alias = col.alias || exprName(col.expr);
                        row[alias] = v;
                    }
                }

                if (groupByExprs) {
                    for (const e of groupByExprs) {
                        if (e.kind === 'Column') row[e.name] = NS.evaluateExpr(e, first, ctx);
                    }
                }

                if (having && !NS.truthy(NS.evaluateExpr(having, row, ctx))) continue;
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
                    const v = NS.evaluateExpr(c.expr, r, {});
                    const name = c.alias || exprName(c.expr);
                    out[name] = v;
                }
                return out;
            });
        }

        function executeInsert(ast) {
            if (!state.db[ast.table]) throw new Error(`Table '${ast.table}' does not exist.`);
            const table = state.db[ast.table];
            const cols = ast.columns || Object.keys(table[0] || {});
            let inserted = 0;

            for (const rowExprs of ast.rows) {
                const row = {};
                cols.forEach((c, i) => {
                    row[c] = rowExprs[i] ? NS.evaluateExpr(rowExprs[i], {}, {}) : null;
                });
                if (row.id === undefined) row.id = Math.floor(Math.random() * 9000) + 2000;
                table.push(row);
                inserted++;
            }

            saveState();
            return { type: 'INSERT', msg: `${inserted} row(s) inserted into ${ast.table}.` };
        }

        function executeUpdate(ast) {
            if (!state.db[ast.table]) throw new Error(`Table '${ast.table}' does not exist.`);
            let count = 0;

            state.db[ast.table] = state.db[ast.table].map(row => {
                const scope = ast.alias ? prefixRow(row, ast.alias) : row;
                if (!ast.where || NS.truthy(NS.evaluateExpr(ast.where, scope, {}))) {
                    count++;
                    const updated = { ...row };
                    for (const a of ast.assignments) {
                        updated[a.col] = NS.evaluateExpr(a.expr, scope, {});
                    }
                    return updated;
                }
                return row;
            });

            saveState();
            return { type: 'UPDATE', msg: `${count} row(s) updated in ${ast.table}.` };
        }

        function executeDelete(ast) {
            if (!state.db[ast.table]) throw new Error(`Table '${ast.table}' does not exist.`);
            const before = state.db[ast.table].length;

            if (ast.where) {
                state.db[ast.table] = state.db[ast.table].filter(
                    r => !NS.truthy(NS.evaluateExpr(ast.where, r, {}))
                );
            } else {
                state.db[ast.table] = [];
            }

            saveState();
            return { type: 'DELETE', msg: `${before - state.db[ast.table].length} row(s) deleted from ${ast.table}.` };
        }

        function executeCreateTable(ast) {
            if (state.db[ast.name] && ast.ifNotExists) {
                return { type: 'DDL', msg: `Table '${ast.name}' already exists.` };
            }
            if (state.db[ast.name]) throw new Error(`Table '${ast.name}' already exists.`);
            state.db[ast.name] = [];
            saveState();
            return { type: 'DDL', msg: `Table '${ast.name}' created with ${ast.columns.length} column(s).` };
        }

        function executeAlterTable(ast) {
            if (!state.db[ast.name]) throw new Error(`Table '${ast.name}' does not exist.`);
            switch (ast.action) {
                case 'ADD':
                    state.db[ast.name].forEach(r => { if (!(ast.column.name in r)) r[ast.column.name] = null; });
                    saveState();
                    return { type: 'DDL', msg: `Column '${ast.column.name}' added to ${ast.name}.` };
                case 'DROP':
                    state.db[ast.name].forEach(r => { delete r[ast.column.name]; });
                    saveState();
                    return { type: 'DDL', msg: `Column '${ast.column.name}' dropped from ${ast.name}.` };
                case 'RENAME_TABLE':
                    state.db[ast.newName] = state.db[ast.name];
                    delete state.db[ast.name];
                    saveState();
                    return { type: 'DDL', msg: `Table '${ast.name}' renamed to '${ast.newName}'.` };
                case 'RENAME_COLUMN':
                    state.db[ast.name].forEach(r => {
                        r[ast.newName] = r[ast.oldName];
                        delete r[ast.oldName];
                    });
                    saveState();
                    return { type: 'DDL', msg: `Column '${ast.oldName}' renamed to '${ast.newName}'.` };
            }
        }

        function executeDropTable(ast) {
            if (!state.db[ast.name]) {
                if (ast.ifExists) return { type: 'DDL', msg: `Table '${ast.name}' does not exist.` };
                throw new Error(`Table '${ast.name}' does not exist.`);
            }
            delete state.db[ast.name];
            saveState();
            return { type: 'DDL', msg: `Table '${ast.name}' dropped.` };
        }

        function executeTruncate(ast) {
            if (!state.db[ast.name]) throw new Error(`Table '${ast.name}' does not exist.`);
            state.db[ast.name] = [];
            saveState();
            return { type: 'DDL', msg: `Table '${ast.name}' truncated.` };
        }

        function executeCreateIndex(ast) {
            if (!state.db[ast.table]) throw new Error(`Table '${ast.table}' does not exist.`);
            state.indexes[ast.name] = { table: ast.table, columns: ast.columns };
            return { type: 'DDL', msg: `Index '${ast.name}' created on ${ast.table}(${ast.columns.join(', ')}).` };
        }
        function executeDropIndex(ast) {
            delete state.indexes[ast.name];
            return { type: 'DDL', msg: `Index '${ast.name}' dropped.` };
        }
        function executeCreateView(ast) {
            state.views[ast.name] = ast.select;
            return { type: 'DDL', msg: `View '${ast.name}' created.` };
        }
        function executeDropView(ast) {
            delete state.views[ast.name];
            return { type: 'DDL', msg: `View '${ast.name}' dropped.` };
        }

        function executeBegin() {
            if (state.transaction) throw new Error('Transaction already in progress.');
            state.transaction = {
                snapshot: JSON.parse(JSON.stringify(state.db)),
                savepoints: {}
            };
            return { type: 'TCL', msg: 'Transaction started.' };
        }
        function executeCommit() {
            if (!state.transaction) throw new Error('No active transaction.');
            state.transaction = null;
            return { type: 'TCL', msg: 'Transaction committed.' };
        }
        function executeRollback(savepoint) {
            if (!state.transaction) throw new Error('No active transaction.');
            if (savepoint) {
                if (!state.transaction.savepoints[savepoint]) {
                    throw new Error(`Savepoint '${savepoint}' not found.`);
                }
                state.db = JSON.parse(JSON.stringify(state.transaction.savepoints[savepoint]));
                saveState();
                return { type: 'TCL', msg: `Rolled back to savepoint '${savepoint}'.` };
            }
            state.db = state.transaction.snapshot;
            state.transaction = null;
            saveState();
            return { type: 'TCL', msg: 'Transaction rolled back.' };
        }
        function executeSavepoint(name) {
            if (!state.transaction) throw new Error('No active transaction.');
            state.transaction.savepoints[name] = JSON.parse(JSON.stringify(state.db));
            return { type: 'TCL', msg: `Savepoint '${name}' set.` };
        }

        // Expose for evaluator (subqueries call NS.executeSelect)
        NS.executeSelect = executeSelect;

        return { executeSQL };
    };

})(window.SQLSandbox);