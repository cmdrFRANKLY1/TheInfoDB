import { state } from '../state/state.js';
import { dom } from '../dom/dom.js';
import { fetchContent } from '../api/api.js';
import { 
    renderSplitView, 
    handleFileSelection, 
    renderDashboard, 
    clearDocumentToolbars,
    applyDocFontScope, 
    parseAndRenderMarkdownDocument 
} from '../ui/ui.js';

let searchVersion = 0;
const SEARCH_DEBOUNCE_MS = 160;

export async function executeGlobalSearch(query) {
    const version = ++searchVersion;

    // If search is cleared, restore the previous view state
    if (!query) {
        if (state.isSplitView) {
            renderSplitView();
        } else if (state.currentActiveFile) {
            handleFileSelection(state.currentActiveFile);
        } else {
            renderDashboard();
        }
        return;
    }

    await new Promise(resolve => setTimeout(resolve, SEARCH_DEBOUNCE_MS));
    if (version !== searchVersion) return;

    // Configure the layout for single-column search results
    clearDocumentToolbars();
    dom.contentScrollArea.classList.remove('split-active');
    dom.documentView.classList.remove('max-w-[1600px]', 'w-full');
    dom.documentView.classList.add('w-full', 'max-w-[1000px]');
    dom.documentContentSecondary.classList.add('hidden');
    dom.documentContent.classList.remove('split-column');
    dom.documentContentSecondary.classList.remove('split-column');
    dom.splitDivider.classList.add('hidden');

    // Switch view to document viewer and set breadcrumb
    dom.dashboardView.classList.add('hidden');
    dom.documentView.classList.remove('hidden');
    dom.breadcrumb.textContent = `${state.translations.searchResults || 'Search Results:'} "${query}"`;
    dom.documentContent.innerHTML = '<div class="text-neutral-500 text-center mt-10">Searching...</div>';

    applyDocFontScope(dom.documentContent, '1');

    const lang = state.slot1Language;
    const q = query.toLowerCase();
    const results = await Promise.all(state.pages.map(async file => {
        const path = file.paths[lang] || file.paths['English'] || Object.values(file.paths)[0];
        if (!path) return null;
        const content = await fetchContent(path);
        return content.toLowerCase().includes(q) ? { file, content } : null;
    }));

    if (version !== searchVersion) return;
    const matches = results.filter(Boolean);

    // Show no results message if nothing matched
    if (matches.length === 0) {
        dom.documentContent.innerHTML = `<div class="text-neutral-500 text-center mt-10">${state.translations.noMatchingTopics}</div>`;
        return;
    }

    dom.documentContent.innerHTML = '';
    matches.forEach(({ file, content }) => {
        parseAndRenderMarkdownDocument(content, dom.documentContent, file, state.viewMode, true, query, '', null, lang, null);
    });
}