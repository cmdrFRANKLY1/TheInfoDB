import { state } from '../state/state.js';
import { dom } from '../dom/dom.js';
import { fetchContent } from '../api/api.js';
import { 
    renderSplitView, 
    handleFileSelection, 
    renderDashboard, 
    applyDocFontScope, 
    parseAndRenderMarkdownDocument 
} from '../ui/ui.js';

export async function executeGlobalSearch(query) {
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

    // Configure the layout for single-column search results
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
    dom.documentContent.innerHTML = '';

    applyDocFontScope(dom.documentContent, '1');

    const lang = state.slot1Language;
    const q = query.toLowerCase();
    let foundAny = false;

    for (const file of state.pages) {
        const path = file.paths[lang] || file.paths['English'] || Object.values(file.paths)[0];
        if (!path) continue;
        
        const content = await fetchContent(path);
        
        // If there's a match, parse and render it in search mode
        if (content.toLowerCase().includes(q)) {
            foundAny = true;
            parseAndRenderMarkdownDocument(content, dom.documentContent, file, state.viewMode, true, query, '', null, lang, null);
        }
    }

    // Show no results message if nothing matched
    if (!foundAny) {
        dom.documentContent.innerHTML = `<div class="text-neutral-500 text-center mt-10">${state.translations.noMatchingTopics}</div>`;
    }
}