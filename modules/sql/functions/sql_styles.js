/**
 * SQL Sandbox — Styles
 * Path: modules/sql/functions/sql_styles.js
 *
 * Provides NS.installStyles() — injects the sandbox CSS into <head>.
 * Idempotent: safe to call multiple times.
 *
 * NOTE: when changing any rule in here, bump STYLE_ID so the browser
 *       doesn't reuse the previously-injected <style> element.
 */

(function (NS) {
    'use strict';

    const STYLE_ID = 'sql-sandbox-styles-v4';

    const STYLES = `
        /* ── Layout: top-level vertical stack ── */
        .sql-view-container {
            display: flex;
            flex-direction: column;
            gap: 12px;
            width: 100%;
            height: 100%;
            contain: strict;
            position: relative;
        }
        .sql-view-header {
            font-size: 1.5rem;
            font-weight: 600;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 12px;
            letter-spacing: -0.02em;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-shrink: 0;
        }
        .sql-view-header.sql-view-header-sub {
            font-size: 1.1rem;
            padding-bottom: 4px;
            border-bottom: none;
            margin-top: 4px;
            flex-shrink: 0;
        }

        /* ── Editor + Results: side by side ── */
        .sql-editor-results-row {
            display: grid;
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
            gap: 12px;
            flex: 0 0 auto;
            min-height: 200px;
            /* let children control their own height */
            align-items: stretch;
        }

        /* ── Editor ── */
        .sql-editor-wrapper {
            position: relative;
            display: flex;
            flex-direction: column;
            border: 1px solid var(--border-color);
            border-radius: 6px;
            background-color: var(--panel-bg);
            overflow: hidden;
            min-height: 0;
        }
        .sql-editor-toolbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 12px;
            border-bottom: 1px solid var(--border-color);
            background-color: rgba(0,0,0,0.1);
            flex-wrap: wrap;
            gap: 8px;
            flex-shrink: 0;
        }
        .sql-editor-toolbar > span {
            font-size: 0.8rem;
            font-weight: 500;
            color: var(--text-color);
            opacity: 0.7;
        }
        .sql-textarea-container {
            position: relative;
            width: 100%;
            height: 160px;
            flex: 0 0 auto;
        }
        .sql-textarea,
        .sql-ghost-textarea {
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            font-family: 'Consolas','Monaco','Courier New',monospace;
            font-size: 0.95rem;
            padding: 12px;
            border: none;
            line-height: 1.5;
            white-space: pre-wrap;
            word-wrap: break-word;
            overflow-y: auto;
            margin: 0;
            box-sizing: border-box;
        }
        .sql-ghost-textarea {
            color: transparent;
            pointer-events: none;
            z-index: 1;
        }
        .sql-textarea {
            background: transparent;
            color: var(--text-color);
            resize: none;
            outline: none;
            z-index: 2;
        }

        /* ── Buttons ── */
        .sql-btn {
            background-color: var(--accent-color);
            color: #ffffff;
            border: none;
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 0.85rem;
            font-weight: 500;
            cursor: pointer;
            transition: opacity 0.1s;
            font-family: inherit;
        }
        .sql-btn:hover { opacity: 0.9; }
        .sql-btn.secondary {
            background-color: transparent;
            color: var(--text-color);
            border: 1px solid var(--border-color);
        }
        .sql-btn.secondary:hover:not(:disabled) { background-color: rgba(128,128,128,0.1); }
        .sql-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        /* ── Highlighting ── */
        .sql-highlight {
            background-color: color-mix(in srgb, var(--hi-color) 20%, transparent) !important;
            color: var(--hi-color) !important;
        }
        .sql-db-table-title.sql-highlight {
            background-color: color-mix(in srgb, var(--hi-color) 25%, transparent) !important;
            border-bottom: 1px solid var(--hi-color) !important;
        }

        /* ── Results pane — now sits next to the editor ── */
        .sql-results-container {
            border: 1px solid var(--border-color);
            border-radius: 6px;
            background-color: var(--panel-bg);
            overflow: scroll;
            contain: strict;
            min-height: 0;
            min-width: 0;
            scrollbar-width: auto;
            scrollbar-color: #6b7280 rgba(255,255,255,0.06);
        }
        .sql-results-container::-webkit-scrollbar {
            width: 14px;
            height: 14px;
            background: transparent;
        }
        .sql-results-container::-webkit-scrollbar-track {
            background: rgba(255,255,255,0.06);
            border-radius: 7px;
            margin: 2px;
        }
        .sql-results-container::-webkit-scrollbar-thumb {
            background: #6b7280;
            border-radius: 7px;
            border: 3px solid transparent;
            background-clip: padding-box;
            min-height: 30px;
            min-width: 30px;
        }
        .sql-results-container::-webkit-scrollbar-thumb:hover,
        .sql-results-container::-webkit-scrollbar-thumb:active {
            background: var(--accent-color);
            background-clip: padding-box;
        }
        .sql-results-container::-webkit-scrollbar-corner { background: transparent; }

        /* ── Tables (single-line, auto-width, no truncation, no sticky) ── */
        .sql-table {
            width: max-content;
            min-width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            font-size: 0.8rem;
            table-layout: auto;
        }
        .sql-table th,
        .sql-table td {
            padding: 6px 12px;
            border-bottom: 1px solid var(--border-color);
            border-right: 1px solid rgba(128,128,128,0.08);
            text-align: left;
            white-space: nowrap;
            line-height: 1.3;
            vertical-align: middle;
            box-sizing: border-box;
        }
        .sql-table th:last-child,
        .sql-table td:last-child { border-right: none; }

        .sql-table thead th {
            font-weight: 600;
            background-color: rgba(0,0,0,0.25);
            font-size: 0.78rem;
            letter-spacing: 0.02em;
            color: var(--text-color);
            border-bottom: 1px solid var(--border-color);
            position: static !important;
            top: auto !important;
            z-index: auto !important;
        }

        .sql-table tbody td { background-color: transparent; }
        .sql-table tbody tr:nth-child(even) td {
            background-color: rgba(255,255,255,0.015);
        }

        .sql-empty-state {
            padding: 24px;
            text-align: center;
            color: var(--text-color);
            opacity: 0.5;
            font-size: 0.9rem;
        }

        /* ── Live DB state grid — FIXED 2×2 ── */
        .sql-tables-overview {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr 1fr;
            grid-auto-rows: 1fr;
            gap: 12px;
            overflow: auto;
            contain: content;
            flex: 1 1 auto;
            min-height: 360px;
            align-items: stretch;
            scrollbar-width: auto;
            scrollbar-color: #6b7280 rgba(255,255,255,0.06);
        }
        .sql-tables-overview::-webkit-scrollbar {
            width: 14px;
            height: 14px;
            background: transparent;
        }
        .sql-tables-overview::-webkit-scrollbar-track {
            background: rgba(255,255,255,0.06);
            border-radius: 7px;
            margin: 2px;
        }
        .sql-tables-overview::-webkit-scrollbar-thumb {
            background: #6b7280;
            border-radius: 7px;
            border: 3px solid transparent;
            background-clip: padding-box;
            min-width: 40px;
            min-height: 40px;
        }
        .sql-tables-overview::-webkit-scrollbar-thumb:hover {
            background: var(--accent-color);
            background-clip: padding-box;
        }
        .sql-tables-overview::-webkit-scrollbar-corner { background: transparent; }

        .sql-db-table-wrapper {
            background: var(--panel-bg);
            border: 1px solid var(--border-color);
            border-radius: 6px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            height: 100%;
            min-height: 0;
            min-width: 0;
        }
        .sql-db-table-title {
            padding: 6px 12px;
            font-weight: 600;
            font-size: 0.85rem;
            background: rgba(0,0,0,0.1);
            border-bottom: 1px solid var(--border-color);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            transition: all 0.2s;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            flex-shrink: 0;
        }
        .sql-db-table-title > span { flex-shrink: 0; }

        /* ── Table scroll area — BOTH scrollbars always visible ── */
        .sql-db-table-scroll {
            overflow: scroll;
            overflow-x: scroll;
            overflow-y: scroll;
            flex: 1 1 auto;
            min-height: 0;
            scrollbar-gutter: stable both-edges;
            scrollbar-width: auto;
            scrollbar-color: #6b7280 rgba(255,255,255,0.06);
        }
        .sql-db-table-scroll::-webkit-scrollbar {
            width: 14px;
            height: 14px;
            -webkit-appearance: none;
            background: transparent;
        }
        .sql-db-table-scroll::-webkit-scrollbar-track {
            background: rgba(255,255,255,0.06);
            border-radius: 7px;
            margin: 2px;
        }
        .sql-db-table-scroll::-webkit-scrollbar-thumb {
            background: #6b7280;
            border-radius: 7px;
            border: 3px solid transparent;
            background-clip: padding-box;
            min-height: 30px;
            min-width: 30px;
        }
        .sql-db-table-scroll::-webkit-scrollbar-thumb:hover {
            background: var(--accent-color);
            background-clip: padding-box;
        }
        .sql-db-table-scroll::-webkit-scrollbar-thumb:active {
            background: var(--accent-color);
            background-clip: padding-box;
        }
        .sql-db-table-scroll::-webkit-scrollbar-corner {
            background: transparent;
        }

        /* ── Right panel ── */
        .sql-right-panel {
            display: none;
            flex-direction: column;
            height: 100%;
            gap: 16px;
        }
        .sql-right-panel.active { display: flex; }

        .sql-card {
            background-color: var(--panel-bg);
            border: 1px solid var(--border-color);
            border-radius: 6px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            flex-shrink: 0;
        }
        .sql-card-header {
            padding: 8px 12px;
            font-size: 0.85rem;
            font-weight: 600;
            border-bottom: 1px solid var(--border-color);
            background-color: rgba(0,0,0,0.1);
        }
        .sql-logs {
            height: 150px;
            overflow-y: auto;
            padding: 8px;
            font-family: monospace;
            font-size: 0.75rem;
            display: flex;
            flex-direction: column;
            gap: 4px;
            scrollbar-width: thin;
            scrollbar-color: #6b7280 transparent;
        }
        .sql-logs::-webkit-scrollbar { width: 10px; }
        .sql-logs::-webkit-scrollbar-thumb {
            background: #6b7280;
            border-radius: 5px;
        }
        .sql-log-entry { color: var(--text-color); opacity: 0.8; word-break: break-all; }
        .sql-log-entry.error { color: #ef4444; opacity: 1; }
        .sql-log-entry.success { color: #22c55e; opacity: 1; }

        /* ── Reference panel ── */
        .sql-reference {
            padding: 6px;
            overflow-y: auto;
            overflow-x: hidden;
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 1px;
            scrollbar-width: thin;
            scrollbar-color: #6b7280 transparent;
            position: relative;
            isolation: isolate;
        }
        .sql-reference::-webkit-scrollbar { width: 10px; }
        .sql-reference::-webkit-scrollbar-track { background: transparent; }
        .sql-reference::-webkit-scrollbar-thumb {
            background: #6b7280;
            border-radius: 5px;
        }
        .sql-reference::-webkit-scrollbar-thumb:hover { background: var(--accent-color); }

        .sql-ref-group {
            position: sticky;
            top: -6px;
            z-index: 5;
            margin: 0 -6px 4px -6px;
            padding: 6px 12px 4px 12px;
            background: var(--panel-bg);
            border-bottom: 1px solid var(--border-color);
            font-size: 0.65rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: var(--text-color);
            box-shadow: 0 4px 6px -6px rgba(0,0,0,0.6);
            pointer-events: none;
        }
        .sql-ref-group:first-child { top: 0; margin-top: 0; }
        .sql-ref-group .sql-ref-group-label { opacity: 0.5; pointer-events: auto; }

        .sql-ref-item {
            display: flex;
            flex-direction: column;
            padding: 3px 6px;
            background: transparent;
            border: 1px solid transparent;
            border-radius: 3px;
            cursor: pointer;
            transition: background 0.08s, border-color 0.08s;
            user-select: none;
            line-height: 1.2;
        }
        .sql-ref-item:hover {
            background: rgba(128,128,128,0.12);
            border-color: var(--accent-color);
        }
        .sql-ref-cmd {
            font-size: 0.72rem;
            font-family: 'Consolas','Monaco',monospace;
            color: var(--accent-color);
            font-weight: 600;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .sql-ref-desc {
            font-size: 0.65rem;
            color: var(--text-color);
            opacity: 0.55;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-top: 1px;
        }

        /* ── Modal inputs ── */
        .sql-b-input {
            padding: 6px;
            border: 1px solid var(--border-color);
            background: transparent;
            color: var(--text-color);
            border-radius: 4px;
            font-family: inherit;
            outline: none;
            width: 100%;
            box-sizing: border-box;
        }
    `;

    let injected = false;

    NS.installStyles = function () {
        if (injected) return;
        injected = true;

        // Remove any older-version style elements from previous hot reloads
        document.querySelectorAll('style[id^="sql-sandbox-styles"]').forEach(el => {
            if (el.id !== STYLE_ID) el.remove();
        });

        const el = document.createElement('style');
        el.id = STYLE_ID;
        el.textContent = STYLES;
        document.head.appendChild(el);
    };

})(window.SQLSandbox);