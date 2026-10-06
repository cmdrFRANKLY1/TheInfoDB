/**
 * SQL Sandbox — Tokenizer
 * Path: modules/sql/functions/sql_tokenizer.js
 */

(function (NS) {
    'use strict';

    NS.tokenize = function (sql) {
        const tokens = [];
        let i = 0;
        const n = sql.length;
        const isWS = c => c === ' ' || c === '\t' || c === '\n' || c === '\r';
        const isDigit = c => c >= '0' && c <= '9';
        const isIdentStart = c => (c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') || c === '_';
        const isIdentPart = c => isIdentStart(c) || isDigit(c) || c === '.';

        while (i < n) {
            const c = sql[i];
            if (isWS(c)) { i++; continue; }
            if (c === '-' && sql[i + 1] === '-') { while (i < n && sql[i] !== '\n') i++; continue; }
            if (c === '/' && sql[i + 1] === '*') {
                i += 2;
                while (i < n && !(sql[i] === '*' && sql[i + 1] === '/')) i++;
                i += 2; continue;
            }
            if (c === "'" || c === '"') {
                const quote = c; let j = i + 1; let val = '';
                while (j < n) {
                    if (sql[j] === quote) {
                        if (sql[j + 1] === quote) { val += quote; j += 2; continue; }
                        break;
                    }
                    val += sql[j++];
                }
                tokens.push({ type: 'string', value: val, raw: sql.slice(i, j + 1) });
                i = j + 1; continue;
            }
            if (isDigit(c) || (c === '.' && isDigit(sql[i + 1]))) {
                let j = i;
                while (j < n && (isDigit(sql[j]) || sql[j] === '.' || sql[j] === 'e' || sql[j] === 'E' ||
                       ((sql[j] === '+' || sql[j] === '-') && (sql[j - 1] === 'e' || sql[j - 1] === 'E')))) j++;
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
            if (three === '<=>') { tokens.push({ type: 'op', value: three }); i += 3; continue; }
            if (two === '<=' || two === '>=' || two === '<>' || two === '!=' ||
                two === '||' || two === '<<' || two === '>>') {
                tokens.push({ type: 'op', value: two }); i += 2; continue;
            }
            if ('=<>+-*/%(),.;&|~'.includes(c)) { tokens.push({ type: 'op', value: c }); i++; continue; }
            throw new Error(`Unexpected character '${c}' at position ${i}`);
        }
        return tokens;
    };

})(window.SQLSandbox);