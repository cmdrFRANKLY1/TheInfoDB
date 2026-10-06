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

<<<<<<< HEAD
    const STYLE_ID = 'sql-sandbox-styles-v12';
=======
    const STYLE_ID = 'sql-sandbox-styles-v7';
>>>>>>> 4cda97e7e4f1cbbed3847076e5f376ab8f9eebb5

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

        /* ── Editor + Results side by side ── */
        .sql-editor-results-row {
            display: grid;
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
            gap: 12px;
            flex: 0 0 auto;
            min-height: 200px;
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
<<<<<<< HEAD
=======

        /* Plain textarea. The ghost layer shows ONLY the faded
           autocomplete suggestion — no syntax coloring. */
>>>>>>> 4cda97e7e4f1cbbed3847076e5f376ab8f9eebb5
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
            caret-color: var(--text-color);
            resize: none;
            outline: none;
            z-index: 2;
        }
<<<<<<< HEAD
=======

        /* Only the autocomplete remainder gets styled */
>>>>>>> 4cda97e7e4f1cbbed3847076e5f376ab8f9eebb5
        .sql-ghost-suggest {
            color: var(--text-color);
            opacity: 0.35;
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

<<<<<<< HEAD
        /* Icon-only secondary buttons (Undo / Redo) */
        .sql-icon-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 4px;
            width: 28px;
            height: 28px;
            line-height: 0;
        }
        .sql-icon-btn svg {
            display: block;
            width: 16px;
            height: 16px;
            color: currentColor;
        }
        .sql-icon-btn:hover:not(:disabled) svg {
            color: var(--accent-color);
        }
        .sql-icon-btn:disabled svg {
            opacity: 0.4;
        }

        /* ── Highlighting ── */
=======
        /* ── Table cell highlighting (Live DB State only) ── */
>>>>>>> 4cda97e7e4f1cbbed3847076e5f376ab8f9eebb5
        .sql-highlight {
            background-color: color-mix(in srgb, var(--hi-color) 20%, transparent) !important;
            color: var(--hi-color) !important;
        }
        .sql-db-table-title.sql-highlight {
            background-color: color-mix(in srgb, var(--hi-color) 25%, transparent) !important;
            border-bottom: 1px solid var(--hi-color) !important;
        }

        /* ── Results pane ── */
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

<<<<<<< HEAD
        /* ── Tables ── */
=======
        /* ── Tables (single-line, auto-width, no truncation, no sticky) ── */
>>>>>>> 4cda97e7e4f1cbbed3847076e5f376ab8f9eebb5
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

<<<<<<< HEAD
        /* ── Live DB state — flex row of table cards ──
           - 1 card: fills the row (flex: 1 1 auto).
           - N cards: each sits at content width, row scrolls horizontally. */
        .sql-tables-overview {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            align-items: flex-start;
            justify-content: flex-start;
            gap: 12px;
            overflow-x: auto;
            overflow-y: auto;
            contain: content;
            flex: 1 1 auto;
            min-height: 240px;
            min-width: 0;
=======
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
>>>>>>> 4cda97e7e4f1cbbed3847076e5f376ab8f9eebb5
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

<<<<<<< HEAD
        /* Cards: shrink to content width but never less than 240px.
           The sole-child case is handled by :only-child below. */
=======
>>>>>>> 4cda97e7e4f1cbbed3847076e5f376ab8f9eebb5
        .sql-db-table-wrapper {
            background: var(--panel-bg);
            border: 1px solid var(--border-color);
            border-radius: 6px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
<<<<<<< HEAD
            flex: 0 0 auto;
            min-width: 240px;
            max-width: none;
            max-height: 380px;
            align-self: flex-start;
        }

        /* Single-table case: the sole card stretches to fill the row. */
        .sql-tables-overview > .sql-db-table-wrapper:only-child {
            flex: 1 1 auto;
            min-width: 0;
            align-self: stretch;
        }

=======
            height: 100%;
            min-height: 0;
            min-width: 0;
        }
>>>>>>> 4cda97e7e4f1cbbed3847076e5f376ab8f9eebb5
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

<<<<<<< HEAD
        /* ── Table body ── */
        .sql-db-table-scroll {
            overflow: auto;
            overflow-x: auto;
            overflow-y: auto;
            flex: 1 1 auto;
            min-height: 0;
            max-height: 320px;
=======
        /* ── Table scroll area — BOTH scrollbars always visible ── */
        .sql-db-table-scroll {
            overflow: scroll;
            overflow-x: scroll;
            overflow-y: scroll;
            flex: 1 1 auto;
            min-height: 0;
            scrollbar-gutter: stable both-edges;
>>>>>>> 4cda97e7e4f1cbbed3847076e5f376ab8f9eebb5
            scrollbar-width: auto;
            scrollbar-color: #6b7280 rgba(255,255,255,0.06);
        }
        .sql-db-table-scroll::-webkit-scrollbar {
<<<<<<< HEAD
            width: 12px;
            height: 12px;
            background: transparent;
        }
        .sql-db-table-scroll::-webkit-scrollbar-track {
            background: rgba(255,255,255,0.04);
            border-radius: 6px;
=======
            width: 14px;
            height: 14px;
            -webkit-appearance: none;
            background: transparent;
        }
        .sql-db-table-scroll::-webkit-scrollbar-track {
            background: rgba(255,255,255,0.06);
            border-radius: 7px;
>>>>>>> 4cda97e7e4f1cbbed3847076e5f376ab8f9eebb5
            margin: 2px;
        }
        .sql-db-table-scroll::-webkit-scrollbar-thumb {
            background: #6b7280;
<<<<<<< HEAD
            border-radius: 6px;
=======
            border-radius: 7px;
>>>>>>> 4cda97e7e4f1cbbed3847076e5f376ab8f9eebb5
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
<<<<<<< HEAD

        /* ──────────────────────────────────────────────────────────
           Speedrun panel — compact
           ────────────────────────────────────────────────────────── */
        .sql-quest-banner {
            border: 1px solid var(--border-color);
            border-radius: 6px;
            background: var(--panel-bg);
            padding: 8px 12px;
            display: none;
            flex-direction: column;
            gap: 6px;
            flex-shrink: 0;
            font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto,
                         'Helvetica Neue', Arial, sans-serif;
            font-size: 0.82rem;
            line-height: 1.45;
            color: var(--text-color);
            letter-spacing: -0.005em;
        }
        .sql-quest-banner.active { display: flex; }

        .sql-quest-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
        }
        .sql-quest-title {
            display: inline-flex;
            align-items: baseline;
            gap: 8px;
            font-size: 0.88rem;
            font-weight: 600;
            letter-spacing: -0.01em;
            color: var(--text-color);
            flex: 1 1 auto;
        }
        .sql-quest-stage-tag {
            font-size: 0.65rem;
            font-weight: 600;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            color: var(--text-color);
            opacity: 0.55;
        }

        .sql-quest-diff {
            display: inline-flex;
            align-items: center;
            gap: 0;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            overflow: hidden;
            flex: 0 0 auto;
        }
        .sql-quest-diff-label {
            font-size: 0.65rem;
            opacity: 0.5;
            padding: 2px 7px 2px 9px;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            font-weight: 600;
            border-right: 1px solid var(--border-color);
        }
        .sql-quest-diff-btn {
            background: transparent;
            border: none;
            color: var(--text-color);
            font-family: inherit;
            font-size: 0.72rem;
            font-weight: 500;
            padding: 2px 9px;
            cursor: pointer;
            opacity: 0.55;
            border-right: 1px solid var(--border-color);
            transition: background 0.1s, opacity 0.1s, color 0.1s;
        }
        .sql-quest-diff-btn:last-child { border-right: none; }
        .sql-quest-diff-btn:hover:not(.active) {
            background: rgba(128,128,128,0.1);
            opacity: 0.85;
        }
        .sql-quest-diff-btn.active {
            background: var(--accent-color);
            color: #ffffff;
            opacity: 1;
            font-weight: 600;
        }

        .sql-quest-timer {
            font-size: 0.85rem;
            font-weight: 600;
            font-variant-numeric: tabular-nums;
            letter-spacing: 0.01em;
            color: var(--text-color);
            opacity: 0.9;
            padding: 1px 7px;
            border-radius: 4px;
            background: rgba(0,0,0,0.2);
            flex: 0 0 auto;
        }
        :root.theme-light .sql-quest-timer {
            background: rgba(0,0,0,0.05);
        }
        .sql-quest-timer.stopped {
            color: #22c55e;
            opacity: 1;
        }

        .sql-quest-progress {
            display: flex;
            align-items: center;
            gap: 5px;
            flex-wrap: wrap;
            font-size: 0.7rem;
            font-weight: 500;
            letter-spacing: 0.02em;
            user-select: none;
            min-height: 0;
        }
        .sql-quest-step {
            color: var(--text-color);
            opacity: 0.4;
            transition: opacity 0.1s, color 0.1s;
        }
        .sql-quest-step.done { opacity: 0.75; }
        .sql-quest-step.current {
            color: var(--accent-color);
            opacity: 1;
            font-weight: 600;
        }
        .sql-quest-arrow {
            opacity: 0.25;
            font-size: 0.7rem;
        }

        .sql-quest-desc {
            font-size: 0.78rem;
            line-height: 1.5;
            color: var(--text-color);
            opacity: 0.85;
        }
        .sql-quest-desc b { font-weight: 600; opacity: 1; }
        .sql-quest-desc code {
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            font-size: 0.85em;
            padding: 1px 5px;
            border-radius: 3px;
            background: rgba(128,128,128,0.12);
        }

        .sql-quest-status {
            font-size: 0.75rem;
            line-height: 1.45;
            padding: 5px 10px;
            border-radius: 4px;
            border-left: 3px solid transparent;
            background: rgba(128,128,128,0.06);
            display: none;
            color: var(--text-color);
        }
        .sql-quest-status.show { display: block; }
        .sql-quest-status.ok {
            border-left-color: #22c55e;
            background: rgba(34,197,94,0.08);
        }
        .sql-quest-status.err {
            border-left-color: #ef4444;
            background: rgba(239,68,68,0.08);
        }
        .sql-quest-status.info {
            border-left-color: var(--accent-color);
            background: color-mix(in srgb, var(--accent-color) 8%, transparent);
        }
        .sql-quest-status ul {
            margin: 3px 0 0 16px;
            padding: 0;
        }
        .sql-quest-status li { margin: 1px 0; }

        .sql-quest-actions {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
            align-items: center;
        }
        .sql-quest-btn {
            background: transparent;
            border: 1px solid var(--border-color);
            color: var(--text-color);
            padding: 3px 10px;
            border-radius: 4px;
            font-family: inherit;
            font-size: 0.76rem;
            font-weight: 500;
            letter-spacing: -0.005em;
            cursor: pointer;
            transition: background 0.1s, border-color 0.1s;
        }
        .sql-quest-btn:hover:not(:disabled) {
            background: rgba(128,128,128,0.1);
            border-color: var(--accent-color);
        }
        .sql-quest-btn:disabled {
            opacity: 0.35;
            cursor: not-allowed;
        }
        .sql-quest-btn.primary {
            background: var(--accent-color);
            border-color: var(--accent-color);
            color: #ffffff;
        }
        .sql-quest-btn.primary:hover:not(:disabled) {
            opacity: 0.9;
            background: var(--accent-color);
        }
        .sql-quest-btn.warn {
            border-color: rgba(239,68,68,0.5);
            color: #ef4444;
        }
        .sql-quest-btn.warn:hover:not(:disabled) {
            background: rgba(239,68,68,0.1);
            border-color: #ef4444;
        }

        .sql-quest-best {
            font-size: 0.7rem;
            opacity: 0.55;
            margin-left: auto;
        }
        .sql-quest-best strong {
            color: #22c55e;
            opacity: 0.9;
            font-weight: 600;
            font-variant-numeric: tabular-nums;
        }

        /* ── Hint modal ── */
        .sql-quest-modal-backdrop {
            position: absolute;
            inset: 0;
            background: rgba(0,0,0,0.6);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            border-radius: inherit;
        }
        .sql-quest-modal-backdrop.show { display: flex; }
        .sql-quest-modal {
            background: var(--panel-bg);
            border: 1px solid var(--border-color);
            border-radius: 6px;
            width: min(620px, 92%);
            max-height: 80%;
            display: flex;
            flex-direction: column;
            box-shadow: 0 20px 40px rgba(0,0,0,0.4);
            font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto,
                         'Helvetica Neue', Arial, sans-serif;
            font-size: 0.85rem;
            letter-spacing: -0.005em;
        }
        .sql-quest-modal-head {
            padding: 10px 14px;
            font-weight: 600;
            font-size: 0.88rem;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .sql-quest-modal-body {
            padding: 12px 14px;
            overflow-y: auto;
            font-size: 0.82rem;
            line-height: 1.55;
        }
        .sql-quest-modal-body h3 {
            font-size: 0.7rem;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            opacity: 0.55;
            margin: 14px 0 5px 0;
            font-weight: 700;
        }
        .sql-quest-modal-body h3:first-child { margin-top: 0; }
        .sql-quest-modal-body p { margin: 0.5em 0; }
        .sql-quest-modal-body ul,
        .sql-quest-modal-body ol { margin: 0.5em 0 0.5em 1.3em; }
        .sql-quest-modal-body li { margin: 0.3em 0; }
        .sql-quest-modal-body code {
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            font-size: 0.85em;
            padding: 1px 5px;
            border-radius: 3px;
            background: rgba(128,128,128,0.12);
        }
        .sql-quest-modal-body pre {
            background: rgba(0,0,0,0.25);
            border: 1px solid var(--border-color);
            border-radius: 5px;
            padding: 10px 12px;
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            font-size: 0.74rem;
            line-height: 1.5;
            overflow-x: auto;
            margin: 8px 0;
            white-space: pre;
            max-height: 240px;
        }
        :root.theme-light .sql-quest-modal-body pre {
            background: rgba(0,0,0,0.04);
        }
        .sql-quest-modal-body pre .kw { color: var(--accent-color); font-weight: 600; }
        .sql-quest-modal-body pre .str { color: #10b981; }
        .sql-quest-modal-body pre .num { color: #f59e0b; }
        .sql-quest-modal-body pre .cm { opacity: 0.5; font-style: italic; }
=======
>>>>>>> 4cda97e7e4f1cbbed3847076e5f376ab8f9eebb5
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