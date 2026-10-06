/**
 * SQL Sandbox — Parser
 * Path: modules/sql/functions/sql_parser.js
 */

(function (NS) {
    'use strict';

    NS.parse = function (tokens) {
        let p = 0;
        const peek = (k = 0) => tokens[p + k];
        const next = () => tokens[p++];
        const eat = (val) => {
            if (peek() && peek().value.toUpperCase() === val.toUpperCase()) return next();
            return null;
        };
        const expect = (val) => {
            const t = eat(val);
            if (!t) throw new Error(`Expected '${val}' but found '${peek() ? peek().value : 'EOF'}'`);
            return t;
        };
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
            if (eat('LIMIT')) {
                limit = parseExpression();
                if (eat(',')) { offset = limit; limit = parseExpression(); }
            }
            if (eat('OFFSET')) offset = parseExpression();

            const sets = [];
            while (peekKw('UNION') || peekKw('INTERSECT') || peekKw('EXCEPT')) {
                const op = next().upper;
                const allFlag = !!eat('ALL');
                if (peekKw('SELECT')) {
                    const sub = parseSelect();
                    sets.push({ op, all: allFlag, select: sub });
                } else throw new Error(`Expected SELECT after ${op}`);
            }

            return { kind: 'SELECT', distinct, all, columns, from, where, groupBy, having, orderBy, limit, offset, sets };
        }

        function parseSelectList() {
            if (eat('*')) return [{ star: true }];
            const list = [];
            do {
                if (peek() && peek().type === 'ident' && peek(1) && peek(1).value === '.' &&
                    peek(2) && peek(2).value === '*') {
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
            return upper === 'FROM' || upper === 'WHERE' || upper === 'GROUP' || upper === 'HAVING' ||
                   upper === 'ORDER' || upper === 'LIMIT' || upper === 'OFFSET' || upper === 'UNION' ||
                   upper === 'INTERSECT' || upper === 'EXCEPT' || upper === 'JOIN' || upper === 'INNER' ||
                   upper === 'LEFT' || upper === 'RIGHT' || upper === 'FULL' || upper === 'CROSS' ||
                   upper === 'ON' || upper === 'AS' || upper === 'ASC' || upper === 'DESC';
        }

        function parseFrom() {
            let node = parseTableRef();
            while (true) {
                if (peekKw('JOIN') || peekKw('INNER') || peekKw('LEFT') || peekKw('RIGHT') ||
                    peekKw('FULL') || peekKw('CROSS')) {
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
            if (peekKw('LIKE') || peekKw('GLOB') ||
                (peekKw('NOT') && (peekKw('LIKE', 1) || peekKw('GLOB', 1)))) {
                const neg = !!eat('NOT');
                const op = next().upper;
                const right = parseAdditive();
                return { kind: 'Binary', op: (neg ? 'NOT ' : '') + op, left, right };
            }
            const t = peek();
            if (t && t.type === 'op' &&
                (t.value === '=' || t.value === '!=' || t.value === '<>' ||
                 t.value === '>' || t.value === '<' || t.value === '>=' ||
                 t.value === '<=' || t.value === '<=>')) {
                next();
                return { kind: 'Binary', op: t.value, left, right: parseAdditive() };
            }
            return left;
        }
        function parseAdditive() {
            let left = parseMultiplicative();
            while (peek() && peek().type === 'op' &&
                   (peek().value === '+' || peek().value === '-' || peek().value === '||')) {
                const op = next().value;
                left = { kind: 'Binary', op, left, right: parseMultiplicative() };
            }
            return left;
        }
        function parseMultiplicative() {
            let left = parseUnary();
            while (peek() && peek().type === 'op' &&
                   (peek().value === '*' || peek().value === '/' || peek().value === '%')) {
                const op = next().value;
                left = { kind: 'Binary', op, left, right: parseUnary() };
            }
            return left;
        }
        function parseUnary() {
            if (peek() && peek().type === 'op' &&
                (peek().value === '-' || peek().value === '+' || peek().value === '~')) {
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
            if (t.value === '(') { next(); const expr = parseExpression(); expect(')'); return expr; }
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
                        if (peekKw('ORDER')) {
                            next(); expect('BY');
                            orderBy = [];
                            do {
                                const e = parseExpression();
                                let d = 'ASC';
                                if (eat('ASC')) d = 'ASC';
                                else if (eat('DESC')) d = 'DESC';
                                orderBy.push({ expr: e, dir: d });
                            } while (eat(','));
                        }
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
            if (eat('(')) {
                cols = [];
                do { cols.push(next().value); } while (eat(','));
                expect(')');
            }
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
            if (eat('UNIQUE')) { /* hint */ }
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
            if (peekKw('SCHEMA') || peekKw('DATABASE') || peekKw('SEQUENCE') ||
                peekKw('TRIGGER') || peekKw('FUNCTION') || peekKw('PROCEDURE') ||
                peekKw('USER') || peekKw('ROLE')) {
                const what = next().upper;
                while (peek()) next();
                return { kind: 'NOOP_DDL', msg: `CREATE ${what} is accepted but not simulated.` };
            }
            if (peekKw('TABLE')) {
                next();
                const ifNotExists = !!eat('IF') && !!eat('NOT') && !!eat('EXISTS');
                const name = next().value;
                expect('(');
                const columns = [];
                const stopKw = new Set(['PRIMARY','NOT','NULL','UNIQUE','CHECK','DEFAULT',
                                        'REFERENCES','FOREIGN','CONSTRAINT','AUTOINCREMENT']);
                do {
                    const colName = next().value;
                    let type = 'TEXT';
                    if (peek() && peek().type === 'ident' && !stopKw.has(peek().upper)) {
                        type = next().value;
                        if (peek() && peek().type === 'ident' &&
                            (peek().upper === 'PRECISION' || peek().upper === 'VARYING')) next();
                    }
                    const constraints = [];
                    while (peek() && peek().value !== ',' && peek().value !== ')') {
                        const kw = next();
                        if (kw.upper === 'PRIMARY') { eat('KEY'); constraints.push('PRIMARY KEY'); }
                        else if (kw.upper === 'NOT') { eat('NULL'); constraints.push('NOT NULL'); }
                        else if (kw.upper === 'NULL') constraints.push('NULL');
                        else if (kw.upper === 'UNIQUE') constraints.push('UNIQUE');
                        else if (kw.upper === 'AUTOINCREMENT') constraints.push('AUTOINCREMENT');
                        else if (kw.upper === 'DEFAULT') {
                            const v = parseExpression();
                            constraints.push({ default: v });
                        }
                        else if (kw.upper === 'REFERENCES') {
                            constraints.push('REFERENCES ' + next().value);
                        }
                        else if (kw.upper === 'CHECK') {
                            expect('(');
                            constraints.push('CHECK');
                            while (peek() && peek().value !== ')') next();
                            expect(')');
                        }
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
            if (peekKw('SCHEMA') || peekKw('DATABASE') || peekKw('SEQUENCE') ||
                peekKw('TRIGGER') || peekKw('FUNCTION') || peekKw('PROCEDURE') ||
                peekKw('USER') || peekKw('ROLE')) {
                const what = next().upper;
                while (peek()) next();
                return { kind: 'NOOP_DDL', msg: `DROP ${what} is accepted but not simulated.` };
            }
            throw new Error('Unsupported DROP variant');
        }

        function parseAlter() {
            expect('ALTER');
            if (peekKw('USER') || peekKw('ROLE')) {
                const what = next().upper;
                while (peek()) next();
                return { kind: 'NOOP_DDL', msg: `ALTER ${what} is accepted but not simulated.` };
            }
            expect('TABLE');
            const name = next().value;
            if (eat('ADD')) {
                eat('COLUMN');
                const colName = next().value;
                let type = 'TEXT';
                if (peek() && peek().type === 'ident' &&
                    peek().upper !== 'PRIMARY' && peek().upper !== 'NOT' &&
                    peek().upper !== 'NULL' && peek().upper !== 'UNIQUE') type = next().value;
                return { kind: 'ALTER_TABLE', name, action: 'ADD',
                         column: { name: colName, type: type.toUpperCase() } };
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
                return { kind: 'ALTER_TABLE', name, action: 'RENAME_COLUMN',
                         oldName, newName: next().value };
            }
            throw new Error('Unsupported ALTER TABLE action');
        }

        function parseTruncate() {
            expect('TRUNCATE');
            eat('TABLE');
            return { kind: 'TRUNCATE', name: next().value };
        }

        const stmt = parseStatement();
        if (p < tokens.length && tokens[p].value !== ';') {
            throw new Error(`Unexpected token '${tokens[p].value}' after statement`);
        }
        return stmt;
    };

})(window.SQLSandbox);