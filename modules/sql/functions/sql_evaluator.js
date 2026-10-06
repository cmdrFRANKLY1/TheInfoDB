/**
 * SQL Sandbox — Expression Evaluator
 * Path: modules/sql/functions/sql_evaluator.js
 */

(function (NS) {
    'use strict';

    NS.evaluateExpr = function (node, row, context) {
        if (!node) return null;
        switch (node.kind) {
            case 'Literal': return node.value;
            case 'Star': return row;
            case 'Column': return evalColumn(node, row);
            case 'Binary': return evalBinary(node, row, context);
            case 'Unary': {
                const v = NS.evaluateExpr(node.expr, row, context);
                switch (node.op) {
                    case 'NOT': return !truthy(v);
                    case '-': return -Number(v);
                    case '+': return +Number(v);
                    case '~': return ~Number(v);
                }
                return null;
            }
            case 'IsNull': {
                const v = NS.evaluateExpr(node.expr, row, context);
                return node.negated ? v !== null && v !== undefined : v === null || v === undefined;
            }
            case 'In': {
                const v = NS.evaluateExpr(node.expr, row, context);
                let set;
                if (node.items.kind === 'Subquery') {
                    set = NS.executeSelect(node.items.select).rows.map(r => Object.values(r)[0]);
                } else {
                    set = node.items.items.map(e => NS.evaluateExpr(e, row, context));
                }
                const found = set.some(s => looseEq(s, v));
                return node.negated ? !found : found;
            }
            case 'Between': {
                const v = NS.evaluateExpr(node.expr, row, context);
                const lo = NS.evaluateExpr(node.lo, row, context);
                const hi = NS.evaluateExpr(node.hi, row, context);
                const inRange = compare(v, lo) >= 0 && compare(v, hi) <= 0;
                return node.negated ? !inRange : inRange;
            }
            case 'Exists': {
                const r = NS.executeSelect(node.select);
                return r.rows.length > 0;
            }
            case 'Call': return evalFunction(node, row, context);
            case 'Case': return evalCase(node, row, context);
            case 'Cast': return castValue(NS.evaluateExpr(node.expr, row, context), node.type);
            default: throw new Error(`Unsupported expression kind: ${node.kind}`);
        }
    };

    function evalColumn(node, row) {
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
        if (op === 'AND') return truthy(NS.evaluateExpr(node.left, row, context)) &&
                                  truthy(NS.evaluateExpr(node.right, row, context));
        if (op === 'OR')  return truthy(NS.evaluateExpr(node.left, row, context)) ||
                                  truthy(NS.evaluateExpr(node.right, row, context));

        const a = NS.evaluateExpr(node.left, row, context);
        const b = NS.evaluateExpr(node.right, row, context);

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
            case 'LIKE':     return likeMatch(a, b);
            case 'NOT LIKE': return !likeMatch(a, b);
            case 'GLOB':     return globMatch(a, b);
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
        const pattern = String(b).replace(/[.+^${}()|[\]\\]/g, '\\$&')
                                 .replace(/%/g, '.*').replace(/_/g, '.');
        return new RegExp('^' + pattern + '$', 'i').test(String(a));
    }

    function globMatch(a, b) {
        if (a === null || b === null) return false;
        const pattern = String(b).replace(/[.+^${}()|[\]\\]/g, '\\$&')
                                 .replace(/\*/g, '.*').replace(/\?/g, '.');
        return new RegExp('^' + pattern + '$').test(String(a));
    }

    function evalCase(node, row, ctx) {
        const base = node.base ? NS.evaluateExpr(node.base, row, ctx) : null;
        for (const w of node.whens) {
            const cond = NS.evaluateExpr(w.cond, row, ctx);
            if (node.base ? looseEq(base, cond) : truthy(cond)) {
                return NS.evaluateExpr(w.val, row, ctx);
            }
        }
        return node.elseVal ? NS.evaluateExpr(node.elseVal, row, ctx) : null;
    }

    function castValue(v, type) {
        const t = String(type).toUpperCase();
        if (t.includes('INT')) return parseInt(v, 10);
        if (t.includes('REAL') || t.includes('FLOAT') || t.includes('DOUBLE') ||
            t.includes('DECIMAL') || t.includes('NUMERIC')) return parseFloat(v);
        if (t.includes('BOOL')) return truthy(v);
        if (t.includes('TEXT') || t.includes('CHAR') || t.includes('CLOB')) return String(v);
        return v;
    }

    function evalFunction(node, row, ctx) {
        const name = node.name;
        if (NS.CMD.aggregate_functions.includes(name)) {
            const rows = (ctx && ctx.groupRows) || [row];
            const values = rows.map(r => node.args.length ? NS.evaluateExpr(node.args[0], r, ctx) : r);
            return aggregate(name, values, node.distinct);
        }
        const args = node.args.map(a => NS.evaluateExpr(a, row, ctx));
        return scalarFunction(name, args);
    }

    function aggregate(name, values, distinct) {
        let vals = values.filter(v => v !== null && v !== undefined);
        if (distinct) vals = [...new Set(vals)];
        switch (name) {
            case 'COUNT': return vals.length;
            case 'SUM': return vals.reduce((a, b) => a + Number(b), 0);
            case 'AVG': return vals.length ? vals.reduce((a, b) => a + Number(b), 0) / vals.length : null;
            case 'MIN': return vals.length ? vals.reduce((a, b) => compare(a, b) < 0 ? a : b) : null;
            case 'MAX': return vals.length ? vals.reduce((a, b) => compare(a, b) > 0 ? a : b) : null;
            case 'GROUP_CONCAT':
            case 'STRING_AGG': return vals.join(',');
            case 'STDDEV': {
                if (!vals.length) return null;
                const m = vals.reduce((a, b) => a + Number(b), 0) / vals.length;
                return Math.sqrt(vals.reduce((a, b) => a + (Number(b) - m) ** 2, 0) / vals.length);
            }
            case 'VARIANCE': {
                if (!vals.length) return null;
                const m = vals.reduce((a, b) => a + Number(b), 0) / vals.length;
                return vals.reduce((a, b) => a + (Number(b) - m) ** 2, 0) / vals.length;
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
            case 'SUBSTRING': return String(args[0]).substr(Number(args[1]) - 1,
                                    args[2] !== undefined ? Number(args[2]) : undefined);
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
            case 'ROUND': return args[1] !== undefined
                ? Number(Number(args[0]).toFixed(Number(args[1])))
                : Math.round(Number(args[0]));
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
            case 'CURRENT_DATE': return new Date().toISOString().slice(0, 10);
            case 'CURRENT_TIME': return new Date().toISOString().slice(11, 19);
            case 'DATE': return new Date(args[0]).toISOString().slice(0, 10);
            case 'YEAR': return new Date(args[0]).getFullYear();
            case 'MONTH': return new Date(args[0]).getMonth() + 1;
            case 'DAY': return new Date(args[0]).getDate();
            case 'HOUR': return new Date(args[0]).getHours();
            case 'MINUTE': return new Date(args[0]).getMinutes();
            case 'SECOND': return new Date(args[0]).getSeconds();
            case 'UNIXEPOCH': return Math.floor(new Date(args[0] || Date.now()).getTime() / 1000);
            case 'COALESCE': return args.find(a => a !== null && a !== undefined) ?? null;
            case 'NULLIF': return looseEq(args[0], args[1]) ? null : args[0];
            case 'IFNULL': case 'ISNULL':
                return args[0] === null || args[0] === undefined ? args[1] : args[0];
            case 'IF': return truthy(args[0]) ? args[1] : args[2];
            case 'TYPEOF': return typeof args[0];
            case 'QUOTE': return args[0] === null ? 'NULL' : `'${String(args[0]).replace(/'/g, "''")}'`;
            case 'HEX': return Array.from(String(args[0])).map(c => c.charCodeAt(0).toString(16)).join('');
        }
        throw new Error(`Unknown function: ${name}`);
    }

    NS.looseEq = looseEq;
    NS.compare = compare;
    NS.truthy = truthy;
    NS.castValue = castValue;

})(window.SQLSandbox);