/**
 * SQL Sandbox — Random data generators
 * Path: modules/sql/functions/sql_generators.js
 */

(function (NS) {
    'use strict';

    const rand = n => Math.floor(Math.random() * n);
    const pick = arr => arr[rand(arr.length)];
    const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const randPrice = (min, max) => Math.round((Math.random() * (max - min) + min) * 100) / 100;

    const randName = () => `${pick(NS.FIRST_NAMES)} ${pick(NS.LAST_NAMES)}`;
    const randEmail = (name) => {
        const [first, last] = name.toLowerCase().split(' ');
        const style = rand(3);
        const local = style === 0 ? `${first}.${last}` :
                      style === 1 ? `${first[0]}${last}` :
                                    `${first}${randInt(1, 99)}`;
        return `${local}@${pick(NS.DOMAINS)}`;
    };
    const randDate = (daysBack = 365) => {
        const d = new Date(Date.now() - rand(daysBack) * 86400000);
        return d.toISOString().slice(0, 10);
    };
    const randIsbn = () => `${randInt(100,999)}-${randInt(10,99)}-${randInt(1000,9999)}-${randInt(0,9)}`;

    function genUsers(n) {
        const rows = [];
        for (let i = 0; i < n; i++) {
            const name = randName();
            rows.push({
                id: i + 1,
                name,
                email: randEmail(name),
                role: pick(['user','user','user','moderator','admin']),
                active: Math.random() > 0.2 ? 'true' : 'false',
                joined: randDate(730)
            });
        }
        return rows;
    }

    function genBooks(n) {
        const rows = [];
        for (let i = 0; i < n; i++) {
            rows.push({
                id: i + 1,
                title: pick(NS.BOOK_TITLES),
                author: randName(),
                genre: pick(NS.BOOK_GENRES),
                isbn: randIsbn(),
                price: randPrice(8, 45),
                stock: randInt(0, 200),
                published: randInt(1980, 2025)
            });
        }
        return rows;
    }

    function genLaptops(n) {
        const rows = [];
        for (let i = 0; i < n; i++) {
            rows.push({
                id: i + 1,
                brand: pick(NS.LAPTOP_BRANDS),
                model: pick(NS.LAPTOP_MODELS),
                cpu: pick(NS.CPUS),
                ram_gb: pick([8, 16, 16, 32, 32, 64]),
                storage_gb: pick([256, 512, 512, 1024, 2048]),
                price: randPrice(499, 3499),
                stock: randInt(0, 60)
            });
        }
        return rows;
    }

    function genOrders(n, userIds, bookIds, laptopIds) {
        const rows = [];
        for (let i = 0; i < n; i++) {
            const isBook = Math.random() > 0.4;
            rows.push({
                id: 1000 + i,
                user_id: pick(userIds),
                item_type: isBook ? 'book' : 'laptop',
                item_id: isBook ? pick(bookIds) : pick(laptopIds),
                quantity: randInt(1, 4),
                status: pick(NS.ORDER_STATUSES),
                placed: randDate(180)
            });
        }
        return rows;
    }

     NS.generateRandomDB = function () {
        const ROWS = 20;

        const out = {
            users:   genUsers(ROWS),
            books:   genBooks(ROWS),
            laptops: genLaptops(ROWS)
        };

        // Orders reference ids from the other tables
        const userIds   = out.users.map(u => u.id);
        const bookIds   = out.books.map(b => b.id);
        const laptopIds = out.laptops.map(l => l.id);
        out.orders = genOrders(ROWS, userIds, bookIds, laptopIds);

        return out;
    };

})(window.SQLSandbox);