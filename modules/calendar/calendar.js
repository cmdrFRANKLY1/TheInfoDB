/**
 * Calendar Module — with Weather + German Holidays + Viona Reports
 * Path: modules/calendar/calendar.js
 *
 * Monochrome. Weather icons + H/L temps live inside each day cell.
 * Mo–Fr activity text from each Ausbildungsnachweis renders in each day.
 * Clicking a day with content opens a full-screen detail popup.
 */

(function () {
    'use strict';

    // Guard against double-load
    if (window.Calendar && window.Calendar.__booted) {
        console.warn('[Calendar] Already booted — skipping duplicate load.');
        return;
    }

    if (!window.theInfoDB) {
        console.warn('[Calendar] window.theInfoDB not found. Aborting.');
        return;
    }

    const api = window.theInfoDB;

    // ─────────────────────────────────────────────────────────────
    // 0. Paths
    // ─────────────────────────────────────────────────────────────
    const THIS_SRC = (document.currentScript && document.currentScript.src) || '';
    const BASE_DIR = THIS_SRC
        ? THIS_SRC.substring(0, THIS_SRC.lastIndexOf('/') + 1)
        : 'modules/calendar/';
    const REGISTRY_URL = BASE_DIR + 'registryForApis.json';

    // ─────────────────────────────────────────────────────────────
    // 1. Registry loader
    // ─────────────────────────────────────────────────────────────
    async function loadRegistry() {
        try {
            const res = await fetch(REGISTRY_URL, { cache: 'no-cache' });
            if (!res.ok) return null;
            const json = await res.json();
            if (Array.isArray(json)) return json.filter(x => typeof x === 'string');
            if (json && Array.isArray(json.apis)) return json.apis.filter(x => typeof x === 'string');
            return null;
        } catch (_) {
            return null;
        }
    }

    function loadScript(src) {
        return new Promise((resolve) => {
            if (document.querySelector('script[data-cal-api="' + src + '"]')) return resolve(true);
            const s = document.createElement('script');
            s.src = src;
            s.async = false;
            s.dataset.calApi = src;
            s.onload = () => resolve(true);
            s.onerror = () => {
                console.warn('[Calendar] Failed to load API script: ' + src);
                resolve(false);
            };
            document.head.appendChild(s);
        });
    }

    function normalizeApiPath(p) {
        let path = String(p || '').trim();
        if (!path) return '';
        if (!/\.js$/i.test(path)) path += '.js';
        return path;
    }

    // ─────────────────────────────────────────────────────────────
    // 2. Styles — monochrome, readable on TVs and monitors
    // ─────────────────────────────────────────────────────────────
    const STYLE_ID = 'calendar-styles-v10';

    const STYLES = `
        .cal-view-container,
        .cal-holiday-panel,
        .cal-sidebar-entry,
        .cal-modal-backdrop {
            font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto,
                         'Helvetica Neue', Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
            letter-spacing: -0.005em;
        }

        .cal-sidebar-entry {
            display: flex !important;
            align-items: center;
            justify-content: flex-start !important;
            gap: 10px;
            font-size: 0.95rem;
            font-weight: 500;
        }
        .cal-sidebar-entry svg {
            display: block;
            width: 16px;
            height: 16px;
            color: currentColor;
            flex-shrink: 0;
            opacity: 0.85;
        }
        .cal-sidebar-entry:hover svg { opacity: 1; }

        #content-area { position: relative; }
        #content-area > .center-view { overflow: visible; }

        .cal-view-container {
            position: absolute;
            inset: 0;
            display: flex;
            flex-direction: column;
            background: var(--bg-color);
            overflow: hidden;
            padding: 12px !important;
            margin: 0 !important;
            gap: 12px;
            box-sizing: border-box;
        }

        .cal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            background: var(--panel-bg);
            flex-shrink: 0;
            gap: 16px;
            flex-wrap: wrap;
        }
        .cal-title {
            font-size: 1.5rem;
            font-weight: 700;
            letter-spacing: -0.02em;
            color: var(--text-color);
        }

        .cal-header-right {
            display: flex;
            gap: 10px;
            align-items: center;
            flex-wrap: wrap;
        }

        .cal-nav { display: flex; gap: 6px; align-items: center; }
        .cal-nav-btn {
            background: transparent;
            border: 1px solid var(--border-color);
            color: var(--text-color);
            border-radius: 6px;
            font-family: inherit;
            font-size: 0.9rem;
            font-weight: 500;
            padding: 6px 13px;
            cursor: pointer;
            transition: background 0.1s, border-color 0.1s;
            min-width: 38px;
            line-height: 1;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }
        .cal-nav-btn:hover {
            background: rgba(128,128,128,0.12);
            border-color: var(--text-color);
        }
        .cal-nav-btn.icon-only { width: 38px; padding: 6px 0; }

        .cal-location { position: relative; min-width: 260px; }
        .cal-location-input-wrap { position: relative; display: flex; align-items: center; }
        .cal-location-input {
            width: 100%;
            padding: 6px 30px 6px 11px;
            border: 1px solid var(--border-color);
            background: transparent;
            color: var(--text-color);
            border-radius: 6px;
            font-family: inherit;
            font-size: 0.9rem;
            outline: none;
            box-sizing: border-box;
        }
        .cal-location-input::placeholder { opacity: 0.45; }
        .cal-location-input:focus { border-color: var(--text-color); }
        .cal-location-input:disabled { opacity: 0.5; cursor: not-allowed; }

        .cal-location-arrow {
            position: absolute;
            right: 6px; top: 50%;
            transform: translateY(-50%);
            width: 22px; height: 22px;
            display: flex; align-items: center; justify-content: center;
            background: transparent; border: none;
            color: var(--text-color); opacity: 0.55;
            cursor: pointer; padding: 0; border-radius: 4px;
            transition: opacity 0.1s, background 0.1s, transform 0.15s;
        }
        .cal-location-arrow:hover { opacity: 1; background: rgba(128,128,128,0.12); }
        .cal-location-arrow.open { transform: translateY(-50%) rotate(180deg); }
        .cal-location-arrow svg { display: block; width: 12px; height: 12px; }

        .cal-location-suggestions {
            position: absolute;
            top: calc(100% + 4px);
            left: 0; right: 0;
            background: var(--panel-bg);
            border: 1px solid var(--border-color);
            border-radius: 6px;
            max-height: 260px;
            overflow-y: auto;
            z-index: 100;
            display: none;
            box-shadow: 0 8px 20px rgba(0,0,0,0.35);
        }
        .cal-location-suggestions.show { display: block; }
        .cal-location-item {
            padding: 8px 12px;
            cursor: pointer;
            font-size: 0.86rem;
            color: var(--text-color);
            border-bottom: 1px solid var(--border-color);
            line-height: 1.3;
        }
        .cal-location-item:last-child { border-bottom: none; }
        .cal-location-item:hover { background: rgba(128,128,128,0.12); }
        .cal-location-item .cal-loc-sub {
            font-size: 0.74rem;
            opacity: 0.55;
            display: block;
        }
        .cal-location-current {
            font-size: 0.76rem;
            opacity: 0.6;
            color: var(--text-color);
            white-space: nowrap;
            max-width: 200px;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .cal-grid-wrap {
            flex: 1 1 auto;
            min-height: 0;
            display: flex;
            width: 100%;
            overflow: hidden;
        }
        .cal-card {
            background: var(--panel-bg);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 12px;
            flex: 1 1 auto;
            display: flex;
            flex-direction: column;
            gap: 6px;
            min-height: 0;
        }

        .cal-weekdays,
        .cal-days {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 4px;
        }
        .cal-days {
            flex: 1 1 auto;
            grid-auto-rows: minmax(96px, 1fr);
        }

        .cal-weekday {
            text-align: center;
            font-size: 0.74rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            opacity: 0.55;
            padding: 6px 0;
            color: var(--text-color);
        }

        .cal-cell {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: stretch;
            justify-content: flex-start;
            min-height: 96px;
            border-radius: 6px;
            font-size: 0.88rem;
            font-weight: 500;
            color: var(--text-color);
            cursor: pointer;
            border: 1px solid transparent;
            transition: background 0.08s, border-color 0.08s;
            user-select: none;
            padding: 6px 7px;
            box-sizing: border-box;
            overflow: hidden;
        }
        .cal-cell:hover { background: rgba(128,128,128,0.12); }
        .cal-cell.muted { opacity: 0.28; }
        .cal-cell.muted:hover { background: rgba(128,128,128,0.06); }

        .cal-cell.today {
            background: rgba(128,128,128,0.14);
            border-color: var(--text-color);
        }
        .cal-cell.selected {
            background: var(--text-color);
            color: var(--bg-color);
            border-color: var(--text-color);
        }
        .cal-cell.selected * { color: var(--bg-color) !important; }

        .cal-cell.holiday::before {
            content: '';
            position: absolute;
            top: 5px; right: 5px;
            width: 6px; height: 6px;
            border-radius: 50%;
            border: 1px solid currentColor;
            opacity: 0.55;
        }
        .cal-cell.viona::after {
            content: '';
            position: absolute;
            bottom: 5px; right: 5px;
            width: 5px; height: 5px;
            background: currentColor;
            opacity: 0.55;
        }
        .cal-cell.has-content:hover { background: rgba(128,128,128,0.16); }
        .cal-cell.selected.has-content:hover { background: var(--text-color); }

        .cal-cell-head {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 4px;
            flex-shrink: 0;
        }
        .cal-cell-day {
            font-size: 1rem;
            font-weight: 700;
            line-height: 1.1;
            font-variant-numeric: tabular-nums;
        }
        .cal-cell-weather {
            display: flex;
            align-items: center;
            gap: 3px;
            font-size: 0.7rem;
            opacity: 0.75;
            line-height: 1;
            white-space: nowrap;
            color: currentColor;
        }
        .cal-cell-weather svg {
            width: 16px; height: 16px;
            flex-shrink: 0;
            color: currentColor;
        }
        .cal-cell-weather .temp {
            font-variant-numeric: tabular-nums;
            letter-spacing: -0.02em;
        }

        .cal-cell-viona {
            margin-top: 3px;
            font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto,
                         'Helvetica Neue', Arial, sans-serif;
            font-size: 0.72rem;
            line-height: 1.4;
            color: currentColor;
            opacity: 0.9;
            flex: 1 1 auto;
            min-height: 0;
            overflow: hidden;
            word-break: break-word;
            hyphens: auto;
        }
        .cal-cell-viona-list {
            list-style: none;
            margin: 0; padding: 0;
        }
        .cal-cell-viona-list li {
            position: relative;
            padding-left: 10px;
            margin: 0 0 1px 0;
        }
        .cal-cell-viona-list li::before {
            content: '·';
            position: absolute;
            left: 0;
            opacity: 0.6;
        }
        .cal-cell-viona-more {
            font-style: italic;
            opacity: 0.6;
        }

        .cal-holiday-panel {
            display: none;
            flex-direction: column;
            height: 100%;
            min-height: 0;
            box-sizing: border-box;
        }
        .cal-holiday-panel.active { display: flex; }

        .cal-holiday-card {
            background: var(--panel-bg);
            border: 1px solid var(--border-color);
            border-radius: 6px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            flex: 1 1 auto;
            min-height: 0;
        }
        .cal-holiday-header {
            padding: 10px 14px;
            font-size: 0.88rem;
            font-weight: 600;
            border-bottom: 1px solid var(--border-color);
            background: rgba(0,0,0,0.1);
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            gap: 6px;
            flex-shrink: 0;
        }
        .cal-holiday-header .year {
            opacity: 0.55;
            font-weight: 500;
            font-size: 0.78rem;
        }
        .cal-holiday-body {
            padding: 6px;
            overflow-y: auto;
            flex: 1 1 auto;
            min-height: 0;
            display: flex;
            flex-direction: column;
            gap: 2px;
            scrollbar-width: thin;
            scrollbar-color: #6b7280 transparent;
        }
        .cal-holiday-body::-webkit-scrollbar { width: 8px; }
        .cal-holiday-body::-webkit-scrollbar-thumb {
            background: #6b7280;
            border-radius: 4px;
        }

        .cal-holiday-item {
            display: flex;
            align-items: baseline;
            gap: 8px;
            padding: 7px 9px;
            border-radius: 4px;
            cursor: pointer;
            border: 1px solid transparent;
            transition: background 0.08s, border-color 0.08s;
            line-height: 1.28;
        }
        .cal-holiday-item:hover {
            background: rgba(128,128,128,0.12);
            border-color: var(--border-color);
        }
        .cal-holiday-item.today {
            background: rgba(128,128,128,0.16);
            border-color: var(--text-color);
        }
        .cal-holiday-item.past { opacity: 0.4; }
        .cal-holiday-date {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex-shrink: 0;
            width: 38px;
            line-height: 1.1;
        }
        .cal-holiday-date .d {
            font-size: 1.05rem;
            font-weight: 700;
            font-variant-numeric: tabular-nums;
        }
        .cal-holiday-date .m {
            font-size: 0.62rem;
            text-transform: uppercase;
            opacity: 0.6;
            letter-spacing: 0.05em;
        }
        .cal-holiday-main { flex: 1 1 auto; min-width: 0; }
        .cal-holiday-name {
            font-size: 0.85rem;
            font-weight: 600;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .cal-holiday-when {
            font-size: 0.72rem;
            opacity: 0.6;
            margin-top: 1px;
        }
        .cal-holiday-when.today {
            opacity: 1;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.04em;
        }
        .cal-holiday-when.tomorrow { opacity: 1; font-weight: 600; }
        .cal-holiday-empty {
            padding: 20px 12px;
            text-align: center;
            opacity: 0.5;
            font-size: 0.82rem;
        }

        .cal-modal-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.65);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 9000;
            padding: 24px;
            box-sizing: border-box;
        }
        .cal-modal-backdrop.show { display: flex; }

        .cal-modal {
            background: var(--panel-bg);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            max-width: 720px;
            width: 100%;
            max-height: 82vh;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            box-shadow: 0 24px 48px rgba(0,0,0,0.55);
        }
        .cal-modal-header {
            padding: 16px 20px;
            border-bottom: 1px solid var(--border-color);
            background: rgba(0,0,0,0.12);
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            flex-shrink: 0;
        }
        .cal-modal-title {
            font-size: 1.1rem;
            font-weight: 700;
            letter-spacing: -0.01em;
            color: var(--text-color);
            line-height: 1.25;
        }
        .cal-modal-sub {
            font-size: 0.78rem;
            opacity: 0.65;
            margin-top: 2px;
        }
        .cal-modal-close {
            background: transparent;
            border: 1px solid var(--border-color);
            color: var(--text-color);
            border-radius: 6px;
            font-family: inherit;
            font-size: 0.9rem;
            font-weight: 500;
            padding: 5px 12px;
            cursor: pointer;
            line-height: 1;
            flex-shrink: 0;
        }
        .cal-modal-close:hover {
            background: rgba(128,128,128,0.12);
            border-color: var(--text-color);
        }

        .cal-modal-body {
            padding: 18px 20px;
            overflow-y: auto;
            flex: 1 1 auto;
            min-height: 0;
            font-size: 0.95rem;
            line-height: 1.6;
            color: var(--text-color);
            scrollbar-width: thin;
            scrollbar-color: #6b7280 transparent;
        }
        .cal-modal-body::-webkit-scrollbar { width: 10px; }
        .cal-modal-body::-webkit-scrollbar-thumb {
            background: #6b7280;
            border-radius: 5px;
        }

        .cal-modal-section { margin-bottom: 18px; }
        .cal-modal-section:last-child { margin-bottom: 0; }
        .cal-modal-section-title {
            font-size: 0.7rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            opacity: 0.55;
            margin-bottom: 8px;
        }
        .cal-modal-holiday {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 10px;
            border: 1px solid var(--text-color);
            border-radius: 4px;
            font-size: 0.82rem;
            font-weight: 600;
            background: rgba(128,128,128,0.08);
        }
        .cal-modal-holiday::before {
            content: '';
            width: 6px; height: 6px;
            border-radius: 50%;
            border: 1px solid currentColor;
        }
        .cal-modal-weather {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 0.9rem;
        }
        .cal-modal-weather svg {
            width: 26px; height: 26px;
            color: currentColor;
            flex-shrink: 0;
        }
        .cal-modal-weather .mw-temp {
            font-weight: 700;
            font-variant-numeric: tabular-nums;
        }
        .cal-modal-weather .mw-label { opacity: 0.75; }

        .cal-modal-acts {
            list-style: none;
            margin: 0; padding: 0;
            font-size: 0.98rem;
            line-height: 1.6;
        }
        .cal-modal-acts li {
            position: relative;
            padding: 6px 0 6px 20px;
            border-bottom: 1px solid var(--border-color);
        }
        .cal-modal-acts li:last-child { border-bottom: none; }
        .cal-modal-acts li::before {
            content: '';
            position: absolute;
            left: 6px;
            top: 50%;
            transform: translateY(-50%);
            width: 6px; height: 6px;
            background: currentColor;
            opacity: 0.6;
            border-radius: 50%;
        }

        .cal-modal-hours {
            display: inline-block;
            padding: 4px 10px;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            font-size: 0.82rem;
            font-weight: 600;
            margin-top: 8px;
        }

        .cal-modal-empty {
            padding: 16px 0;
            opacity: 0.55;
            font-size: 0.9rem;
            text-align: center;
        }

        .cal-modal-source {
            font-size: 0.72rem;
            opacity: 0.5;
            margin-top: 18px;
            padding-top: 12px;
            border-top: 1px solid var(--border-color);
            word-break: break-all;
        }
        .cal-modal-source a {
            color: var(--text-color);
            text-decoration: underline;
        }
    `;

    function installStyles() {
        document.querySelectorAll('style[id^="calendar-styles"]').forEach(el => {
            if (el.id !== STYLE_ID) el.remove();
        });
        if (document.getElementById(STYLE_ID)) return;
        const el = document.createElement('style');
        el.id = STYLE_ID;
        el.textContent = STYLES;
        document.head.appendChild(el);
    }
    installStyles();

    // ─────────────────────────────────────────────────────────────
    // 3. Monochrome weather SVG icons
    // ─────────────────────────────────────────────────────────────
    const WEATHER_SVG = {
        sun:        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>',
        sunCloud:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3"/><path d="M9 3v1M4.5 5.5l.7.7M2.5 10h1M14.5 5.5l-.7.7"/><path d="M6 20h12a4 4 0 0 0 0-8h-.3a6 6 0 0 0-11.4 0H6a4 4 0 0 0 0 8z"/></svg>',
        cloud:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 20h12a4 4 0 0 0 0-8h-.3a6 6 0 0 0-11.4 0H6a4 4 0 0 0 0 8z"/></svg>',
        fog:        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h16M4 12h16M4 16h16"/></svg>',
        drizzle:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 14h12a4 4 0 0 0 0-8h-.3a6 6 0 0 0-11.4 0H6a4 4 0 0 0 0 8z"/><path d="M9 18v1M12 18v1M15 18v1"/></svg>',
        rain:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 14h12a4 4 0 0 0 0-8h-.3a6 6 0 0 0-11.4 0H6a4 4 0 0 0 0 8z"/><path d="M8 18l-1 3M12 18l-1 3M16 18l-1 3"/></svg>',
        snow:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 14h12a4 4 0 0 0 0-8h-.3a6 6 0 0 0-11.4 0H6a4 4 0 0 0 0 8z"/><path d="M9 18v.5M12 18v.5M15 18v.5M9 21v.5M12 21v.5M15 21v.5"/></svg>',
        thunder:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 14h12a4 4 0 0 0 0-8h-.3a6 6 0 0 0-11.4 0H6a4 4 0 0 0 0 8z"/><path d="M11 17l-2 4h4l-1 3"/></svg>'
    };

    function weatherIconKey(code) {
        if (code === 0) return 'sun';
        if (code === 1 || code === 2) return 'sunCloud';
        if (code === 3) return 'cloud';
        if (code === 45 || code === 48) return 'fog';
        if (code === 51 || code === 53 || code === 55) return 'drizzle';
        if (code === 56 || code === 57) return 'drizzle';
        if (code === 61 || code === 63 || code === 65) return 'rain';
        if (code === 66 || code === 67) return 'rain';
        if (code === 71 || code === 73 || code === 75 || code === 77) return 'snow';
        if (code === 80 || code === 81 || code === 82) return 'rain';
        if (code === 85 || code === 86) return 'snow';
        if (code === 95 || code === 96 || code === 99) return 'thunder';
        return 'cloud';
    }
    function weatherIconSVG(code) {
        return WEATHER_SVG[weatherIconKey(code)] || WEATHER_SVG.cloud;
    }

    // ─────────────────────────────────────────────────────────────
    // 4. German public holidays
    // ─────────────────────────────────────────────────────────────
    function computeEaster(year) {
        const a = year % 19;
        const b = Math.floor(year / 100);
        const c = year % 100;
        const d = Math.floor(b / 4);
        const e = b % 4;
        const f = Math.floor((b + 8) / 25);
        const g = Math.floor((b - f + 1) / 3);
        const h = (19 * a + b - d - g + 15) % 30;
        const i = Math.floor(c / 4);
        const k = c % 4;
        const l = (32 + 2 * e + 2 * i - h - k) % 7;
        const m = Math.floor((a + 11 * h + 22 * l) / 451);
        const month = Math.floor((h + l - 7 * m + 114) / 31);
        const day = ((h + l - 7 * m + 114) % 31) + 1;
        return new Date(year, month - 1, day);
    }
    function addDays(date, n) {
        const d = new Date(date);
        d.setDate(d.getDate() + n);
        return d;
    }
    function germanHolidays(year) {
        const easter = computeEaster(year);
        return [
            { date: new Date(year, 0, 1),  name: 'Neujahr' },
            { date: addDays(easter, -2),   name: 'Karfreitag' },
            { date: addDays(easter, 1),    name: 'Ostermontag' },
            { date: new Date(year, 4, 1),  name: 'Tag der Arbeit' },
            { date: addDays(easter, 39),   name: 'Christi Himmelfahrt' },
            { date: addDays(easter, 50),   name: 'Pfingstmontag' },
            { date: new Date(year, 9, 3),  name: 'Tag der Deutschen Einheit' },
            { date: new Date(year, 11, 25),name: '1. Weihnachtstag' },
            { date: new Date(year, 11, 26),name: '2. Weihnachtstag' }
        ].sort((a, b) => a.date - b.date);
    }

    // ─────────────────────────────────────────────────────────────
    // 5. State
    // ─────────────────────────────────────────────────────────────
    const MONTHS = ['January','February','March','April','May','June',
                    'July','August','September','October','November','December'];
    const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const WEEKDAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

    let viewDate = new Date();
    let selectedDate = new Date();

    let selectedLocation = null;
    let forecastCache = null;
    let suggestTimer = null;
    let vionaReady = false;

    // ─────────────────────────────────────────────────────────────
    // 6. UI markup
    // ─────────────────────────────────────────────────────────────
    const sidebarEntry = document.createElement('div');
    sidebarEntry.className = 'settings-row cal-sidebar-entry';
    sidebarEntry.innerHTML = `
        <svg viewBox="0 0 24 24" width="16" height="16"
             fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round"
             aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <span>Calendar</span>
    `;

    const centerView = document.createElement('div');
    centerView.className = 'center-view hidden cal-view-container';
    centerView.id = 'calendar-view';
    centerView.innerHTML = `
        <div class="cal-header">
            <div class="cal-title" id="cal-title"></div>
            <div class="cal-header-right">
                <div class="cal-location">
                    <div class="cal-location-input-wrap">
                        <input type="text" class="cal-location-input" id="cal-location-input"
                               placeholder="Search location…" autocomplete="off" spellcheck="false">
                        <button class="cal-location-arrow" id="cal-location-arrow"
                                type="button" aria-label="Show locations" title="Show locations">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                 stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="6 9 12 15 18 9"/>
                            </svg>
                        </button>
                    </div>
                    <div class="cal-location-suggestions" id="cal-location-suggestions"></div>
                </div>
                <div class="cal-location-current" id="cal-location-current"></div>
                <div class="cal-nav">
                    <button class="cal-nav-btn icon-only" id="cal-prev" title="Previous month" aria-label="Previous month">‹</button>
                    <button class="cal-nav-btn" id="cal-today">Today</button>
                    <button class="cal-nav-btn icon-only" id="cal-next" title="Next month" aria-label="Next month">›</button>
                </div>
            </div>
        </div>
        <div class="cal-grid-wrap">
            <div class="cal-card">
                <div class="cal-weekdays" id="cal-weekdays"></div>
                <div class="cal-days" id="cal-days"></div>
            </div>
        </div>
    `;

    const rightPanel = document.createElement('div');
    rightPanel.className = 'cal-holiday-panel';
    rightPanel.id = 'cal-holiday-view';
    rightPanel.innerHTML = `
        <div class="cal-holiday-card">
            <div class="cal-holiday-header">
                <span>Deutsche Feiertage</span>
                <span class="year" id="cal-holiday-year"></span>
            </div>
            <div class="cal-holiday-body" id="cal-holiday-body"></div>
        </div>
    `;

    const modal = document.createElement('div');
    modal.className = 'cal-modal-backdrop';
    modal.id = 'cal-modal';
    modal.innerHTML = `
        <div class="cal-modal" role="dialog" aria-modal="true">
            <div class="cal-modal-header">
                <div>
                    <div class="cal-modal-title" id="cal-modal-title"></div>
                    <div class="cal-modal-sub" id="cal-modal-sub"></div>
                </div>
                <button class="cal-modal-close" id="cal-modal-close" aria-label="Close">Close</button>
            </div>
            <div class="cal-modal-body" id="cal-modal-body"></div>
        </div>
    `;

    api.ui.registerElement('left-sidebar-top', sidebarEntry);
    api.ui.registerElement('content-panel', centerView);
    api.ui.registerElement('right-sidebar-top', rightPanel);
    document.body.appendChild(modal);

    const el = {
        title:       centerView.querySelector('#cal-title'),
        weekdays:    centerView.querySelector('#cal-weekdays'),
        days:        centerView.querySelector('#cal-days'),
        locInput:    centerView.querySelector('#cal-location-input'),
        locArrow:    centerView.querySelector('#cal-location-arrow'),
        locSuggest:  centerView.querySelector('#cal-location-suggestions'),
        locCurrent:  centerView.querySelector('#cal-location-current'),
        prevBtn:     centerView.querySelector('#cal-prev'),
        nextBtn:     centerView.querySelector('#cal-next'),
        todayBtn:    centerView.querySelector('#cal-today'),
        holidayYear: rightPanel.querySelector('#cal-holiday-year'),
        holidayBody: rightPanel.querySelector('#cal-holiday-body'),
        modal,
        modalTitle:  modal.querySelector('#cal-modal-title'),
        modalSub:    modal.querySelector('#cal-modal-sub'),
        modalBody:   modal.querySelector('#cal-modal-body'),
        modalClose:  modal.querySelector('#cal-modal-close')
    };

    // ─────────────────────────────────────────────────────────────
    // 7. Helpers
    // ─────────────────────────────────────────────────────────────
    function sameDay(a, b) {
        return a.getFullYear() === b.getFullYear() &&
               a.getMonth()    === b.getMonth()    &&
               a.getDate()     === b.getDate();
    }
    function dateKey(d) {
        const pad = n => String(n).padStart(2, '0');
        return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
    }
    function fmtLong(d) {
        return d.toLocaleDateString(undefined, {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
    }
    function weatherAvailable() {
        return !!(window.WeatherAPI && typeof window.WeatherAPI.getForecast === 'function');
    }
    function vionaAvailable() {
        return !!(window.VionaAPI && typeof window.VionaAPI.getActivitiesForDate === 'function');
    }
    function escapeHTML(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    function buildHolidayMap(year) {
        const map = new Map();
        for (const h of germanHolidays(year)) map.set(dateKey(h.date), h.name);
        return map;
    }

    // ─────────────────────────────────────────────────────────────
    // 8. Weather lookup
    // ─────────────────────────────────────────────────────────────
    function getWeatherForDate(date) {
        if (!forecastCache || !forecastCache.daily || !forecastCache.daily.time) return null;
        if (!weatherAvailable()) return null;
        const key = dateKey(date);
        const idx = forecastCache.daily.time.indexOf(key);
        if (idx === -1) return null;
        const d = forecastCache.daily;
        const code = d.weather_code ? d.weather_code[idx] : 0;
        const info = window.WeatherAPI.weatherCodeToInfo(code);
        return {
            code,
            label: info.label,
            tempMax: d.temperature_2m_max ? d.temperature_2m_max[idx] : null,
            tempMin: d.temperature_2m_min ? d.temperature_2m_min[idx] : null
        };
    }

    // ─────────────────────────────────────────────────────────────
    // 9. Location search
    // ─────────────────────────────────────────────────────────────
    const RECENT_KEY = 'calendar-recent-locations-v1';
    const RECENT_MAX = 8;

    function loadRecentLocations() {
        try {
            const raw = localStorage.getItem(RECENT_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (_) { return []; }
    }
    function saveRecentLocations(list) {
        try { localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, RECENT_MAX))); } catch (_) {}
    }
    function rememberLocation(loc) {
        const recent = loadRecentLocations();
        const key = loc.name + '|' + loc.latitude + '|' + loc.longitude;
        const filtered = recent.filter(r => (r.name + '|' + r.latitude + '|' + r.longitude) !== key);
        filtered.unshift(loc);
        saveRecentLocations(filtered);
    }

    function hideSuggestions() {
        el.locSuggest.classList.remove('show');
        el.locSuggest.innerHTML = '';
        el.locArrow.classList.remove('open');
    }

    function renderSuggestions(list, mode) {
        el.locSuggest.innerHTML = '';
        if (mode === 'recent' && list.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'cal-location-item';
            empty.style.cursor = 'default';
            empty.style.opacity = '0.55';
            empty.textContent = 'No recent locations — type to search.';
            el.locSuggest.appendChild(empty);
            el.locSuggest.classList.add('show');
            return;
        }
        if (!list || list.length === 0) { hideSuggestions(); return; }

        for (const loc of list) {
            const item = document.createElement('div');
            item.className = 'cal-location-item';
            const subParts = [];
            if (loc.admin1 && loc.admin1 !== loc.name) subParts.push(loc.admin1);
            if (loc.country) subParts.push(loc.country);
            item.innerHTML =
                '<span>' + escapeHTML(loc.name) + '</span>' +
                (subParts.length ? '<span class="cal-loc-sub">' + escapeHTML(subParts.join(', ')) + '</span>' : '');
            item.addEventListener('click', () => selectLocation(loc));
            el.locSuggest.appendChild(item);
        }
        el.locSuggest.classList.add('show');
    }

    let searchSeq = 0;
    async function onLocationInput() {
        const q = el.locInput.value.trim();
        if (q.length < 2) { hideSuggestions(); return; }
        if (!weatherAvailable()) return;

        const mySeq = ++searchSeq;
        try {
            const results = await window.WeatherAPI.searchLocations(q, 8);
            if (mySeq !== searchSeq) return;
            if (el.locInput.value.trim() !== q) return;
            renderSuggestions(results, 'search');
        } catch (err) {
            console.warn('[Calendar] Location search failed:', err);
            if (mySeq === searchSeq) hideSuggestions();
        }
    }

    function showRecentMenu() {
        if (el.locSuggest.classList.contains('show')) { hideSuggestions(); return; }
        renderSuggestions(loadRecentLocations(), 'recent');
        el.locArrow.classList.add('open');
    }

    async function selectLocation(loc) {
        selectedLocation = loc;
        hideSuggestions();
        rememberLocation(loc);
        el.locInput.value = loc.name;
        el.locCurrent.textContent = loc.name + (loc.country ? ', ' + loc.country : '');
        try {
            const data = await window.WeatherAPI.getForecast(loc.latitude, loc.longitude, 16);
            forecastCache = data;
            render();
        } catch (err) {
            console.warn('[Calendar] Forecast fetch failed:', err);
            forecastCache = null;
            render();
        }
    }

    el.locInput.addEventListener('input', () => {
        clearTimeout(suggestTimer);
        suggestTimer = setTimeout(onLocationInput, 200);
    });
    el.locInput.addEventListener('focus', () => {
        if (el.locSuggest.childElementCount > 0 && !el.locSuggest.classList.contains('show')) {
            el.locSuggest.classList.add('show');
        }
    });
    el.locInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { hideSuggestions(); el.locInput.blur(); }
    });
    el.locArrow.addEventListener('mousedown', (e) => e.preventDefault());
    el.locArrow.addEventListener('click', (e) => { e.stopPropagation(); showRecentMenu(); });
    document.addEventListener('click', (e) => {
        const inLocation = el.locInput.contains(e.target) ||
                          el.locSuggest.contains(e.target) ||
                          el.locArrow.contains(e.target);
        if (!inLocation) hideSuggestions();
    });

    // ─────────────────────────────────────────────────────────────
    // 10. Detail popup
    // ─────────────────────────────────────────────────────────────
    function openDetailPopup(date) {
        const key = dateKey(date);
        const holidayName = buildHolidayMap(date.getFullYear()).get(key);
        const weather = getWeatherForDate(date);
        const viona = vionaAvailable() ? window.VionaAPI.getActivitiesForDate(date) : null;

        el.modalTitle.textContent = fmtLong(date);

        const subs = [];
        if (holidayName) subs.push('Feiertag');
        if (viona) subs.push((viona.activities.length) + ' Aktivität' + (viona.activities.length === 1 ? '' : 'en'));
        el.modalSub.textContent = subs.join(' · ');
        el.modalSub.style.display = subs.length ? '' : 'none';

        const bodyParts = [];

        if (holidayName) {
            bodyParts.push(
                '<div class="cal-modal-section">' +
                    '<div class="cal-modal-section-title">Feiertag</div>' +
                    '<div class="cal-modal-holiday">' + escapeHTML(holidayName) + '</div>' +
                '</div>'
            );
        }

        if (weather) {
            bodyParts.push(
                '<div class="cal-modal-section">' +
                    '<div class="cal-modal-section-title">Wetter</div>' +
                    '<div class="cal-modal-weather">' +
                        weatherIconSVG(weather.code) +
                        '<span class="mw-label">' + escapeHTML(weather.label) + '</span>' +
                        (weather.tempMax != null ? '<span class="mw-temp">H ' + Math.round(weather.tempMax) + '°</span>' : '') +
                        (weather.tempMin != null ? '<span class="mw-temp">L ' + Math.round(weather.tempMin) + '°</span>' : '') +
                    '</div>' +
                '</div>'
            );
        }

        if (viona && viona.activities && viona.activities.length) {
            const itemsHtml = viona.activities
                .map(a => '<li>' + escapeHTML(a) + '</li>')
                .join('');
            bodyParts.push(
                '<div class="cal-modal-section">' +
                    '<div class="cal-modal-section-title">Ausbildungsnachweis</div>' +
                    '<ul class="cal-modal-acts">' + itemsHtml + '</ul>' +
                    (viona.hours ? '<span class="cal-modal-hours">' + escapeHTML(viona.hours) + ' Stunden</span>' : '') +
                '</div>'
            );
        }

        if (!bodyParts.length) {
            bodyParts.push('<div class="cal-modal-empty">No details for this day.</div>');
        }

        if (viona && viona.source && viona.source.name) {
            bodyParts.push(
                '<div class="cal-modal-source">' +
                    'Quelle: ' +
                    (viona.source.url
                        ? '<a href="' + escapeHTML(viona.source.url) + '" target="_blank" rel="noopener">' + escapeHTML(viona.source.name) + '</a>'
                        : escapeHTML(viona.source.name)) +
                '</div>'
            );
        }

        el.modalBody.innerHTML = bodyParts.join('');
        el.modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeDetailPopup() {
        el.modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    el.modalClose.addEventListener('click', closeDetailPopup);
    el.modal.addEventListener('click', (e) => {
        if (e.target === el.modal) closeDetailPopup();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && el.modal.classList.contains('show')) {
            closeDetailPopup();
        }
    });

    // ─────────────────────────────────────────────────────────────
    // 11. Render calendar
    // ─────────────────────────────────────────────────────────────
    function renderWeekdaysOnce() {
        if (el.weekdays.childElementCount > 0) return;
        for (const name of WEEKDAYS) {
            const cell = document.createElement('div');
            cell.className = 'cal-weekday';
            cell.textContent = name;
            el.weekdays.appendChild(cell);
        }
    }

    function buildVionaContent(viona) {
        const wrap = document.createElement('div');
        wrap.className = 'cal-cell-viona';
        const ul = document.createElement('ul');
        ul.className = 'cal-cell-viona-list';

        const MAX_BULLETS = 3;
        const shown = viona.activities.slice(0, MAX_BULLETS);
        for (const a of shown) {
            const li = document.createElement('li');
            li.textContent = a;
            ul.appendChild(li);
        }
        if (viona.activities.length > MAX_BULLETS) {
            const li = document.createElement('li');
            li.className = 'cal-cell-viona-more';
            li.textContent = '+' + (viona.activities.length - MAX_BULLETS) + ' weitere…';
            ul.appendChild(li);
        }
        wrap.appendChild(ul);
        return wrap;
    }

    function buildCell(date, muted, holidayMap) {
        const cell = document.createElement('div');
        cell.className = 'cal-cell' + (muted ? ' muted' : '');

        const tooltipBits = [fmtLong(date)];

        const head = document.createElement('div');
        head.className = 'cal-cell-head';

        const dayDiv = document.createElement('div');
        dayDiv.className = 'cal-cell-day';
        dayDiv.textContent = date.getDate();
        head.appendChild(dayDiv);

        const w = getWeatherForDate(date);
        if (w && !muted) {
            const wDiv = document.createElement('div');
            wDiv.className = 'cal-cell-weather';
            wDiv.innerHTML = weatherIconSVG(w.code);
            if (w.tempMax != null && w.tempMin != null) {
                const t = document.createElement('span');
                t.className = 'temp';
                t.textContent = Math.round(w.tempMax) + '°/' + Math.round(w.tempMin) + '°';
                wDiv.appendChild(t);
            }
            head.appendChild(wDiv);
            tooltipBits.push(w.label + ' — ' + Math.round(w.tempMax) + '° / ' + Math.round(w.tempMin) + '°');
        }

        cell.appendChild(head);

        const holidayName = holidayMap.get(dateKey(date));
        if (holidayName) {
            cell.classList.add('holiday');
            tooltipBits.push('Feiertag: ' + holidayName);
        }

        let hasContent = false;
        if (!muted && vionaAvailable()) {
            const viona = window.VionaAPI.getActivitiesForDate(date);
            if (viona && viona.activities && viona.activities.length) {
                cell.classList.add('viona');
                cell.appendChild(buildVionaContent(viona));
                hasContent = true;
                tooltipBits.push('Bericht:');
                for (const a of viona.activities) tooltipBits.push('· ' + a);
                if (viona.hours) tooltipBits.push('Stunden: ' + viona.hours);
            }
        }

        const today = new Date();
        if (!muted && sameDay(date, today)) cell.classList.add('today');
        if (!muted && sameDay(date, selectedDate)) cell.classList.add('selected');

        if (hasContent || holidayName || w) {
            cell.classList.add('has-content');
        }
        if (hasContent || holidayName) {
            cell.addEventListener('click', () => {
                selectedDate = date;
                if (muted) viewDate = new Date(date.getFullYear(), date.getMonth(), 1);
                render();
                openDetailPopup(date);
            });
        } else {
            cell.addEventListener('click', () => {
                selectedDate = date;
                if (muted) viewDate = new Date(date.getFullYear(), date.getMonth(), 1);
                render();
            });
        }

        cell.title = tooltipBits.join('\n');
        return cell;
    }

    function render() {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        el.title.textContent = MONTHS[month] + ' ' + year;

        renderWeekdaysOnce();
        el.days.innerHTML = '';

        const holidayMap = buildHolidayMap(year);

        const firstWeekday = new Date(year, month, 1).getDay();
        const daysInMonth  = new Date(year, month + 1, 0).getDate();
        const daysInPrev   = new Date(year, month, 0).getDate();

        for (let i = 0; i < firstWeekday; i++) {
            const dayNum = daysInPrev - firstWeekday + 1 + i;
            el.days.appendChild(buildCell(new Date(year, month - 1, dayNum), true, holidayMap));
        }
        for (let d = 1; d <= daysInMonth; d++) {
            el.days.appendChild(buildCell(new Date(year, month, d), false, holidayMap));
        }
        const trailing = (7 - ((firstWeekday + daysInMonth) % 7)) % 7;
        for (let i = 1; i <= trailing; i++) {
            el.days.appendChild(buildCell(new Date(year, month + 1, i), true, holidayMap));
        }

        renderHolidayPanel();
    }

    // ─────────────────────────────────────────────────────────────
    // 12. German holidays panel
    // ─────────────────────────────────────────────────────────────
    function renderHolidayPanel() {
        const year = viewDate.getFullYear();
        el.holidayYear.textContent = String(year);

        const holidays = germanHolidays(year);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcoming = [];
        const past = [];
        for (const h of holidays) {
            const hDate = new Date(h.date);
            hDate.setHours(0, 0, 0, 0);
            const diff = Math.round((hDate - today) / 86400000);
            const entry = { ...h, diff };
            if (diff >= 0) upcoming.push(entry);
            else past.push(entry);
        }

        el.holidayBody.innerHTML = '';

        if (upcoming.length === 0 && past.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'cal-holiday-empty';
            empty.textContent = 'No holidays for ' + year + '.';
            el.holidayBody.appendChild(empty);
            return;
        }

        const buildItem = (entry) => {
            const item = document.createElement('div');
            item.className = 'cal-holiday-item';
            if (entry.diff === 0) item.classList.add('today');
            else if (entry.diff < 0) item.classList.add('past');

            const day = String(entry.date.getDate());
            const month = MONTHS_SHORT[entry.date.getMonth()];

            let whenText;
            let whenClass = '';
            if (entry.diff === 0) { whenText = 'Heute'; whenClass = ' today'; }
            else if (entry.diff === 1) { whenText = 'Morgen'; whenClass = ' tomorrow'; }
            else if (entry.diff > 1) { whenText = 'in ' + entry.diff + ' Tagen'; }
            else { whenText = 'vor ' + Math.abs(entry.diff) + ' Tagen'; }

            item.innerHTML =
                '<div class="cal-holiday-date">' +
                    '<span class="d">' + day + '</span>' +
                    '<span class="m">' + month + '</span>' +
                '</div>' +
                '<div class="cal-holiday-main">' +
                    '<div class="cal-holiday-name">' + escapeHTML(entry.name) + '</div>' +
                    '<div class="cal-holiday-when' + whenClass + '">' + whenText + '</div>' +
                '</div>';

            item.title = entry.name + ' — ' + fmtLong(entry.date);
            item.addEventListener('click', () => {
                viewDate = new Date(entry.date.getFullYear(), entry.date.getMonth(), 1);
                selectedDate = entry.date;
                render();
                openDetailPopup(entry.date);
            });
            return item;
        };

        for (const h of upcoming) el.holidayBody.appendChild(buildItem(h));

        if (past.length > 0) {
            const divider = document.createElement('div');
            divider.style.cssText =
                'padding: 6px 8px; font-size: 0.68rem; opacity: 0.5; ' +
                'text-transform: uppercase; letter-spacing: 0.06em;';
            divider.textContent = 'Frühere Feiertage';
            el.holidayBody.appendChild(divider);
            for (const h of past) el.holidayBody.appendChild(buildItem(h));
        }
    }

    // ─────────────────────────────────────────────────────────────
    // 13. Nav
    // ─────────────────────────────────────────────────────────────
    el.prevBtn.addEventListener('click', () => {
        viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
        render();
    });
    el.nextBtn.addEventListener('click', () => {
        viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
        render();
    });
    el.todayBtn.addEventListener('click', () => {
        const now = new Date();
        viewDate = new Date(now.getFullYear(), now.getMonth(), 1);
        selectedDate = now;
        render();
    });

    // ─────────────────────────────────────────────────────────────
    // 14. Sidebar click → show calendar + holiday panel
    // ─────────────────────────────────────────────────────────────
    sidebarEntry.addEventListener('click', () => {
        const mainContainer = document.getElementById('content-area');
        if (mainContainer) {
            Array.from(mainContainer.children).forEach(child => {
                if (child.classList.contains('center-view')) child.classList.add('hidden');
            });
        }
        centerView.classList.remove('hidden');

        const rightContainer = document.getElementById('right-sidebar-top');
        if (rightContainer) {
            Array.from(rightContainer.children).forEach(child => {
                if (child.id === 'cal-holiday-view') {
                    child.classList.add('active');
                    child.style.display = 'flex';
                } else {
                    child.classList.remove('active');
                    child.style.display = 'none';
                }
            });
        }
    });

    // ─────────────────────────────────────────────────────────────
    // 15. API bootstrapping
    // ─────────────────────────────────────────────────────────────
    async function bootstrapApis() {
        const registry = await loadRegistry();
        if (registry && registry.length > 0) {
            console.log('[Calendar] Loading APIs from registryForApis.json:', registry);
            for (const entry of registry) {
                const src = normalizeApiPath(entry);
                if (src) await loadScript(src);
            }
        } else {
            console.log('[Calendar] No registry found — loading default weather API.');
            await loadScript(BASE_DIR + 'apis/api_forWeather.js');
        }

        if (window.WeatherAPI) {
            el.locInput.disabled = false;
            el.locInput.placeholder = 'Search location…';
        } else {
            el.locInput.disabled = true;
            el.locInput.placeholder = 'Weather API unavailable';
        }

        if (vionaAvailable() && typeof window.VionaAPI.loadAll === 'function') {
            try {
                await window.VionaAPI.loadAll({
                    onProgress: (p) => {
                        if (p.stage === 'loading') {
                            console.log('[Calendar] Viona reports: ' + p.loaded + '/' + p.total);
                        }
                    }
                });
                vionaReady = true;
                console.log('[Calendar] Viona loaded. Days with activities: ' +
                            (window.VionaAPI.loadedCount || 0));
            } catch (err) {
                console.warn('[Calendar] Viona load failed:', err);
            }
        }

        render();
    }

    // ─────────────────────────────────────────────────────────────
    // 16. Boot
    // ─────────────────────────────────────────────────────────────
    render();
    bootstrapApis().catch(err => console.warn('[Calendar] API bootstrap failed:', err));

    window.Calendar = {
        show:     () => sidebarEntry.click(),
        today:    () => el.todayBtn.click(),
        prev:     () => el.prevBtn.click(),
        next:     () => el.nextBtn.click(),
        openDay:  (d) => openDetailPopup(d),
        closeDay: () => closeDetailPopup(),
        get viewDate()         { return viewDate; },
        get selectedDate()     { return selectedDate; },
        get selectedLocation() { return selectedLocation; },
        get hasViona()         { return vionaReady; }
    };

    
    window.Calendar.__booted = true;

    console.log('[Calendar] Module ready.');
})();