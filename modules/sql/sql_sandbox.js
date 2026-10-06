/**
 * SQL Sandbox — Orchestrator
 * Path: modules/sql/sql_sandbox.js
 */

(function () {
    'use strict';

    if (!window.theInfoDB) {
        console.warn("[SQL Sandbox] window.theInfoDB not found. Aborting.");
        return;
    }

    window.SQLSandbox = window.SQLSandbox || {};

    // ── Resolve our own directory so functions/*.js load correctly ──
    const THIS_SRC = (document.currentScript && document.currentScript.src) || '';
    const BASE_DIR = THIS_SRC
        ? THIS_SRC.substring(0, THIS_SRC.lastIndexOf('/') + 1)
        : 'modules/sql/';

    window.SQLSandbox.BASE_DIR = BASE_DIR;

    // ── Module list (execution order matters) ──
    const MODULES = [
        'functions/sql_constants.js',
        'functions/sql_tokenizer.js',
        'functions/sql_parser.js',
        'functions/sql_evaluator.js',
        'functions/sql_executor.js',
        'functions/sql_generators.js',
        'functions/sql_styles.js',
        'functions/sql_render.js',
        'functions/sql_ui.js',
        'functions/sql_reference.js'
    ].map(p => BASE_DIR + p);

    const failed = [];
    let remaining = MODULES.length;

    function done() {
        if (--remaining > 0) return;
        if (failed.length) console.error('[SQL Sandbox] Failed to load:\n  ' + failed.join('\n  '));
        try { boot(); } catch (err) { console.error('[SQL Sandbox] Fatal boot error:', err); }
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

    function boot() {
        const NS = window.SQLSandbox;
        const api = window.theInfoDB;

        const required = [
            'loadCommandCatalog', 'createState', 'installStyles',
            'buildUI', 'createExecutor', 'bootUI', 'renderReferences'
        ];
        const missing = required.filter(fn => typeof NS[fn] !== 'function');
        if (missing.length) {
            console.error('[SQL Sandbox] Boot aborted. Missing:\n  ' + missing.join('\n  ') +
                          '\nLoaded keys: ' + Object.keys(NS).join(', '));
            return;
        }

        NS.loadCommandCatalog(api, function onCatalogReady() {
            try {
                NS.installStyles();

                const ui = NS.buildUI(api);
                const state = NS.createState();

                // Give the UI a reference to state BEFORE wiring events
                if (typeof ui._setState === 'function') ui._setState(state);

                const executor = NS.createExecutor(state, ui);

                // Pass state explicitly as 2nd arg as well
                if (typeof ui.attachExecutor === 'function') {
                    ui.attachExecutor(executor, state);
                }

                NS.renderReferences(NS.CMD, ui);
                NS.bootUI(state, ui);

                console.log('[SQL Sandbox] Ready.');
            } catch (err) {
                console.error('[SQL Sandbox] Boot sequence error:', err);
            }
        });
    }

})();