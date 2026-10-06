/**
 * SQL Sandbox — Orchestrator
 * Path: modules/sql/sql_sandbox.js
 */

(function () {
    'use strict';

    // 1. HARD CLEANUP: Guarantee a clean slate on every run (crucial for HMR/Live Server)
    window.SQLSandbox = {};
    window.SQLSandbox.__booted = true;

    // Remove old UI elements to prevent stacking duplicates on Hot Reloads
    const oldElements = document.querySelectorAll('.sql-sidebar-entry, #sql-view, #sql-right-view');
    oldElements.forEach(el => el.remove());

    if (!window.theInfoDB) {
        console.warn("[SQL Sandbox] window.theInfoDB not found. Aborting.");
        return;
    }

    // 2. PATH RESOLUTION
    const THIS_SRC = (document.currentScript && document.currentScript.src) || '';
    const BASE_DIR = THIS_SRC
        ? THIS_SRC.substring(0, THIS_SRC.lastIndexOf('/') + 1)
        : 'modules/sql/';

    window.SQLSandbox.BASE_DIR = BASE_DIR;

    // 3. SYNCHRONOUS SIDEBAR REGISTRATION
    // This MUST happen now so the framework captures its order from the script tag.
    const sidebarEntry = document.createElement('div');
    sidebarEntry.className = 'settings-row sql-sidebar-entry';
    sidebarEntry.innerHTML = `
        <span class="sql-sidebar-entry-inner">
            <svg viewBox="0 0 24 24" width="16" height="16"
                 fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round"
                 aria-hidden="true">
                <ellipse cx="12" cy="5" rx="9" ry="3"/>
                <path d="M3 5v6c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/>
                <path d="M3 11v6c0 1.66 4.03 3 9 3s9-1.34 9-3v-6"/>
            </svg>
            <span>SQL Sandbox</span>
        </span>
    `;

    const SIDEBAR_STYLE_ID = 'sql-sidebar-entry-styles';
    if (!document.getElementById(SIDEBAR_STYLE_ID)) {
        const st = document.createElement('style');
        st.id = SIDEBAR_STYLE_ID;
        st.textContent = `
            .sql-sidebar-entry { display: flex !important; align-items: center; justify-content: flex-start !important; gap: 10px; font-size: 0.95rem; font-weight: 500; }
            .sql-sidebar-entry-inner { display: inline-flex; align-items: center; gap: 10px; }
            .sql-sidebar-entry svg { display: block; width: 16px; height: 16px; color: currentColor; flex-shrink: 0; opacity: 0.85; }
            .sql-sidebar-entry:hover svg { opacity: 1; color: var(--accent-color); }
        `;
        document.head.appendChild(st);
    }

    window.theInfoDB.ui.registerElement('left-sidebar-top', sidebarEntry);

    // 4. MODULE LOADER
    const MODULES = [
        'functions/sql_constants.js',
        'functions/sql_tokenizer.js',
        'functions/sql_parser.js',
        'functions/sql_evaluator.js',
        'functions/sql_executor.js',
        'functions/sql_generators.js',
        'functions/sql_styles.js',
        'functions/sql_render.js',
        'functions/sql_quest.js',
        'functions/sql_ui.js',
        'functions/sql_reference.js'
    ].map(p => BASE_DIR + p);

    const failed = [];
    let remaining = MODULES.length;

    function done() {
        if (--remaining > 0) return;
        if (failed.length) {
            console.error('[SQL Sandbox] Failed to load:\n  ' + failed.join('\n  '));
        }
        try {
            boot();
        } catch (err) {
            console.error('[SQL Sandbox] Fatal boot error:', err);
        }
    }

    function loadOne(src) {
        const s = document.createElement('script');
        s.src = src;
        s.async = false;
        s.defer = false;
        s.onload = done;
        s.onerror = () => { failed.push(src); console.error('[SQL Sandbox] Failed to load:', src); done(); };
        document.head.appendChild(s);
    }

    for (let i = 0; i < MODULES.length; i++) loadOne(MODULES[i]);

    // 5. BOOTSTRAPPER
    function boot() {
        const NS = window.SQLSandbox;
        const api = window.theInfoDB;

        const required = [
            'loadCommandCatalog', 'createState', 'installStyles',
            'buildUI', 'createExecutor', 'bootUI', 'renderReferences'
        ];
        const missing = required.filter(fn => typeof NS[fn] !== 'function');
        if (missing.length) {
            console.error('[SQL Sandbox] Boot aborted. Missing:\n  ' + missing.join('\n  '));
            return;
        }

        NS.loadCommandCatalog(api, function onCatalogReady() {
            try {
                NS.installStyles();

                // UI receives the synchronously created sidebar entry
                const ui = NS.buildUI(api, sidebarEntry);
                const state = NS.createState();

                if (typeof ui._setState === 'function') ui._setState(state);

                const executor = NS.createExecutor(state, ui);

                if (typeof ui.attachExecutor === 'function') {
                    ui.attachExecutor(executor, state);
                }

                NS.renderReferences(NS.CMD, ui);
                NS.bootUI(state, ui);

                if (typeof NS.mountQuest === 'function') {
                    try {
                        NS.mountQuest(ui, executor);
                        console.log('[SQL Sandbox] Quest mounted (hidden until opened).');
                    } catch (err) {
                        console.error('[SQL Sandbox] Quest mount failed:', err);
                    }
                } else {
                    console.warn('[SQL Sandbox] sql_quest.js not loaded — skipping quest mount.');
                }

                console.log('[SQL Sandbox] Ready.');
            } catch (err) {
                console.error('[SQL Sandbox] Boot sequence error:', err);
            }
        });
    }

})();