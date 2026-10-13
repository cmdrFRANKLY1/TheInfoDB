(function() {
    // Define a single database with 3 tables tailored for JOINs and WHERE clauses
    const originalDBState = {
        customer: [
            { CustomerID: 1, CustomerName: `Alice Smith`, ContactName: 'Alice', Country: 'USA' },
            { CustomerID: 2, CustomerName: `Bob Jones`, ContactName: 'Bob', Country: 'UK' },
            { CustomerID: 3, CustomerName: `Charlie Brown`, ContactName: 'Charlie', Country: 'France' },
            { CustomerID: 4, CustomerName: `Diana Prince`, ContactName: 'Diana', Country: 'Canada' },
            { CustomerID: 5, CustomerName: `Eva Green`, ContactName: 'Eva', Country: 'USA' }
        ],
        products: [
            { ProductID: 101, ProductName: 'Widget', SupplierID: 1, Price: 19.99 },
            { ProductID: 102, ProductName: 'Gadget', SupplierID: 2, Price: 149.50 },
            { ProductID: 103, ProductName: 'Gizmo', SupplierID: 1, Price: 9.99 },
            { ProductID: 104, ProductName: 'Thingamajig', SupplierID: 3, Price: 75.00 },
            { ProductID: 105, ProductName: 'Doohickey', SupplierID: 2, Price: 25.00 }
        ],
        supplier: [
            { SupplierID: 1, SupplierName: `Global Supplies`, ContactName: 'John Doe', Country: 'USA' },
            { SupplierID: 2, SupplierName: `Euro Imports`, ContactName: 'Jane Smith', Country: 'UK' },
            { SupplierID: 3, SupplierName: `Northern Goods`, ContactName: 'Lars Olaf', Country: 'Canada' }
        ]
    };
    
    // We will use AlaSQL for real SQL processing in the browser
    let isAlasqlLoaded = false;

    async function loadSqlEngine() {
        if (window.alasql) {
            isAlasqlLoaded = true;
            return;
        }
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/alasql@4.3.3/dist/alasql.min.js';
            script.onload = () => {
                isAlasqlLoaded = true;
                resolve();
            };
            script.onerror = () => {
                console.error("Failed to load AlaSQL");
                resolve(); // Still resolve to show error in UI
            };
            document.head.appendChild(script);
        });
    }

    function seedDatabase() {
        if (!window.alasql) return;
        
        alasql('CREATE DATABASE IF NOT EXISTS memorydb; USE memorydb;');
        
        // Re-create tables
        alasql('DROP TABLE IF EXISTS customer;');
        alasql('DROP TABLE IF EXISTS products;');
        alasql('DROP TABLE IF EXISTS supplier;');
        
        alasql('CREATE TABLE customer');
        alasql('CREATE TABLE products');
        alasql('CREATE TABLE supplier');
        
        // Populate with fresh clones of original data
        alasql.tables.customer.data = JSON.parse(JSON.stringify(originalDBState.customer));
        alasql.tables.products.data = JSON.parse(JSON.stringify(originalDBState.products));
        alasql.tables.supplier.data = JSON.parse(JSON.stringify(originalDBState.supplier));
    }

    function executeSQL(sqlQuery) {
        if (!window.alasql) {
            return { type: 'error', message: 'SQL Engine failed to load. Check internet connection.', data: [] };
        }

        try {
            // alasql can handle multiple statements if separated by semicolon
            // It returns an array of results. We grab the last one.
            let res = alasql(sqlQuery);
            
            if (Array.isArray(res) && res.length > 0 && Array.isArray(res[0]) && sqlQuery.split(';').length > 1) {
                 // For multiple statements, take the result of the last SELECT or operation
                 // (Simplified handling for demo purposes)
                 res = res[res.length - 1] || res[0]; 
            }

            // Handle INSERT/UPDATE/DELETE which often return the number of rows affected (Number)
            if (typeof res === 'number') {
                return { type: 'success', message: `${res} row(s) affected.`, data: [] };
            }
            
            // Handle empty results
            if (Array.isArray(res) && res.length === 0) {
                 return { type: 'select', data: [], message: `Number of Records: 0` };
            }

            // Handle standard SELECT results
            if (Array.isArray(res) && res.length > 0 && typeof res[0] === 'object') {
                return { type: 'select', data: res, message: `Number of Records: ${res.length}` };
            }

            return { type: 'success', message: 'Query executed successfully.', data: [] };

        } catch (e) {
            return { type: 'error', message: "Execution Error: " + e.message, data: [] };
        }
    }

    const sqlCommands = [
        { name: "SELECT", desc: "Extracts data from a database", snippet: "SELECT * FROM customer;" },
        { name: "SELECT DISTINCT", desc: "Returns only different values", snippet: "SELECT DISTINCT Country FROM customer;" },
        { name: "WHERE", desc: "Filters records", snippet: "SELECT * FROM products\nWHERE Price > 50;" },
        { name: "AND / OR / NOT", desc: "Combine filtering conditions", snippet: "SELECT * FROM customer\nWHERE Country = 'USA' AND NOT ContactName = 'Alice';" },
        { name: "ORDER BY", desc: "Sorts the result-set", snippet: "SELECT * FROM products\nORDER BY Price DESC;" },
        { name: "INSERT INTO", desc: "Inserts new data", snippet: "INSERT INTO customer (CustomerID, CustomerName, Country)\nVALUES (6, 'Frank Castle', 'USA');" },
        { name: "UPDATE", desc: "Updates existing data", snippet: "UPDATE products\nSET Price = 19.50\nWHERE ProductID = 101;" },
        { name: "DELETE", desc: "Deletes data", snippet: "DELETE FROM customer\nWHERE CustomerName = 'Alice Smith';" },
        { name: "LIMIT", desc: "Limits the number of returned records", snippet: "SELECT * FROM products\nLIMIT 3;" },
        { name: "MIN() / MAX()", desc: "Returns smallest/largest value", snippet: "SELECT MAX(Price) AS HighestPrice\nFROM products;" },
        { name: "COUNT()", desc: "Returns number of rows", snippet: "SELECT COUNT(CustomerID)\nFROM customer;" },
        { name: "AVG() / SUM()", desc: "Average or Total sum", snippet: "SELECT SUM(Price) AS TotalInventoryValue\nFROM products;" },
        { name: "LIKE", desc: "Search for a specified pattern", snippet: "SELECT * FROM customer\nWHERE CustomerName LIKE 'A%';" },
        { name: "IN", desc: "Specify multiple values in a WHERE clause", snippet: "SELECT * FROM customer\nWHERE Country IN ('USA', 'UK');" },
        { name: "BETWEEN", desc: "Selects values within a given range", snippet: "SELECT * FROM products\nWHERE Price BETWEEN 10 AND 50;" },
        { name: "GROUP BY", desc: "Groups rows that have the same values", snippet: "SELECT COUNT(CustomerID), Country\nFROM customer\nGROUP BY Country;" },
        { name: "HAVING", desc: "Condition on aggregated data", snippet: "SELECT COUNT(CustomerID), Country\nFROM customer\nGROUP BY Country\nHAVING COUNT(CustomerID) > 1;" },
        { name: "INNER JOIN", desc: "Returns matching records in both tables", snippet: "SELECT products.ProductName, supplier.SupplierName\nFROM products\nINNER JOIN supplier \nON products.SupplierID = supplier.SupplierID;" },
        { name: "LEFT JOIN", desc: "All records from left, matches from right", snippet: "SELECT supplier.SupplierName, products.ProductName\nFROM supplier\nLEFT JOIN products \nON supplier.SupplierID = products.SupplierID;" },
        { name: "RIGHT JOIN", desc: "All records from right, matches from left", snippet: "SELECT products.ProductName, supplier.SupplierName\nFROM products\nRIGHT JOIN supplier \nON products.SupplierID = supplier.SupplierID;" },
        { name: "FULL OUTER JOIN", desc: "All records when match in left or right", snippet: "SELECT customer.CustomerName, supplier.SupplierName\nFROM customer\nOUTER JOIN supplier \nON customer.Country = supplier.Country;" }
    ];

    function renderApp() {
        const container = document.createElement('div');
        container.className = 'w-full h-full flex flex-col bg-[var(--bg-primary)] text-[var(--text-normal)] font-sans overflow-hidden';
        
        const defaultQuery = `SELECT * FROM customer;`;

        container.innerHTML = `
            <!-- Top Bar -->
            <div class="h-14 bg-[var(--bg-tertiary)] border-b border-[var(--border-color)] flex items-center justify-between px-4 shrink-0">
                <div class="flex items-center gap-3">
                    <i class="fa-solid fa-database text-[var(--accent-color)] text-xl"></i>
                    <h1 class="text-lg font-bold">SQL Editor</h1>
                </div>
                <div>
                    <button id="sql-restore-db" class="px-3 py-1.5 bg-[var(--bg-secondary)] hover:bg-[var(--interactive-hover)] hover:text-[var(--bg-primary)] text-sm rounded border border-[var(--border-color)] transition-colors">
                        <i class="fa-solid fa-rotate-left mr-1"></i> Restore Database
                    </button>
                </div>
            </div>

            <!-- Body Flex Container (Left Content, Right Commands) -->
            <div class="flex-1 flex overflow-hidden">
                
                <!-- Left Side: Main Editor & Schema -->
                <div class="flex-1 flex flex-col overflow-hidden min-w-0">
                    
                    <!-- Top Half: Editor & Results -->
                    <div class="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
                        
                        <!-- Left Panel: Editor -->
                        <div class="flex-1 border-r border-[var(--border-color)] flex flex-col min-w-0 shrink-0">
                            <div class="bg-[var(--bg-secondary)] px-4 py-2 border-b border-[var(--border-color)] flex justify-between items-center h-12 shrink-0">
                                <span class="font-semibold text-sm text-[var(--text-muted)]">SQL Statement:</span>
                                <button id="sql-run-btn" title="Run Query (Ctrl+Enter)" class="px-4 py-1.5 bg-[var(--accent-color)] text-white font-bold rounded hover:brightness-110 transition-all text-sm leading-none h-full flex items-center gap-2">
                                    Run SQL <i class="fa-solid fa-play text-xs"></i>
                                </button>
                            </div>
                            <div class="flex-1 relative bg-[#1e1e1e]">
                                <textarea id="sql-editor-textarea" class="absolute inset-0 w-full h-full p-4 bg-transparent text-gray-200 font-mono text-[15px] outline-none resize-none" spellcheck="false">${defaultQuery}</textarea>
                            </div>
                        </div>

                        <!-- Right Panel: Results -->
                        <div class="flex-1 flex flex-col min-w-0 bg-[var(--bg-primary)] overflow-hidden">
                            <div class="bg-[var(--bg-secondary)] px-4 py-2 border-b border-[var(--border-color)] flex justify-between items-center shrink-0 h-12">
                                <span class="font-semibold text-sm text-[var(--text-muted)]">Result</span>
                                <div class="text-xs font-bold text-[var(--accent-color)] bg-[var(--bg-tertiary)] px-2 py-1 rounded border border-[var(--border-color)]" id="sql-engine-status">
                                    <i class="fa-solid fa-spinner fa-spin mr-1"></i> Loading Engine...
                                </div>
                            </div>
                            <div id="sql-result-panel" class="flex-1 p-4 overflow-auto">
                                <div id="sql-result-msg" class="text-sm text-[var(--text-muted)] mb-4">Click "Run SQL" to execute the query.</div>
                                <div id="sql-result-table-container" class="overflow-x-auto rounded border border-[var(--border-color)] hidden">
                                    <table class="min-w-full text-left text-sm whitespace-nowrap">
                                        <thead id="sql-result-thead" class="uppercase tracking-wider border-b border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-muted)] text-xs">
                                        </thead>
                                        <tbody id="sql-result-tbody" class="divide-y divide-[var(--border-color)]">
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Bottom Half: Schema -->
                    <div class="h-64 border-t border-[var(--border-color)] flex flex-col overflow-hidden bg-[var(--bg-primary)] shrink-0">
                        <div class="bg-[var(--bg-secondary)] border-b border-[var(--border-color)] flex items-center shrink-0 h-10 px-4">
                            <span class="font-semibold text-sm text-[var(--text-muted)]"><i class="fa-solid fa-sitemap mr-1"></i> Database Schema</span>
                        </div>
                        
                        <!-- Table Content Area -->
                        <div id="sql-schema-tables-container" class="flex-1 p-4 overflow-x-auto overflow-y-auto flex gap-4 items-stretch">
                            <!-- Populated dynamically -->
                        </div>
                    </div>
                </div>

                <!-- Right Side: SQL Commands Reference -->
                <div class="w-72 border-l border-[var(--border-color)] bg-[var(--bg-secondary)] flex flex-col shrink-0">
                    <div class="h-12 border-b border-[var(--border-color)] bg-[var(--bg-tertiary)] flex items-center px-4 font-bold text-[var(--text-normal)] shrink-0">
                        <i class="fa-solid fa-book mr-2 text-[var(--accent-color)]"></i> Command Reference
                    </div>
                    <div class="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                        ${sqlCommands.map(cmd => `
                            <div class="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded p-2 hover:border-[var(--accent-color)] transition-colors group cursor-pointer" onclick="document.getElementById('sql-editor-textarea').value = this.querySelector('code').innerText;">
                                <div class="flex justify-between items-start mb-1">
                                    <h3 class="font-bold text-[13px] text-[var(--text-normal)]">${cmd.name}</h3>
                                    <button class="text-xs text-[var(--text-muted)] hover:text-[var(--accent-color)] opacity-0 group-hover:opacity-100 transition-opacity" title="Insert into Editor">
                                        <i class="fa-solid fa-arrow-left"></i>
                                    </button>
                                </div>
                                <p class="text-[11px] text-[var(--text-muted)] mb-2">${cmd.desc}</p>
                                <div class="bg-[#1e1e1e] p-1.5 rounded">
                                    <code class="text-[11px] text-gray-300 whitespace-pre-wrap font-mono">${cmd.snippet}</code>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

            </div>
        `;

        return container;
    }

    function attachEvents(container) {
        const runBtn = container.querySelector('#sql-run-btn');
        const editor = container.querySelector('#sql-editor-textarea');
        const resultMsg = container.querySelector('#sql-result-msg');
        const resultTableContainer = container.querySelector('#sql-result-table-container');
        const resultThead = container.querySelector('#sql-result-thead');
        const resultTbody = container.querySelector('#sql-result-tbody');
        const restoreBtn = container.querySelector('#sql-restore-db');
        const schemaTablesContainer = container.querySelector('#sql-schema-tables-container');
        const engineStatus = container.querySelector('#sql-engine-status');

        // Check if engine is ready before allowing run
        const tryRunSQL = () => {
            if (!isAlasqlLoaded) {
                resultMsg.textContent = "SQL Engine is still loading. Please wait...";
                resultMsg.className = "text-sm text-yellow-500 mb-4";
                return;
            }

            const query = editor.value;
            if (!query.trim()) return;

            const res = executeSQL(query);

            resultMsg.textContent = res.message;
            resultMsg.className = `text-sm mb-4 ${res.type === 'error' ? 'text-red-500 font-bold' : 'text-green-500 font-bold'}`;

            if (res.type === 'select' && res.data.length > 0) {
                resultTableContainer.classList.remove('hidden');
                
                // Build Header
                const headers = Object.keys(res.data[0]);
                resultThead.innerHTML = `<tr>${headers.map(h => `<th class="px-4 py-2 font-semibold">${h}</th>`).join('')}</tr>`;

                // Build Body
                resultTbody.innerHTML = res.data.map(row => {
                    return `<tr class="hover:bg-[var(--bg-secondary)] transition-colors">${headers.map(h => `<td class="px-4 py-2">${row[h] !== null && row[h] !== undefined ? row[h] : '<em>null</em>'}</td>`).join('')}</tr>`;
                }).join('');
            } else {
                resultTableContainer.classList.add('hidden');
                resultThead.innerHTML = '';
                resultTbody.innerHTML = '';
            }
            
            // Re-render schema in case INSERT/DELETE/UPDATE modified the tables
            renderSchema();
        };

        runBtn.addEventListener('click', tryRunSQL);

        // Add Ctrl+Enter (or Cmd+Enter) functionality to run the query
        editor.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault(); // Prevent a new line from being added
                tryRunSQL();
            }
        });

        // Restore DB
        restoreBtn.addEventListener('click', () => {
            if(!isAlasqlLoaded) return;
            seedDatabase(); // Resets AlaSQL tables
            
            editor.value = `SELECT * FROM customer;`;
            resultTableContainer.classList.add('hidden');
            resultMsg.textContent = "Database restored to original state. Click 'Run SQL' to execute.";
            resultMsg.className = "text-sm text-[var(--text-muted)] mb-4";
            
            renderSchema();
        });

        function renderSchema() {
            if (!isAlasqlLoaded) return;

            const tableNames = ['customer', 'products', 'supplier'];
            let html = '';
            
            tableNames.forEach(tableName => {
                // Get table info from alasql
                const tableData = alasql.tables[tableName].data;
                const count = tableData.length;
                
                // Determine columns from original DB state so schema remains accurate even if empty
                const columns = Object.keys(originalDBState[tableName][0]);
                
                // Build full HTML table for the actual entries
                let tableHtml = `<table class="min-w-full text-left text-[11px] whitespace-nowrap">`;
                tableHtml += `<thead class="bg-[var(--bg-tertiary)] border-b border-[var(--border-color)] text-[var(--text-muted)] sticky top-0 z-10"><tr>`;
                columns.forEach(col => {
                    tableHtml += `<th class="px-3 py-1.5 font-semibold">${col}</th>`;
                });
                tableHtml += `</tr></thead>`;
                
                tableHtml += `<tbody class="divide-y divide-[var(--border-color)]">`;
                tableData.forEach(row => {
                    tableHtml += `<tr class="hover:bg-[var(--bg-secondary)] transition-colors">`;
                    columns.forEach(col => {
                        const cellValue = row[col] !== null && row[col] !== undefined ? row[col] : '<em class="opacity-50">null</em>';
                        tableHtml += `<td class="px-3 py-1.5 text-[var(--text-normal)]">${cellValue}</td>`;
                    });
                    tableHtml += `</tr>`;
                });
                tableHtml += `</tbody></table>`;

                html += `
                    <div class="flex-1 min-w-[200px] bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded overflow-hidden flex flex-col h-full max-h-full shadow-sm">
                        <div class="bg-[var(--bg-tertiary)] p-2 border-b border-[var(--border-color)] flex justify-between items-center cursor-pointer hover:bg-[var(--interactive-hover)] hover:text-[var(--bg-primary)] transition-colors group shrink-0" 
                             onclick="document.getElementById('sql-editor-textarea').value='SELECT * FROM ${tableName};'; document.getElementById('sql-run-btn').click();">
                            <div class="flex items-center gap-2">
                                <i class="fa-solid fa-table group-hover:text-[var(--bg-primary)] text-[var(--text-muted)] transition-colors text-xs"></i>
                                <span class="font-bold text-sm group-hover:text-[var(--bg-primary)] transition-colors">${tableName}</span>
                            </div>
                            <span class="text-[10px] ml-4 bg-[var(--bg-primary)] px-1.5 py-0.5 rounded text-[var(--text-muted)] group-hover:text-[var(--bg-primary)] group-hover:bg-white transition-colors">${count} rows</span>
                        </div>
                        <div class="overflow-auto flex-1 bg-[var(--bg-primary)] custom-scrollbar">
                            ${tableHtml}
                        </div>
                    </div>
                `;
            });
            
            schemaTablesContainer.innerHTML = html;
        }
        
        // Finalize initialization after script loads
        loadSqlEngine().then(() => {
            if (isAlasqlLoaded) {
                seedDatabase();
                engineStatus.innerHTML = '<i class="fa-solid fa-check text-green-500 mr-1"></i> Engine Ready';
                engineStatus.classList.replace('text-[var(--accent-color)]', 'text-green-500');
                renderSchema();
            } else {
                engineStatus.innerHTML = '<i class="fa-solid fa-triangle-exclamation text-red-500 mr-1"></i> Engine Failed';
                engineStatus.classList.replace('text-[var(--accent-color)]', 'text-red-500');
            }
        });
    }

    if (window.AppAPI && window.AppAPI.sidebar) {
        window.AppAPI.sidebar.addEntry('sql', 'SQL', 'fa-solid fa-database', () => {
            const container = renderApp();
            attachEvents(container);
            window.AppAPI.canvas.setContent(container);
        });
    } else {
        console.warn('AppAPI not found. Running standalone for debugging.');
        const container = renderApp();
        document.body.appendChild(container);
        attachEvents(container);
    }
})();