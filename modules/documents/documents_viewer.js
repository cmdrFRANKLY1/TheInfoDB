(function () {
'use strict';

// =========================================================================
// STEP 1: CAPTURE THE ORDER INDEX SYNCHRONOUSLY
// =========================================================================
// We grab this value at the very top level before any potential async behavior.
const currentScript = document.currentScript;
const moduleOrderIndex = currentScript && currentScript.dataset.moduleOrder !== undefined
    ? parseInt(currentScript.dataset.moduleOrder, 10) : null;

// Guard against double-load
if (window.DocumentViewer && window.DocumentViewer.__booted) {
    console.warn('[Documents] Already booted — skipping duplicate load.');
    return;
}

const api = window.theInfoDB;

const THIS_SRC = (currentScript && currentScript.src) || '';
// Hardcode the path relative to index.html so Vercel routing can't confuse it
const BASE_DIR = 'modules/documents/';

const REGISTRY_FILE = 'registryForDocuments.json';
const HISTORY_KEY = 'doc-viewer-history-v1';
const HISTORY_MAX = 50;

const ROOT_URL = (function () {
    try { return new URL('/', window.location.href).href; }
    catch (_) { return '/'; }
})();

const STYLE_ID = 'doc-viewer-styles-v18';

const STYLES = `
    /* ── Font stack ── */
    .doc-view-container,
    .doc-side-panel {
        font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto,
                     'Helvetica Neue', Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
    }
    .doc-view-main {
        font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto,
                     'Helvetica Neue', Arial, sans-serif;
        font-size: 1.02rem;
        line-height: 1.72;
        letter-spacing: -0.005em;
    }

    /* ── Sidebar entry — icon + label on one line ── */
   .doc-sidebar-entry {
        display: flex !important;
        align-items: center;
        justify-content: flex-start !important;  /* override settings-row space-between */
        gap: 10px;
    }
    .doc-sidebar-entry svg {
        display: block;
        width: 16px;
        height: 16px;
        color: currentColor;
        flex-shrink: 0;
        opacity: 0.85;
    }
    .doc-sidebar-entry:hover svg {
        opacity: 1;
        color: var(--accent-color);
    }
` +
`
    /* ── Positioning context for the absolute overlay ── */
    #content-area {
        position: relative;
    }

    /* ── Top-level container ── */
    .doc-view-container {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        width: auto;
        height: auto;
        margin: 0;
        padding: 0;
        overflow: hidden;
    }

    /* ── Grid ── */
    .doc-view-body {
        display: grid;
        grid-template-columns: 260px minmax(0, 1fr);
        grid-template-rows: 100%;
        gap: 0;
        flex: 1 1 auto;
        min-height: 0;
        height: 100%;
        width: 100%;
        overflow: hidden;
    }

    /* ── Left column: LOCKED at 260px, scrolls internally ── */
    .doc-toc {
        border: none;
        border-right: 1px solid var(--border-color);
        border-radius: 0;
        background: var(--panel-bg);
        display: flex;
        flex-direction: column;
        min-width: 260px;
        max-width: 260px;
        min-height: 0;
        height: 100%;
        overflow: hidden;
        padding: 0;
        gap: 0;
    }
    .doc-toc-search {
        flex: 0 0 auto;
        margin: 6px 6px 4px 6px;
        padding: 5px 9px;
        border: 1px solid var(--border-color);
        background: transparent;
        color: var(--text-color);
        border-radius: 4px;
        font-family: inherit;
        font-size: 0.8rem;
        outline: none;
        box-sizing: border-box;
        width: calc(100% - 12px);
    }
` +
`
    .doc-toc-search::placeholder { opacity: 0.4; }
    .doc-toc-search:focus { border-color: var(--accent-color); }

    .doc-toc-tree {
        flex: 1 1 auto;
        min-height: 0;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 2px 4px 6px 4px;
        scrollbar-width: thin;
        scrollbar-color: #6b7280 transparent;
    }
    .doc-toc-tree::-webkit-scrollbar { width: 8px; }
    .doc-toc-tree::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); }
    .doc-toc-tree::-webkit-scrollbar-thumb {
        background: #6b7280;
        border-radius: 4px;
        border: 2px solid transparent;
        background-clip: padding-box;
    }
    .doc-toc-tree::-webkit-scrollbar-thumb:hover {
        background: var(--accent-color);
        background-clip: padding-box;
    }

    .doc-toc-node { display: flex; flex-direction: column; gap: 0; }
    .doc-toc-node-head {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 3px 6px;
        border-radius: 3px;
        cursor: pointer;
        user-select: none;
        font-size: 0.7rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--text-color);
        opacity: 0.75;
        line-height: 1.2;
        min-height: 20px;
        flex: 0 0 auto;
        white-space: nowrap;
    }
    .doc-toc-node-head:hover { background: rgba(128,128,128,0.1); opacity: 1; }
    .doc-toc-node.collapsed > .doc-toc-node-head .doc-toc-caret { transform: rotate(-90deg); }
    .doc-toc-caret {
        display: inline-block;
        width: 10px;
        font-size: 0.7rem;
        text-align: center;
        transition: transform 0.12s;
        transform-origin: center;
        flex-shrink: 0;
        opacity: 0.6;
    }
` +
`
    .doc-toc-node-count {
        margin-left: auto;
        font-size: 0.62rem;
        opacity: 0.5;
        font-weight: 500;
        flex-shrink: 0;
    }
    .doc-toc-node-children {
        display: flex;
        flex-direction: column;
        gap: 0;
        padding-left: 6px;
        margin-left: 8px;
        border-left: 1px solid var(--border-color);
    }
    .doc-toc-node.collapsed > .doc-toc-node-children { display: none; }

    .doc-toc-item {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 3px 8px;
        border-radius: 3px;
        cursor: pointer;
        color: var(--text-color);
        text-decoration: none;
        border: 1px solid transparent;
        transition: background 0.06s, border-color 0.06s;
        font-size: 0.82rem;
        line-height: 1.3;
        min-height: 22px;
        white-space: nowrap;
        flex: 0 0 auto;
    }
    .doc-toc-item:hover {
        background: rgba(128,128,128,0.12);
        border-color: var(--border-color);
    }
    .doc-toc-item.active {
        background: color-mix(in srgb, var(--accent-color) 20%, transparent);
        border-color: var(--accent-color);
    }
    .doc-toc-item.active .doc-toc-item-title {
        color: var(--accent-color);
        font-weight: 600;
    }
    .doc-toc-item-title {
        flex: 1 1 auto;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    /* ── Document view ── */
    .doc-view-main {
        border: none;
        border-radius: 0;
        background: var(--panel-bg);
        overflow: auto;
        padding: 28px 40px 40px 40px;
        min-width: 0;
        min-height: 0;
        height: 100%;
        scrollbar-width: thin;
        scrollbar-color: #6b7280 transparent;
        color: var(--text-color);
        scroll-behavior: smooth;
        box-sizing: border-box;
    }
` +
`
    .doc-view-main::-webkit-scrollbar { width: 12px; height: 12px; }
    .doc-view-main::-webkit-scrollbar-track { background: rgba(255,255,255,0.04); }
    .doc-view-main::-webkit-scrollbar-thumb {
        background: #6b7280;
        border-radius: 6px;
        border: 3px solid transparent;
        background-clip: padding-box;
    }
    .doc-view-main::-webkit-scrollbar-thumb:hover {
        background: var(--accent-color);
        background-clip: padding-box;
    }

    .doc-view-main h1,
    .doc-view-main h2,
    .doc-view-main h3,
    .doc-view-main h4,
    .doc-view-main h5,
    .doc-view-main h6 {
        margin-top: 1.5em;
        margin-bottom: 0.55em;
        letter-spacing: -0.015em;
        line-height: 1.22;
        scroll-margin-top: 12px;
    }
    .doc-view-main h1 { font-size: 1.9rem; font-weight: 700; border-bottom: 1px solid var(--border-color); padding-bottom: 0.35em; }
    .doc-view-main h2 { font-size: 1.4rem; font-weight: 700; }
    .doc-view-main h3 { font-size: 1.14rem; font-weight: 600; }
    .doc-view-main p { margin: 0.75em 0; }
    .doc-view-main ul,
    .doc-view-main ol { margin: 0.75em 0 0.75em 1.5em; }
    .doc-view-main li { margin: 0.3em 0; }
    .doc-view-main a { color: var(--accent-color); text-decoration: none; }
    .doc-view-main a:hover { text-decoration: underline; }
    .doc-view-main code {
        font-family: 'JetBrains Mono', 'Consolas', 'Monaco', 'Courier New', monospace;
        background: rgba(128,128,128,0.15);
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 0.9em;
    }
` +
`
    .doc-view-main pre {
        background: rgba(0,0,0,0.35);
        border: 1px solid var(--border-color);
        border-radius: 5px;
        padding: 14px 16px;
        overflow-x: auto;
        font-family: 'JetBrains Mono', 'Consolas', 'Monaco', 'Courier New', monospace;
        font-size: 0.88rem;
        line-height: 1.55;
        margin: 1em 0;
    }
    .doc-view-main pre code { background: transparent; padding: 0; }
    .doc-view-main blockquote {
        margin: 1em 0;
        padding: 0.6em 1.1em;
        border-left: 3px solid var(--accent-color);
        background: rgba(128,128,128,0.08);
        border-radius: 0 4px 4px 0;
    }
    .doc-view-main hr { border: none; border-top: 1px solid var(--border-color); margin: 1.6em 0; }
    .doc-view-main table { border-collapse: collapse; margin: 1em 0; font-size: 0.95rem; }
    .doc-view-main table th,
    .doc-view-main table td {
        padding: 8px 14px;
        border: 1px solid var(--border-color);
        text-align: left;
    }
    .doc-view-main table th { background: rgba(0,0,0,0.2); font-weight: 600; }
    .doc-view-main .doc-plain {
        font-family: 'JetBrains Mono', 'Consolas', 'Monaco', 'Courier New', monospace;
        font-size: 0.92rem;
        white-space: pre-wrap;
        word-wrap: break-word;
        line-height: 1.6;
        margin: 0;
    }
    .doc-view-main .doc-gloss-plain {
        color: var(--accent-color);
        border-bottom: 1px dotted var(--accent-color);
        cursor: help;
    }

    .doc-meta {
        border-bottom: 1px solid var(--border-color);
        padding-bottom: 14px;
        margin-bottom: 22px;
    }
    .doc-meta-title {
        font-size: 1.75rem;
        font-weight: 700;
        margin: 0 0 6px 0;
        letter-spacing: -0.02em;
    }
` +
`
    .doc-meta-row {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        align-items: center;
        font-size: 0.78rem;
        opacity: 0.8;
        margin-top: 4px;
    }
    .doc-meta-category {
        padding: 2px 9px;
        border-radius: 3px;
        background: color-mix(in srgb, var(--accent-color) 20%, transparent);
        color: var(--accent-color);
        font-weight: 600;
        font-family: 'JetBrains Mono', 'Consolas', monospace;
        font-size: 0.72rem;
    }
    .doc-meta-tag {
        padding: 2px 9px;
        border-radius: 3px;
        font-family: 'JetBrains Mono', 'Consolas', monospace;
        font-size: 0.72rem;
        font-weight: 600;
        border: 1px solid;
    }

    .doc-related {
        margin: 0 0 22px 0;
        padding: 12px 16px;
        border: 1px solid var(--border-color);
        border-radius: 6px;
        background: rgba(128,128,128,0.05);
    }
    .doc-related-title {
        font-size: 0.72rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.09em;
        opacity: 0.65;
        margin-bottom: 8px;
    }
    .doc-related-list {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
    }
    .doc-related-link {
        display: inline-block;
        padding: 5px 11px;
        border-radius: 4px;
        background: rgba(128,128,128,0.1);
        border: 1px solid var(--border-color);
        color: var(--accent-color);
        text-decoration: none;
        font-size: 0.82rem;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.08s, border-color 0.08s;
    }
    .doc-related-link:hover {
        background: color-mix(in srgb, var(--accent-color) 15%, transparent);
        border-color: var(--accent-color);
    }
    .doc-related-link::before { content: '→ '; opacity: 0.5; }
    .doc-related-shared {
        opacity: 0.5;
        font-size: 0.66rem;
        margin-left: 7px;
        font-weight: 400;
    }
` +
`
    .doc-gloss {
        border-bottom: 1px dotted currentColor;
        cursor: help;
    }
    .doc-gloss:hover {
        background: color-mix(in srgb, var(--accent-color) 12%, transparent);
    }

    .doc-empty {
        text-align: center;
        padding: 48px 24px;
        opacity: 0.55;
        font-size: 0.95rem;
    }
    .doc-error {
        padding: 20px;
        border: 1px solid #ef4444;
        background: rgba(239,68,68,0.08);
        border-radius: 6px;
        color: #ef4444;
        font-size: 0.9rem;
    }
    .doc-download-btn {
        display: inline-block;
        margin-top: 12px;
        padding: 8px 16px;
        background: var(--accent-color);
        color: #fff;
        text-decoration: none;
        border-radius: 4px;
        font-size: 0.85rem;
        font-weight: 500;
    }
    .doc-download-btn:hover { opacity: 0.9; }

    /* ── Right panel ── */
    .doc-side-panel {
        display: none;
        flex-direction: column;
        height: 100%;
        gap: 8px;
        min-height: 0;
        box-sizing: border-box;
    }
    .doc-side-panel.active { display: flex; }

    .doc-side-card {
        background-color: var(--panel-bg);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        flex: 1 1 0;
        min-height: 120px;
        box-sizing: border-box;
    }
    .doc-side-header {
        padding: 7px 12px;
        font-size: 0.82rem;
        font-weight: 600;
        border-bottom: 1px solid var(--border-color);
        background-color: rgba(0,0,0,0.1);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 6px;
    }
    .doc-side-body {
        padding: 6px;
        overflow-y: auto;
        overflow-x: hidden;
        flex: 1 1 auto;
        min-height: 0;
        display: flex;
        flex-direction: column;
        gap: 0;
        scrollbar-width: thin;
        scrollbar-color: #6b7280 transparent;
    }
    .doc-side-body::-webkit-scrollbar { width: 8px; }
    .doc-side-body::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); }
    .doc-side-body::-webkit-scrollbar-thumb {
        background: #6b7280;
        border-radius: 4px;
        border: 2px solid transparent;
        background-clip: padding-box;
    }
    .doc-side-body::-webkit-scrollbar-thumb:hover {
        background: var(--accent-color);
        background-clip: padding-box;
    }

    .doc-outline-item {
        display: block;
        padding: 4px 8px;
        border-radius: 3px;
        cursor: pointer;
        color: var(--text-color);
        font-size: 0.82rem;
        line-height: 1.35;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        border-left: 2px solid transparent;
        transition: background 0.06s, border-color 0.06s;
        flex-shrink: 0;
    }
    .doc-outline-item:hover { background: rgba(128,128,128,0.1); }
    .doc-outline-item.level-1 { font-weight: 600; margin-top: 5px; }
    .doc-outline-item.level-2 {
        padding-left: 22px;
        font-size: 0.76rem;
        opacity: 0.85;
    }
    .doc-outline-item.active {
        background: color-mix(in srgb, var(--accent-color) 15%, transparent);
        border-left-color: var(--accent-color);
        color: var(--accent-color);
    }

    .doc-history-item {
        display: grid;
        grid-template-columns: 14px minmax(0, 1fr) auto;
        align-items: center;
        column-gap: 6px;
        padding: 4px 8px;
        border-radius: 3px;
        cursor: pointer;
        color: var(--text-color);
        font-size: 0.78rem;
        line-height: 1.25;
        border: 1px solid transparent;
        transition: background 0.06s, border-color 0.06s;
        flex-shrink: 0;
    }
    .doc-history-item:hover {
        background: rgba(128,128,128,0.1);
        border-color: var(--border-color);
    }
    .doc-history-item.active {
        background: color-mix(in srgb, var(--accent-color) 15%, transparent);
        border-color: var(--accent-color);
    }
    .doc-history-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--border-color);
        justify-self: center;
    }
    .doc-history-item.active .doc-history-dot {
        background: var(--accent-color);
    }
    .doc-history-main {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 0;
    }
    .doc-history-title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: 500;
    }
    .doc-history-item.active .doc-history-title {
        color: var(--accent-color);
        font-weight: 600;
    }
    .doc-history-cat {
        font-size: 0.62rem;
        opacity: 0.5;
        font-family: 'JetBrains Mono', 'Consolas', monospace;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .doc-history-meta {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 1px;
        flex-shrink: 0;
    }
    .doc-history-time {
        font-size: 0.62rem;
        opacity: 0.6;
        font-family: 'JetBrains Mono', 'Consolas', monospace;
    }
    .doc-history-date {
        font-size: 0.58rem;
        opacity: 0.35;
        font-family: 'JetBrains Mono', 'Consolas', monospace;
    }

    .doc-side-empty {
        padding: 20px 12px;
        text-align: center;
        opacity: 0.5;
        font-size: 0.78rem;
    }
    .doc-side-clear {
        background: transparent;
        border: 1px solid var(--border-color);
        color: var(--text-color);
        border-radius: 3px;
        font-size: 0.65rem;
        padding: 1px 6px;
        cursor: pointer;
        opacity: 0.6;
        font-family: inherit;
    }
    .doc-side-clear:hover {
        opacity: 1;
        border-color: var(--accent-color);
        color: var(--accent-color);
    }
`;

function installStyles() {
    document.querySelectorAll('style[id^="doc-viewer-styles"]').forEach(el => {
        if (el.id !== STYLE_ID) el.remove();
    });
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement('style');
    el.id = STYLE_ID;
    el.textContent = STYLES;
    document.head.appendChild(el);
}

function escapeHTML(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function escapeAttr(s) {
    return escapeHTML(s).replace(/"/g, '&quot;');
}
function formatTime(ts) {
    const d = new Date(ts);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return hh + ':' + mm;
}
function formatDate(ts) {
    const d = new Date(ts);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return 'today';
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return 'yday';
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return mm + '/' + dd;
}
function splitWords(s) {
    return String(s)
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
        .replace(/[-_]+/g, ' ')
        .trim();
}
function titleCase(s) {
    return splitWords(s).split(/\s+/).filter(Boolean)
        .map(w => /^[A-Z0-9]{2,}$/.test(w) ? w
            : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
}

function categoryFromPath(path) {
    const parts = String(path || '').replace(/^\//, '').split('/').filter(Boolean);
    if (parts[0] && parts[0].toLowerCase() === 'pages') parts.shift();
    parts.pop();
    if (parts.length === 0) return 'Uncategorized';
    return parts.map(titleCase).join(' / ');
}
function titleFromPath(path) {
    const name = fileName(path).replace(/\.[^.]+$/, '');
    return titleCase(name);
}
function fileName(path) {
    return String(path || '').split('/').pop() || path;
}

function tagColor(tag) {
    const s = String(tag || '').toLowerCase();
    let h = 2166136261 >>> 0;
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619) >>> 0;
    }
    const hue = h % 360;
    return {
        fg: 'hsl(' + hue + ', 72%, 62%)',
        bg: 'hsla(' + hue + ', 72%, 62%, 0.14)',
        bd: 'hsla(' + hue + ', 72%, 62%, 0.45)'
    };
}
function tagChipHTML(tag) {
    const c = tagColor(tag);
    return '<span class="doc-meta-tag" style="color:' + c.fg +
           ';background:' + c.bg + ';border-color:' + c.bd + '">' +
           escapeHTML(tag) + '</span>';
}

function resolveRootPath(rel) {
    rel = String(rel || '');
    
    // 1. Allow external URLs
    if (/^(https?:|data:|blob:|mailto:|tel:)/.test(rel)) return rel;
    
    // 2. Block malicious directory traversal
    if (/(^|\/)\.\.(\/|$)/.test(rel)) {
        console.warn('[Documents] Rejected path with "..":', rel);
        return '__blocked__';
    }
    
    // 3. Strip leading slashes or dots
    rel = rel.replace(/^(\.\/|\/)/, '');
    
    // 4. Build an absolute URL dynamically based on current Vercel path
    let basePath = window.location.pathname;
    
    // If the path ends in a file (like index.html), strip it to get the directory
    if (basePath.match(/\/[^\/]+\.[^\/]+$/)) {
        basePath = basePath.substring(0, basePath.lastIndexOf('/'));
    }
    
    // Ensure trailing slash
    if (!basePath.endsWith('/')) basePath += '/';
    
    return window.location.origin + basePath + rel;
}

function inferType(path) {
    const clean = String(path || '').split(/[?#]/)[0];
    const ext = clean.substring(clean.lastIndexOf('.') + 1).toLowerCase();
    switch (ext) {
        case 'md': case 'markdown': return 'markdown';
        case 'txt': case 'log': case 'conf': case 'cfg':
        case 'ini': case 'yaml': case 'yml': case 'xml': return 'text';
        case 'json': return 'json';
        case 'html': case 'htm': return 'html';
        case 'pdf': return 'pdf';
        case 'csv': return 'csv';
        case 'xlsx': case 'xls': return 'xlsx';
        case 'docx': case 'doc': return 'docx';
        default: return 'text';
    }
}
function slugify(s) {
    return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
function firstH1(body) {
    const lines = String(body || '').replace(/\r\n?/g, '\n').split('\n');
    let inCode = false;
    for (const line of lines) {
        if (/^```/.test(line.trim())) { inCode = !inCode; continue; }
        if (inCode) continue;
        const m = line.match(/^#\s+(.*)$/);
        if (m && m[1].trim()) return m[1].trim();
    }
    return null;
}

function parseFrontMatter(raw) {
    const result = { title: null, tags: [], links: [], gloss: {}, body: raw || '' };
    if (!raw) return result;

    const lines = raw.replace(/\r\n?/g, '\n').split('\n');
    const sectionDefs = [
        { key: 'title',      rx: /^\s*#\s*title\s*$/i },
        { key: 'tags',       rx: /^\s*#\s*tags\s*$/i },
        { key: 'hyperlinks', rx: /^\s*#\s*hyperlinks?\s*$/i },
        { key: 'mouseover',  rx: /^\s*#\s*mouse\s*over\s*$/i }
    ];
    const found = {};
    for (let i = 0; i < lines.length; i++) {
        for (const def of sectionDefs) {
            if (def.rx.test(lines[i])) {
                if (found[def.key] === undefined) found[def.key] = i;
            }
        }
    }
    if (Object.keys(found).length === 0) return result;

    const firstSpecialIdx = Math.min(...Object.values(found));
    let bodyEnd = firstSpecialIdx;
    while (bodyEnd > 0 && lines[bodyEnd - 1].trim() === '') bodyEnd--;
    if (bodyEnd > 0 && /^\s*-{3,}\s*$/.test(lines[bodyEnd - 1])) {
        bodyEnd--;
        while (bodyEnd > 0 && lines[bodyEnd - 1].trim() === '') bodyEnd--;
    }
    result.body = lines.slice(0, bodyEnd).join('\n').replace(/\s+$/, '');

    const sectionOrder = Object.entries(found).sort((a, b) => a[1] - b[1]);
    for (let s = 0; s < sectionOrder.length; s++) {
        const [key, startLine] = sectionOrder[s];
        const endLine = s + 1 < sectionOrder.length ? sectionOrder[s + 1][1] : lines.length;
        const sectionLines = lines.slice(startLine + 1, endLine);

        switch (key) {
            case 'title':      parseTitleSection(sectionLines, result); break;
            case 'tags':       parseTagsSection(sectionLines, result); break;
            case 'hyperlinks': parseLinkTableSection(sectionLines, result, 'links'); break;
            case 'mouseover':  parseLinkTableSection(sectionLines, result, 'gloss'); break;
        }
    }
    return result;
}

function parseTitleSection(lines, result) {
    for (const raw of lines) {
        const line = raw.trim();
        if (!line) continue;
        result.title = line.replace(/^[#*_\s]+|[#*_\s]+$/g, '').trim();
        return;
    }
}
function parseTagsSection(lines, result) {
    for (const raw of lines) {
        const line = raw.trim();
        if (!line) continue;
        let m = line.match(/^[-*+]\s+(.+)$/);
        let tag = m ? m[1].trim() : line;
        tag = tag.replace(/[;,]$/, '').trim();
        if (tag) result.tags.push(tag);
    }
}
function parsePipeTable(lines) {
    const rows = [];
    let sawSeparator = false;
    for (const raw of lines) {
        const line = raw.trim();
        if (!line || !line.includes('|')) continue;
        const cells = line.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map(c => c.trim());
        const isSeparator = cells.every(c => /^:?-{2,}:?$/.test(c));
        if (isSeparator) { sawSeparator = true; continue; }
        rows.push(cells);
    }
    if (sawSeparator && rows.length > 0) rows.shift();
    return rows;
}
function parseLinkTableSection(lines, result, mode) {
    const rows = parsePipeTable(lines);
    for (const row of rows) {
        if (row.length < 2) continue;
        const word  = row[0].trim();
        const value = row[1].trim();
        if (!word || !value) continue;
        if (mode === 'links') {
            if (/^https?:\/\//i.test(value)) result.links.push({ label: word, url: value });
        } else {
            const def = row.slice(1).join(' | ').trim();
            result.gloss[word.toLowerCase()] = { word, def };
        }
    }
}

function extractOutline(rawBody) {
    const lines = String(rawBody || '').replace(/\r\n?/g, '\n').split('\n');
    const items = [];
    let inCode = false;
    for (const line of lines) {
        if (/^```/.test(line.trim())) { inCode = !inCode; continue; }
        if (inCode) continue;
        const m = line.match(/^(#{1,2})\s+(.*)$/);
        if (!m) continue;
        const level = m[1].length;
        const text = m[2].trim();
        if (!text) continue;
        items.push({ level, text, id: 'doc-heading-' + slugify(text) + '-' + items.length });
    }
    return items;
}

function renderMarkdown(md, gloss, outline) {
    const glossKeys = Object.keys(gloss || {}).sort((a, b) => b.length - a.length);
    const escRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const glossRegex = glossKeys.length
        ? new RegExp('(?<![\\w-])(' + glossKeys.map(escRegex).join('|') + ')(?![\\w-])', 'gi')
        : null;

    function applyGloss(text) {
        if (!glossRegex) return text;
        return text.replace(glossRegex, (match) => {
            const g = gloss[match.toLowerCase()];
            if (!g) return match;
            return '<span class="doc-gloss" title="' + escapeAttr(g.def) + '">' + escapeHTML(match) + '</span>';
        });
    }
    function applyToHTML(html) {
        if (!glossRegex) return html;
        const out = [];
        let i = 0, inTag = false, inSkip = 0, buffer = '';
        const flush = () => {
            if (!buffer) return;
            if (inSkip > 0) out.push(buffer);
            else out.push(applyGloss(buffer));
            buffer = '';
        };
        while (i < html.length) {
            const ch = html[i];
            if (ch === '<') {
                flush();
                inTag = true;
                const slice = html.slice(i);
                if (/^<(code|pre)\b/i.test(slice)) inSkip++;
                else if (/^<\/(code|pre)\s*>/i.test(slice)) inSkip = Math.max(0, inSkip - 1);
                out.push(ch);
            } else if (ch === '>') { out.push(ch); inTag = false; }
            else if (inTag) out.push(ch);
            else buffer += ch;
            i++;
        }
        flush();
        return out.join('');
    }

    const lines = md.replace(/\r\n?/g, '\n').split('\n');
    const html = [];
    let i = 0, inCode = false, codeBuffer = [], headingIdx = 0;

    const esc = (s) => escapeHTML(s);
    const inline = (s) => {
        s = esc(s);
        s = s.replace(/`([^`]+)`/g, (_, c) => '<code>' + c + '</code>');
        s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
        s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        s = s.replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>');
        return s;
    };
    const flushList = (ls) => {
        if (ls.type === 'ul') html.push('</ul>');
        else if (ls.type === 'ol') html.push('</ol>');
        ls.type = null;
    };
    const ls = { type: null };

    while (i < lines.length) {
        const line = lines[i];
        const fence = line.match(/^```(\w*)\s*$/);
        if (fence) {
            if (inCode) {
                html.push('<pre><code>' + esc(codeBuffer.join('\n')) + '</code></pre>');
                inCode = false; codeBuffer = [];
            } else { inCode = true; }
            i++; continue;
        }
        if (inCode) { codeBuffer.push(line); i++; continue; }
        if (line.trim() === '') { flushList(ls); i++; continue; }

        let m;
        if ((m = line.match(/^(#{1,6})\s+(.*)$/))) {
            flushList(ls);
            const level = m[1].length;
            let idAttr = '';
            if (level <= 2 && outline && headingIdx < outline.length) {
                idAttr = ' id="' + escapeAttr(outline[headingIdx].id) + '"';
                headingIdx++;
            }
            html.push('<h' + level + idAttr + '>' + inline(m[2]) + '</h' + level + '>');
            i++; continue;
        }
        if (/^\s*---+\s*$/.test(line)) { flushList(ls); html.push('<hr>'); i++; continue; }
        if ((m = line.match(/^>\s?(.*)$/))) {
            flushList(ls);
            const buf = [m[1]];
            while (i + 1 < lines.length && lines[i + 1].match(/^>\s?/)) {
                i++; buf.push(lines[i].replace(/^>\s?/, ''));
            }
            html.push('<blockquote>' + inline(buf.join(' ')) + '</blockquote>');
            i++; continue;
        }
        if ((m = line.match(/^\s*[-*+]\s+(.*)$/))) {
            if (ls.type !== 'ul') { flushList(ls); html.push('<ul>'); ls.type = 'ul'; }
            html.push('<li>' + inline(m[1]) + '</li>');
            i++; continue;
        }
        if ((m = line.match(/^\s*\d+\.\s+(.*)$/))) {
            if (ls.type !== 'ol') { flushList(ls); html.push('<ol>'); ls.type = 'ol'; }
            html.push('<li>' + inline(m[1]) + '</li>');
            i++; continue;
        }
        if (line.includes('|') && i + 1 < lines.length && /^\s*\|?[\s:|-]+\|/.test(lines[i + 1])) {
            flushList(ls);
            const headerCells = line.split('|').map(c => c.trim()).filter(Boolean);
            i += 2;
            const rows = [];
            while (i < lines.length && lines[i].includes('|') && lines[i].trim() !== '') {
                rows.push(lines[i].split('|').map(c => c.trim()).filter(Boolean));
                i++;
            }
            html.push('<table><thead><tr>');
            for (const h of headerCells) html.push('<th>' + inline(h) + '</th>');
            html.push('</tr></thead><tbody>');
            for (const r of rows) {
                html.push('<tr>');
                for (const c of r) html.push('<td>' + inline(c) + '</td>');
                html.push('</tr>');
            }
            html.push('</tbody></table>');
            continue;
        }
        flushList(ls);
        const buf = [line];
        while (
            i + 1 < lines.length &&
            lines[i + 1].trim() !== '' &&
            !lines[i + 1].match(/^(#{1,6}\s|```|>\s|[-*+]\s|\d+\.\s)/)
        ) { i++; buf.push(lines[i]); }
        html.push('<p>' + inline(buf.join(' ')) + '</p>');
        i++;
    }
    flushList(ls);
    if (inCode) html.push('<pre><code>' + esc(codeBuffer.join('\n')) + '</code></pre>');
    return applyToHTML(html.join('\n'));
}

function parseCSV(text) {
    const rows = [];
    let row = [], field = '', inQuotes = false;
    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (inQuotes) {
            if (c === '"') {
                if (text[i + 1] === '"') { field += '"'; i++; }
                else inQuotes = false;
            } else field += c;
        } else {
            if (c === '"') inQuotes = true;
            else if (c === ',') { row.push(field); field = ''; }
            else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
            else if (c === '\r') { /* skip */ }
            else field += c;
        }
    }
    if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
    return rows.filter(r => r.length > 0 && !(r.length === 1 && r[0].trim() === ''));
}

const textCache = new Map();
async function fetchText(url) {
    if (textCache.has(url)) return textCache.get(url);
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) throw new Error('HTTP ' + res.status + ' for ' + url);
    const text = await res.text();
    textCache.set(url, text);
    return text;
}
async function fetchArrayBuffer(url) {
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) throw new Error('HTTP ' + res.status + ' for ' + url);
    return res.arrayBuffer();
}

const metaCache = new Map();
async function ensureMeta(doc) {
    if (metaCache.has(doc.path)) return metaCache.get(doc.path);

    const type = inferType(doc.path);
    const meta = {
        tags: [], links: [], gloss: {},
        title: doc.title || null,
        category: doc.category || categoryFromPath(doc.path),
        type
    };
    if (type === 'markdown' || type === 'text') {
        try {
            const raw = await fetchText(resolveRootPath(doc.path));
            const parsed = parseFrontMatter(raw);
            meta.tags = parsed.tags;
            meta.links = parsed.links;
            meta.gloss = parsed.gloss;
            if (!meta.title && parsed.title) meta.title = parsed.title;
            if (!meta.title) {
                const h = firstH1(parsed.body);
                if (h) meta.title = h;
            }
        } catch (_) { /* ignore */ }
    }
    if (!meta.title) meta.title = titleFromPath(doc.path);
    metaCache.set(doc.path, meta);
    return meta;
}

function findRelatedDocs(currentDoc, currentMeta) {
    const currentTags = new Set((currentMeta.tags || []).map(t => t.toLowerCase()));
    if (currentTags.size === 0) return [];
    const results = [];
    for (const other of documents) {
        if (other.path === currentDoc.path) continue;
        const otherMeta = metaCache.get(other.path);
        if (!otherMeta || !otherMeta.tags || otherMeta.tags.length === 0) continue;
        const shared = otherMeta.tags.filter(t => currentTags.has(t.toLowerCase()));
        if (shared.length === 0) continue;
        results.push({ doc: other, meta: otherMeta, sharedCount: shared.length, sharedTags: shared });
    }
    results.sort((a, b) => {
        if (b.sharedCount !== a.sharedCount) return b.sharedCount - a.sharedCount;
        return (a.meta.title || '').localeCompare(b.meta.title || '');
    });
    return results;
}
function buildRelatedBlock(relatedList) {
    if (!relatedList || relatedList.length === 0) return '';
    const parts = ['<div class="doc-related">'];
    parts.push('<div class="doc-related-title">Related Topics</div>');
    parts.push('<div class="doc-related-list">');
    for (const item of relatedList) {
        const title = item.meta.title || titleFromPath(item.doc.path);
        const sharedLabel = item.sharedTags.slice(0, 2).join(', ');
        parts.push(
            '<a class="doc-related-link" data-path="' + escapeAttr(item.doc.path) + '">' +
            escapeHTML(title) +
            '<span class="doc-related-shared">' + escapeHTML(sharedLabel) + '</span>' +
            '</a>'
        );
    }
    parts.push('</div></div>');
    return parts.join('');
}

let history = [];
try {
    const raw = sessionStorage.getItem(HISTORY_KEY);
    if (raw) history = JSON.parse(raw) || [];
} catch (_) { history = []; }

function pushHistory(path, title) {
    const meta = metaCache.get(path) || {};
    const entry = {
        path,
        title,
        category: meta.category || categoryFromPath(path),
        ts: Date.now()
    };
    history = history.filter(h => h.path !== path);
    history.unshift(entry);
    if (history.length > HISTORY_MAX) history.length = HISTORY_MAX;
    try { sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history)); } catch (_) {}
    renderHistory();
}
function clearHistory() {
    history = [];
    try { sessionStorage.removeItem(HISTORY_KEY); } catch (_) {}
    renderHistory();
}
function renderHistory() {
    if (!historyEl) return;
    historyEl.innerHTML = '';
    if (history.length === 0) {
        historyEl.innerHTML = '<div class="doc-side-empty">No documents viewed yet.</div>';
        return;
    }
    for (const entry of history) {
        const item = document.createElement('div');
        item.className = 'doc-history-item';
        if (entry.path === activeId) item.classList.add('active');
        item.dataset.path = entry.path;
        item.title = (entry.title || '') + '\n' + (entry.category || entry.path);

        const title = entry.title || titleFromPath(entry.path);
        const category = entry.category || categoryFromPath(entry.path);

        item.innerHTML =
            '<span class="doc-history-dot"></span>' +
            '<span class="doc-history-main">' +
                '<span class="doc-history-title">' + escapeHTML(title) + '</span>' +
                '<span class="doc-history-cat">' + escapeHTML(category) + '</span>' +
            '</span>' +
            '<span class="doc-history-meta">' +
                '<span class="doc-history-time">' + formatTime(entry.ts) + '</span>' +
                '<span class="doc-history-date">' + formatDate(entry.ts) + '</span>' +
            '</span>';

        item.addEventListener('click', () => selectDocument(entry.path));
        historyEl.appendChild(item);
    }
}

async function renderDocument(doc, container) {
    container.innerHTML = '<div class="doc-empty">Loading…</div>';
    const url = resolveRootPath(doc.path);
    const type = inferType(doc.path);
    const meta = await ensureMeta(doc);
    const header = buildMetaHeader(meta);
    const related = buildRelatedBlock(findRelatedDocs(doc, meta));
    clearOutlinePanel(meta.title);
    try {
        switch (type) {
            case 'markdown': {
                const raw = await fetchText(url);
                const parsed = parseFrontMatter(raw);
                const outline = extractOutline(parsed.body);
                container.innerHTML = header + related + renderMarkdown(parsed.body, meta.gloss, outline);
                buildOutlinePanel(outline);
                break;
            }
            case 'text': {
                const raw = await fetchText(url);
                const parsed = parseFrontMatter(raw);
                const outline = extractOutline(parsed.body);
                container.innerHTML = header + related + renderPlainWithGloss(parsed.body, meta.gloss);
                buildOutlinePanel(outline);
                break;
            }
            case 'json': {
                const raw = await fetchText(url);
                const parsed = parseFrontMatter(raw);
                let formatted = parsed.body;
                try { formatted = JSON.stringify(JSON.parse(parsed.body), null, 2); } catch (_) {}
                container.innerHTML = header + related + '<pre class="doc-plain">' + escapeHTML(formatted) + '</pre>';
                break;
            }
            case 'html': {
                const raw = await fetchText(url);
                container.innerHTML = header + related;
                const iframe = document.createElement('iframe');
                iframe.className = 'doc-frame';
                iframe.setAttribute('sandbox', 'allow-same-origin');
                iframe.srcdoc = raw;
                container.appendChild(iframe);
                break;
            }
            case 'pdf': {
                container.innerHTML = header + related;
                const iframe = document.createElement('iframe');
                iframe.className = 'doc-frame';
                iframe.src = url;
                container.appendChild(iframe);
                break;
            }
            case 'csv': {
                const raw = await fetchText(url);
                const rows = parseCSV(raw);
                if (rows.length === 0) {
                    container.innerHTML = header + related + '<div class="doc-empty">Empty CSV.</div>';
                    break;
                }
                const head = rows[0];
                const body = rows.slice(1);
                const parts = ['<table class="doc-csv-table"><thead><tr>'];
                for (const h of head) parts.push('<th>' + escapeHTML(h) + '</th>');
                parts.push('</tr></thead><tbody>');
                for (const r of body) {
                    parts.push('<tr>');
                    for (let c = 0; c < head.length; c++) parts.push('<td>' + escapeHTML(r[c] || '') + '</td>');
                    parts.push('</tr>');
                }
                parts.push('</tbody></table>');
                container.innerHTML = header + related + parts.join('');
                break;
            }
            case 'xlsx': {
                container.innerHTML = header + related;
                if (window.XLSX) {
                    const buf = await fetchArrayBuffer(url);
                    const wb = window.XLSX.read(buf, { type: 'array' });
                    const sheet = wb.Sheets[wb.SheetNames[0]];
                    const div = document.createElement('div');
                    div.innerHTML = window.XLSX.utils.sheet_to_html(sheet);
                    container.appendChild(div);
                } else {
                    container.insertAdjacentHTML('beforeend', renderUnsupported(doc, url, 'XLSX', 'SheetJS'));
                }
                break;
            }
            case 'docx': {
                container.innerHTML = header + related;
                if (window.mammoth) {
                    const buf = await fetchArrayBuffer(url);
                    const result = await window.mammoth.convertToHtml({ arrayBuffer: buf });
                    const div = document.createElement('div');
                    div.innerHTML = result.value || '<div class="doc-empty">Empty document.</div>';
                    container.appendChild(div);
                } else {
                    container.insertAdjacentHTML('beforeend', renderUnsupported(doc, url, 'DOCX', 'mammoth.js'));
                }
                break;
            }
            default: {
                const raw = await fetchText(url);
                container.innerHTML = header + related + '<pre class="doc-plain">' + escapeHTML(raw) + '</pre>';
            }
        }
        container.querySelectorAll('.doc-related-link').forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPath = el.getAttribute('data-path');
                if (targetPath) selectDocument(targetPath);
            });
        });
        wireScrollSpy();
    } catch (err) {
        container.innerHTML = header + related + renderError(doc, url, err);
    }
}

function renderPlainWithGloss(text, gloss) {
    const keys = Object.keys(gloss || {}).sort((a, b) => b.length - a.length);
    let safe = escapeHTML(text);
    if (keys.length === 0) return '<pre class="doc-plain">' + safe + '</pre>';
    const escRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp('(?<![\\w-])(' + keys.map(escRegex).join('|') + ')(?![\\w-])', 'gi');
    safe = safe.replace(re, (match) => {
        const g = gloss[match.toLowerCase()];
        if (!g) return match;
        return '<span class="doc-gloss-plain" title="' + escapeAttr(g.def) + '">' + match + '</span>';
    });
    return '<pre class="doc-plain">' + safe + '</pre>';
}

function buildMetaHeader(meta) {
    const parts = ['<div class="doc-meta">'];
    parts.push('<h1 class="doc-meta-title">' + escapeHTML(meta.title) + '</h1>');
    parts.push('<div class="doc-meta-row">');
    if (meta.category) {
        parts.push('<span class="doc-meta-category">' + escapeHTML(meta.category) + '</span>');
    }
    const tags = meta.tags || [];
    for (const t of tags) parts.push(tagChipHTML(t));
    parts.push('</div></div>');
    return parts.join('');
}

function renderUnsupported(doc, url, label, lib) {
    return '<div class="doc-error"><b>Cannot render ' + label + ' in-browser.</b><br>' +
        'To display ' + label + ' files inline, include <code>' + lib +
        '</code> in <code>index.html</code>.<br><br>' +
        '<a class="doc-download-btn" href="' + url + '" download>Download ' +
        escapeHTML(titleFromPath(doc.path)) + '</a></div>';
}
function renderError(doc, url, err) {
    return '<div class="doc-error"><b>Failed to load document:</b> ' +
        escapeHTML(titleFromPath(doc.path)) + '<br>' +
        '<span style="opacity:0.75">' + escapeHTML(String(err.message || err)) + '</span>' +
        '<br><br><a class="doc-download-btn" href="' + url + '" download>Download file</a></div>';
}

installStyles();

// ─────────────────────────────────────────────────────────────
// Sidebar entry — with monochrome inline SVG icon
// ─────────────────────────────────────────────────────────────
const sidebarEntry = document.createElement('div');
sidebarEntry.className = 'settings-row doc-sidebar-entry';
sidebarEntry.innerHTML = `
    <svg viewBox="0 0 24 24" width="16" height="16"
         fill="none" stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round"
         aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="8" y1="13" x2="16" y2="13"/>
        <line x1="8" y1="17" x2="14" y2="17"/>
    </svg>
    <span>Documents</span>
`;

const centerView = document.createElement('div');
centerView.className = 'center-view hidden doc-view-container';
centerView.id = 'doc-view';
centerView.innerHTML = `
    <div class="doc-view-body">
        <nav class="doc-toc">
            <input type="text" class="doc-toc-search" id="doc-toc-search" placeholder="Filter…">
            <div class="doc-toc-tree" id="doc-toc-tree"></div>
        </nav>
        <article class="doc-view-main" id="doc-view-main">
            <div class="doc-empty">Select a document from the table of contents.</div>
        </article>
    </div>
`;

const rightPanel = document.createElement('div');
rightPanel.className = 'doc-side-panel';
rightPanel.id = 'doc-side-view';
rightPanel.innerHTML = `
    <div class="doc-side-card" id="doc-outline-card">
        <div class="doc-side-header">
            <span id="doc-outline-header">Outline</span>
        </div>
        <div class="doc-side-body" id="doc-outline-body">
            <div class="doc-side-empty">No document open.</div>
        </div>
    </div>
    <div class="doc-side-card" id="doc-history-card">
        <div class="doc-side-header">
            <span>History</span>
            <button class="doc-side-clear" id="doc-history-clear" title="Clear history">Clear</button>
        </div>
        <div class="doc-side-body" id="doc-history-body">
            <div class="doc-side-empty">No documents viewed yet.</div>
        </div>
    </div>
`;

// Register the DOM elements via the Framework API
api.ui.registerElement('left-sidebar-top', sidebarEntry);
api.ui.registerElement('content-panel', centerView);
api.ui.registerElement('right-sidebar-top', rightPanel);

// Ensure our module sets its order based on modules.json synchronously
if (moduleOrderIndex !== null) {
    api.ui.setEntryOrder(sidebarEntry, moduleOrderIndex);
}

const treeEl      = centerView.querySelector('#doc-toc-tree');
const mainEl      = centerView.querySelector('#doc-view-main');
const searchEl    = centerView.querySelector('#doc-toc-search');
const outlineBody = rightPanel.querySelector('#doc-outline-body');
const outlineHead = rightPanel.querySelector('#doc-outline-header');
const historyEl   = rightPanel.querySelector('#doc-history-body');
const clearBtn    = rightPanel.querySelector('#doc-history-clear');

let documents = [];
let activeId = null;
let searchTerm = '';
let currentOutlineIds = [];
let scrollSpyAttached = false;
const expandedPaths = new Set();

async function loadManifest() {
    const url = BASE_DIR + REGISTRY_FILE;
    try {
        const res = await fetch(url, { cache: 'no-cache' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const json = await res.json();
        if (Array.isArray(json)) {
            documents = json.map(p => typeof p === 'string' ? { path: p } : p);
        } else if (json && Array.isArray(json.files)) {
            documents = json.files;
        } else {
            documents = [];
        }
    } catch (err) {
        console.warn('[Documents] Could not load ' + REGISTRY_FILE + ':', err);
        documents = [];
    }
    await Promise.all(documents.map(d => ensureMeta(d).catch(() => null)));
    buildTOC();
    renderHistory();
}

function buildTOC() {
    const root = { children: new Map(), items: [] };
    for (const doc of documents) {
        if (!matchesSearch(doc)) continue;
        const meta = metaCache.get(doc.path) || {};
        const category = meta.category || categoryFromPath(doc.path);
        const segments = String(category).split('/').map(s => s.trim()).filter(Boolean);
        let node = root;
        for (const seg of segments) {
            if (!node.children.has(seg)) {
                node.children.set(seg, { name: seg, children: new Map(), items: [] });
            }
            node = node.children.get(seg);
        }
        node.items.push(doc);
    }
    treeEl.innerHTML = '';
    if (root.children.size === 0 && root.items.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'doc-empty';
        empty.style.padding = '20px 12px';
        empty.style.fontSize = '0.8rem';
        empty.textContent = documents.length === 0 ? 'No documents configured.' : 'No matches.';
        treeEl.appendChild(empty);
        return;
    }
    renderNode(root, treeEl, '');
}

function renderNode(node, parentEl, parentPath) {
    const sortedCats = [...node.children.values()].sort((a, b) => a.name.localeCompare(b.name));
    for (const child of sortedCats) {
        const fullPath = parentPath ? parentPath + '/' + child.name : child.name;
        const nodeEl = document.createElement('div');
        nodeEl.className = 'doc-toc-node';
        if (!expandedPaths.has(fullPath)) nodeEl.classList.add('collapsed');
        const count = countItems(child);
        const headEl = document.createElement('div');
        headEl.className = 'doc-toc-node-head';
        headEl.innerHTML =
            '<span class="doc-toc-caret">▾</span>' +
            '<span>' + escapeHTML(child.name) + '</span>' +
            '<span class="doc-toc-node-count">' + count + '</span>';
        headEl.addEventListener('click', () => {
            nodeEl.classList.toggle('collapsed');
            if (nodeEl.classList.contains('collapsed')) expandedPaths.delete(fullPath);
            else expandedPaths.add(fullPath);
        });
        nodeEl.appendChild(headEl);
        const childrenEl = document.createElement('div');
        childrenEl.className = 'doc-toc-node-children';
        renderNode(child, childrenEl, fullPath);
        nodeEl.appendChild(childrenEl);
        parentEl.appendChild(nodeEl);
    }
    const sortedItems = [...node.items].sort((a, b) => {
        const ta = (metaCache.get(a.path) || {}).title || titleFromPath(a.path);
        const tb = (metaCache.get(b.path) || {}).title || titleFromPath(b.path);
        return ta.localeCompare(tb);
    });
    for (const doc of sortedItems) parentEl.appendChild(buildItemEl(doc));
}

function countItems(node) {
    let n = node.items.length;
    for (const c of node.children.values()) n += countItems(c);
    return n;
}

function buildItemEl(doc) {
    const id = doc.path;
    const meta = metaCache.get(doc.path) || {};
    const title = meta.title || titleFromPath(doc.path);
    const item = document.createElement('a');
    item.className = 'doc-toc-item';
    item.dataset.id = id;
    item.title = doc.path || '';
    item.innerHTML = '<span class="doc-toc-item-title">' + escapeHTML(title) + '</span>';
    item.addEventListener('click', () => selectDocument(id));
    return item;
}

function matchesSearch(doc) {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    const meta = metaCache.get(doc.path) || {};
    const haystack = [
        meta.title || titleFromPath(doc.path),
        meta.category || categoryFromPath(doc.path),
        (meta.tags || []).join(' '),
        doc.path
    ].join(' ').toLowerCase();
    return haystack.includes(q);
}

function clearOutlinePanel(title) {
    currentOutlineIds = [];
    outlineHead.textContent = title ? title : 'Outline';
    outlineBody.innerHTML = '<div class="doc-side-empty">No headings.</div>';
}

function buildOutlinePanel(outline) {
    currentOutlineIds = (outline || []).map(o => o.id);
    if (!outline || outline.length === 0) {
        outlineBody.innerHTML = '<div class="doc-side-empty">No headings in this document.</div>';
        return;
    }
    outlineBody.innerHTML = '';
    for (const item of outline) {
        const el = document.createElement('div');
        el.className = 'doc-outline-item level-' + item.level;
        el.dataset.id = item.id;
        el.textContent = item.text;
        el.title = item.text;
        el.addEventListener('click', () => {
            const target = document.getElementById(item.id);
            if (target && mainEl) {
                const top = target.offsetTop - mainEl.offsetTop;
                mainEl.scrollTo({ top: top - 12, behavior: 'smooth' });
            }
        });
        outlineBody.appendChild(el);
    }
    updateOutlineActive();
}

function updateOutlineActive() {
    if (!currentOutlineIds.length || !mainEl) return;
    const mainRect = mainEl.getBoundingClientRect();
    const threshold = mainRect.top + 30;
    let activeIdLocal = currentOutlineIds[0];
    for (const id of currentOutlineIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= threshold) activeIdLocal = id;
        else break;
    }
    outlineBody.querySelectorAll('.doc-outline-item').forEach(el => {
        el.classList.toggle('active', el.dataset.id === activeIdLocal);
    });
}

function wireScrollSpy() {
    if (scrollSpyAttached) return;
    scrollSpyAttached = true;
    let queued = false;
    mainEl.addEventListener('scroll', () => {
        if (queued) return;
        queued = true;
        requestAnimationFrame(() => {
            queued = false;
            updateOutlineActive();
        });
    }, { passive: true });
}

function selectDocument(id) {
    const doc = documents.find(d => d.path === id);
    if (!doc) return;
    activeId = id;
    treeEl.querySelectorAll('.doc-toc-item').forEach(el => {
        el.classList.toggle('active', el.dataset.id === id);
    });
    const meta = metaCache.get(doc.path) || {};
    const category = meta.category || categoryFromPath(doc.path);
    const segments = String(category).split('/').map(s => s.trim()).filter(Boolean);
    let acc = '';
    for (const seg of segments) {
        acc = acc ? acc + '/' + seg : seg;
        expandedPaths.add(acc);
    }
    buildTOC();
    treeEl.querySelectorAll('.doc-toc-item').forEach(el => {
        el.classList.toggle('active', el.dataset.id === id);
    });
    const title = meta.title || titleFromPath(doc.path);
    pushHistory(doc.path, title);
    renderDocument(doc, mainEl);
}

searchEl.addEventListener('input', () => {
    searchTerm = searchEl.value.trim();
    buildTOC();
}, { passive: true });
clearBtn.addEventListener('click', () => clearHistory());

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
            if (child.id === 'doc-side-view') {
                child.classList.add('active');
                child.style.display = 'flex';
            } else {
                child.classList.remove('active');
                child.style.display = 'none';
            }
        });
    }
});

loadManifest();

window.DocumentViewer = {
    reload: loadManifest,
    open: selectDocument,
    get documents() { return documents; },
    get history() { return history; },
    clearHistory
};

window.DocumentViewer.__booted = true;
console.log('[Documents] Document Viewer ready.');

})();