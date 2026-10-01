import { state, defaultTranslations, FIXED_ENGLISH_KEYS } from '../state/state.js';
import { dom } from '../dom/dom.js';

export function translateFolder(rawName) {
    const langMap = state.pageRegistry[state.uiLanguage];
    if (langMap && langMap[rawName]) return langMap[rawName];
    const enMap = state.pageRegistry['English'];
    if (enMap && enMap[rawName]) return enMap[rawName];
    return rawName;
}

export function retranslatePages() {
    state.pages.forEach(p => {
        if (p.rawCategoryParts && p.rawCategoryParts.length > 0) {
            p.categoryParts = p.rawCategoryParts.map(x => translateFolder(x));
            p.category = p.categoryParts.join(' / ');
        } else {
            p.categoryParts = [];
            p.category = '';
        }
    });
}

export function applyTranslations() {
    const t = state.translations;
    
    // Update simple text elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) el.textContent = t[key];
    });
    
    // Update input placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key]) el.setAttribute('placeholder', t[key]);
    });
    
    // Update dynamic UI state texts
    if (!state.currentActiveFile && dom.dashboardView.classList.contains('hidden') === false) {
        dom.breadcrumb.textContent = t.dashboardTitle;
    }
    if (state.pinnedTopics.length === 0) {
        dom.noPinsMsg.textContent = t.noPinsMsg;
    }
}

export async function loadLanguage(lang) {
    state.uiLanguage = lang;

    let loaded = {};
    try {
        const res = await fetch(`./languages/index/indexLanguage_${lang}.json`);
        if (res.ok) {
            loaded = await res.json();
        }
    } catch (e) {
        loaded = {};
    }

    state.translations = Object.assign({}, defaultTranslations, loaded);
    
    // Preserve fixed english keys like raw/markdown toggles
    FIXED_ENGLISH_KEYS.forEach(key => {
        state.translations[key] = defaultTranslations[key];
    });

    applyTranslations();
}