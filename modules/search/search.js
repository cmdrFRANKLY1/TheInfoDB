import { state } from '../state/state.js';
import { dom } from '../dom/dom.js';
import { fetchContent } from '../api/api.js';
import { extractTags, getTagHue, normalizeTag, removeTagSection } from '../markdown/markdown.js';
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
let availableTagsPromise;

export function parseSearchQuery(query) {
    const tags = [];
    const text = query.replace(/(^|\s)(?:tag\s*:\s*|#)(?:"([^"]+)"|<([^>]+)>|([^\s]+))/gi, (match, prefix, quoted, bracketed, bare) => {
        const tag = normalizeTag(quoted || bracketed || bare);
        if (tag) tags.push(tag);
        return prefix || ' ';
    }).replace(/\s+/g, ' ').trim();
    return { tags, text };
}

export function loadAvailableTags() {
    if (!availableTagsPromise) {
        availableTagsPromise = Promise.all(state.pages.map(async file => {
            const path = file.paths[state.slot1Language] || file.paths.English || Object.values(file.paths)[0];
            return path ? extractTags(await fetchContent(path)) : [];
        })).then(tagLists => [...new Set(tagLists.flat())].sort());
    }
    return availableTagsPromise;
}

export async function executeGlobalSearch(query) {
    const version = ++searchVersion;
    const search = parseSearchQuery(query);

    // If search is cleared, restore the previous view state
    if (!query.trim()) {
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
    const q = search.text.toLowerCase();
    const results = await Promise.all(state.pages.map(async file => {
        const path = file.paths[lang] || file.paths['English'] || Object.values(file.paths)[0];
        if (!path) return null;
        const content = await fetchContent(path);
        const tags = extractTags(content);
        const searchableContent = removeTagSection(content);
        return {
            file,
            tags,
            content: searchableContent,
            matches: search.tags.every(tag => tags.includes(tag))
                && (!q || searchableContent.toLowerCase().includes(q))
        };
    }));

    if (version !== searchVersion) return;
    const availableTags = [...new Set(results.filter(Boolean).flatMap(result => result.tags))].sort();
    const tagHues = Object.fromEntries(availableTags.map(tag => [tag, getTagHue(tag)]));
    const matches = results.filter(result => result?.matches);

    // Show no results message if nothing matched
    if (matches.length === 0) {
        dom.documentContent.innerHTML = `<div class="text-neutral-500 text-center mt-10">${state.translations.noMatchingTopics}</div>`;
        return;
    }

    dom.documentContent.innerHTML = '';
    matches.forEach(({ file, content, tags }) => {
        parseAndRenderMarkdownDocument(content, dom.documentContent, file, state.viewMode, true, search.text, '', null, lang, null, null, null, tags, tagHues);
    });
}