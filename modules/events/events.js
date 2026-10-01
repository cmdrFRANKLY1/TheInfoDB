import { state } from '../state/state.js';
import { dom } from '../dom/dom.js';
import { 
    applyTheme, 
    renderSplitView, 
    handleFileSelection, 
    renderDashboard, 
    renderTree, 
    showToast 
} from '../ui/ui.js';
import { pickLang, downloadFile, getFileDisplayPath, afterScrollSettles } from '../utils/utils.js';
import { executeGlobalSearch, loadAvailableTags, parseSearchQuery } from '../search/search.js';
import { getTagHue } from '../markdown/markdown.js';
import { loadLanguage, retranslatePages } from '../i18n/i18n.js';
import { loadTooltips } from '../api/api.js';

/* ============================================================
    JUMP FLASH — subtle heading shadow
   ============================================================ */

const TEXT_FLASH_MS = 2000;

function getFlashPalette() {
    const cs = getComputedStyle(document.documentElement);
    const read = (n, f) => (cs.getPropertyValue(n) || '').trim() || f;
    return {
        glow:     read('--flash-glow',      'rgba(250,204,21,0.12)'),
        glowSoft: read('--flash-glow-soft', 'rgba(250,204,21,0.05)'),
    };
}

function findHeading(el) {
    if (!el) return null;
    if (/^H[1-6]$/.test(el.tagName)) return el;
    return el.querySelector('h1, h2, h3, h4, h5, h6') || el;
}

export function flashHeading(targetEl) {
    if (!targetEl) return;
    const heading = findHeading(targetEl);
    if (!heading) return;

    if (heading.__flashTimers) {
        heading.__flashTimers.forEach(clearTimeout);
        heading.__flashTimers = null;
    }

    const prev = {
        textShadow: heading.style.textShadow,
        transition: heading.style.transition,
        position:   heading.style.position,
        zIndex:     heading.style.zIndex,
    };

    heading.style.position = heading.style.position || 'relative';
    heading.style.zIndex = '50';
    heading.style.transition = 'color 0.15s ease, text-shadow 0.15s ease';

    const applyPeak = () => {
        const p = getFlashPalette();
        heading.style.textShadow =
            `0 0 8px ${p.glow}, 0 0 16px ${p.glowSoft}`;
    };
    applyPeak();
    const timer = setTimeout(() => {
        heading.style.textShadow = prev.textShadow;
        heading.style.transition = prev.transition;
        heading.style.zIndex = prev.zIndex;
        if (prev.position !== 'relative') heading.style.position = prev.position;
        heading.__flashTimers = null;
    }, TEXT_FLASH_MS);
    heading.__flashTimers = [timer];
}

/* ============================================================
   Scroll container discovery
   ============================================================ */

/**
 * Walk up from el and find the nearest ancestor that is actually scrollable.
 * Handles split-view (where .split-column is the scroller) and normal view
 * (where #content-scroll-area is the scroller).
 */
function findScrollParent(el) {
    let p = el?.parentElement;
    while (p && p !== document.body) {
        const cs = getComputedStyle(p);
        const oy = cs.overflowY;
        if ((oy === 'auto' || oy === 'scroll' || oy === 'overlay') &&
            p.scrollHeight > p.clientHeight + 1) {
            return p;
        }
        p = p.parentElement;
    }
    return document.scrollingElement;
}

/* ============================================================
   Jump target resolution — id, then heading text fallback
   ============================================================ */

/**
 * Normalize a raw href / data-* value into a plain id-like string.
 * Strips a leading '#', trims, and decodes URI escapes.
 */
function normalizeId(raw) {
    if (!raw) return '';
    let s = String(raw).trim();
    if (s.startsWith('#')) s = s.slice(1);
    try { s = decodeURIComponent(s); } catch { /* ignore */ }
    return s;
}

/**
 * Convert an id/heading string into a slug we can compare against
 * heading text. "Installation & Setup" → "installation-setup"
 */
function slugify(s) {
    return String(s || '')
        .toLowerCase()
        .replace(/&/g, ' and ')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * Resolve a jump target. Tries, in order:
 *   1. document.getElementById(id)
 *   2. [data-id="..."], [name="..."]
 *   3. Any [id] whose slug matches the slug of the raw id
 *   4. Any heading inside #document-content whose slug matches
 *
 * Returns { scrollTarget, flashTarget } or null.
 */
function resolveJumpTarget(rawId) {
    const id = normalizeId(rawId);
    if (!id) return null;

    // 1 & 2: direct match
    let el =
        document.getElementById(id) ||
        document.querySelector(`[data-id="${CSS.escape(id)}"]`) ||
        document.querySelector(`[name="${CSS.escape(id)}"]`);

    // 3: slug match against any element id
    if (!el) {
        const targetSlug = slugify(id);
        const all = document.querySelectorAll('#document-content [id], #document-content-secondary [id]');
        for (const cand of all) {
            if (slugify(cand.id) === targetSlug) { el = cand; break; }
        }
    }

    // 4: slug match against heading text
    if (!el) {
        const targetSlug = slugify(id);
        const headings = document.querySelectorAll(
            '#document-content h1, #document-content h2, #document-content h3, ' +
            '#document-content h4, #document-content h5, #document-content h6, ' +
            '#document-content-secondary h1, #document-content-secondary h2, ' +
            '#document-content-secondary h3, #document-content-secondary h4, ' +
            '#document-content-secondary h5, #document-content-secondary h6'
        );
        for (const h of headings) {
            if (slugify(h.textContent) === targetSlug) { el = h; break; }
        }
    }

    if (!el) {
        console.warn('[jump] could not resolve id:', id);
        return null;
    }

    // If we landed on a heading, scroll to its enclosing panel if there is one
    if (/^H[1-6]$/.test(el.tagName)) {
        const panel = el.closest('.panel-stylized, .subtopic-panel, .h3-block, [data-panel]');
        return {
            scrollTarget: panel || el,
            flashTarget:  el,
        };
    }

    // Otherwise scroll to el, flash its heading
    const heading = findHeading(el);
    return { scrollTarget: el, flashTarget: heading || el };
}

/* ============================================================
   Scroll + flash
   ============================================================ */

function scrollToAndFlashPanel(scrollEl, flashEl) {
    if (!scrollEl) return;

    const scroller = findScrollParent(scrollEl);
    const scrollerRect = scroller.getBoundingClientRect();
    const targetRect = scrollEl.getBoundingClientRect();

    const currentScroll = scroller === document.scrollingElement
        ? window.scrollY
        : scroller.scrollTop;

    const offsetWithinScroller = targetRect.top - scrollerRect.top + currentScroll;
    const desiredScrollTop = offsetWithinScroller - (scroller.clientHeight / 2) + (targetRect.height / 2);
    const top = Math.max(0, desiredScrollTop);

    afterScrollSettles(scroller, () => flashHeading(flashEl));

    if (scroller === document.scrollingElement) {
        window.scrollTo({ top, behavior: 'smooth' });
    } else {
        scroller.scrollTo({ top, behavior: 'smooth' });
    }
}

/* ============================================================
   Click interception — capture phase, many selector shapes
   ============================================================ */

function setupJumpFlashDelegation() {
    document.addEventListener('click', (e) => {
        if (e.target.closest('button:not([data-jump]):not([data-target]):not([data-topic])')) return;
        if (e.target.closest('[data-no-jump]')) return;

        const link = e.target.closest(
            'a[href^="#"], a[href*="#"], a[href^="file:"], ' +
            '[data-jump], [data-target], [data-topic], [data-anchor], [data-scroll-to]'
        );
        if (!link) return;

        // Pull the raw target from whichever attribute is set
        let raw =
            link.dataset.jump ||
            link.dataset.target ||
            link.dataset.topic ||
            link.dataset.anchor ||
            link.dataset.scrollTo ||
            link.getAttribute('href') ||
            '';

        // Handle "file:///foo", "http://.../#bar", "#bar", "bar"
        if (raw.includes('#')) {
            raw = raw.split('#').pop();
        } else if (raw.startsWith('file:')) {
            raw = raw.replace(/^file:(\/\/\/)?/, '');
        }

        if (!raw) return;

        const resolved = resolveJumpTarget(raw);
        if (!resolved) return;

        e.preventDefault();
        e.stopPropagation();

        scrollToAndFlashPanel(resolved.scrollTarget, resolved.flashTarget);
    }, true);
}

/* ============================================================
   Resize handlers (unchanged)
   ============================================================ */

export function setupSidebarResize() {
    let isResizing = false, startY = 0, startHeight = 0;
    dom.sidebarResizeHandle.addEventListener('mousedown', (e) => {
        isResizing = true; startY = e.clientY;
        startHeight = dom.sidebarResizableContainer.getBoundingClientRect().height;
        document.body.style.cursor = 'ns-resize';
        document.body.style.userSelect = 'none';
        e.preventDefault();
    });
    window.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        const h = startHeight + (e.clientY - startY);
        const minH = 120, maxH = window.innerHeight - 200;
        if (h >= minH && h <= maxH) dom.sidebarResizableContainer.style.height = `${h}px`;
    });
    window.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            document.body.style.cursor = 'default';
            document.body.style.userSelect = '';
        }
    });
}

export function setupPinsResize() {
    let isResizing = false, startY = 0, startHeight = 0;
    dom.pinsResizeHandle.addEventListener('mousedown', (e) => {
        isResizing = true; startY = e.clientY;
        startHeight = dom.pinsResizableContainer.getBoundingClientRect().height;
        document.body.style.cursor = 'ns-resize';
        document.body.style.userSelect = 'none';
        e.preventDefault();
    });
    window.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        const h = startHeight + (startY - e.clientY);
        const minH = 120, maxH = window.innerHeight - 120;
        if (h >= minH && h <= maxH) dom.pinsResizableContainer.style.height = `${h}px`;
    });
    window.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            document.body.style.cursor = 'default';
            document.body.style.userSelect = '';
        }
    });
}

export function setupTooltipEngine() {
    let hideTimer = null;
    document.addEventListener('mouseover', (e) => {
        const el = e.target.closest && e.target.closest('.tooltip-term');
        if (!el) return;
        const term = el.getAttribute('data-term');
        const lang = el.getAttribute('data-lang') || 'English';
        const desc = (state.tooltips[lang] || {})[term];
        if (!desc) return;
        clearTimeout(hideTimer);
        dom.globalTooltip.textContent = desc;
        dom.globalTooltip.classList.add('show');
        const rect = el.getBoundingClientRect();
        const tipRect = dom.globalTooltip.getBoundingClientRect();
        let left = rect.left + rect.width / 2 - tipRect.width / 2;
        let top = rect.top - tipRect.height - 8;
        if (left < 8) left = 8;
        if (left + tipRect.width > window.innerWidth - 8) left = window.innerWidth - tipRect.width - 8;
        if (top < 8) top = rect.bottom + 8;
        dom.globalTooltip.style.left = `${left}px`;
        dom.globalTooltip.style.top = `${top}px`;
    });
    document.addEventListener('mouseout', (e) => {
        const el = e.target.closest && e.target.closest('.tooltip-term');
        if (!el) return;
        hideTimer = setTimeout(() => dom.globalTooltip.classList.remove('show'), 60);
    });
    window.addEventListener('scroll', () => dom.globalTooltip.classList.remove('show'), true);
}

export function attachLinkListeners(container) {
    container.querySelectorAll('.external-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            state.pendingLink = link.href;
            dom.linkModal.classList.remove('hidden');
        });
    });
}

/* ============================================================
   Main event setup
   ============================================================ */

export function setupEventListeners() {
    setupJumpFlashDelegation();

    window.addEventListener('click', () => dom.contextMenu.classList.add('hidden'));

    dom.themeToggleBtn.addEventListener('click', () => {
        applyTheme(state.theme === 'dark' ? 'light' : 'dark');
    });

    dom.ctxOpenLeft.onclick = () => {
        if (!state.contextFile) return;
        state.isSplitView = true;
        dom.toggleSplitViewBtn.classList.add('text-white');
        dom.toggleSplitViewBtn.classList.remove('text-neutral-300');
        state.splitFile1 = state.contextFile;
        state.slot1Language = pickLang(state.contextFile);
        renderSplitView();
    };
    dom.ctxOpenRight.onclick = () => {
        if (!state.contextFile) return;
        state.isSplitView = true;
        dom.toggleSplitViewBtn.classList.add('text-white');
        dom.toggleSplitViewBtn.classList.remove('text-neutral-300');
        state.splitFile2 = state.contextFile;
        state.slot2Language = pickLang(state.contextFile);
        renderSplitView();
    };

    document.getElementById('dl-pins-txt').onclick = () => {
        if (state.pinnedTopics.length === 0) return showToast(state.translations.toastNoPins);
        downloadFile('pinned_topics.txt',
            state.pinnedTopics.map(p => `${p.path} - ${p.topic}\n\n${p.text}`).join('\n\n---\n\n'));
    };
    document.getElementById('dl-pins-md').onclick = () => {
        if (state.pinnedTopics.length === 0) return showToast(state.translations.toastNoPins);
        downloadFile('pinned_topics.md',
            state.pinnedTopics.map(p => `<!-- ${p.path} -->\n${p.text}`).join('\n\n---\n\n'));
    };

    dom.pinsBtn.onclick = () => dom.pinsSidebar.classList.toggle('hidden');
    document.getElementById('close-pins-btn').onclick = () => dom.pinsSidebar.classList.add('hidden');

    let quickSearchTags = [];
    let quickSearchTagTimer;
    let availableSearchTags = null;

    const renderQuickSearchTags = () => {
        dom.qsTags.replaceChildren();
        quickSearchTags.forEach(tag => {
            const chip = document.createElement('span');
            chip.className = 'quick-search-chip';
            chip.style.setProperty('--tag-hue', String(getTagHue(tag)));
            chip.appendChild(document.createTextNode(tag));

            const removeButton = document.createElement('button');
            removeButton.type = 'button';
            removeButton.className = 'quick-search-chip-remove';
            removeButton.textContent = '×';
            removeButton.title = `Remove tag filter ${tag}`;
            removeButton.setAttribute('aria-label', `Remove tag filter ${tag}`);
            removeButton.addEventListener('click', () => {
                quickSearchTags = quickSearchTags.filter(value => value !== tag);
                renderQuickSearchTags();
                searchQuickSearch();
                dom.qsInput.focus();
            });

            chip.appendChild(removeButton);
            dom.qsTags.appendChild(chip);
        });
    };

    const getQuickSearchQuery = () => [
        ...quickSearchTags.map(tag => `tag:${tag}`),
        dom.qsInput.value.trim()
    ].filter(Boolean).join(' ');

    const searchQuickSearch = () => {
        const query = getQuickSearchQuery();
        dom.qsClear.classList.toggle('hidden', query === '');
        executeGlobalSearch(query);
    };

    const closeQuickSearchTagMenu = () => {
        dom.qsTagMenu.classList.add('hidden');
        dom.qsTagMenuButton.setAttribute('aria-expanded', 'false');
    };

    const renderQuickSearchTagOptions = () => {
        const filter = dom.qsTagFilter.value.trim().toLowerCase();
        const visibleTags = (availableSearchTags || []).filter(tag => tag.includes(filter));
        dom.qsTagOptions.replaceChildren();

        if (visibleTags.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'text-neutral-500 text-xs px-2 py-3';
            emptyMessage.textContent = 'No matching tags';
            dom.qsTagOptions.appendChild(emptyMessage);
            return;
        }

        visibleTags.forEach(tag => {
            const option = document.createElement('button');
            option.type = 'button';
            option.className = 'quick-search-tag-option';
            option.setAttribute('role', 'option');
            option.setAttribute('aria-selected', String(quickSearchTags.includes(tag)));
            option.disabled = quickSearchTags.includes(tag);

            const swatch = document.createElement('span');
            swatch.className = 'quick-search-tag-swatch';
            swatch.style.setProperty('--tag-hue', String(getTagHue(tag)));
            option.append(swatch, document.createTextNode(tag));
            option.addEventListener('click', () => {
                if (quickSearchTags.includes(tag)) return;
                quickSearchTags.push(tag);
                renderQuickSearchTags();
                closeQuickSearchTagMenu();
                searchQuickSearch();
                dom.qsInput.focus();
            });
            dom.qsTagOptions.appendChild(option);
        });
    };

    dom.qsTagMenuButton.addEventListener('click', async e => {
        e.stopPropagation();
        if (!dom.qsTagMenu.classList.contains('hidden')) {
            closeQuickSearchTagMenu();
            return;
        }

        dom.qsTagMenu.classList.remove('hidden');
        dom.qsTagMenuButton.setAttribute('aria-expanded', 'true');
        dom.qsTagFilter.value = '';
        dom.qsTagOptions.innerHTML = '<div class="text-neutral-500 text-xs px-2 py-3">Loading tags...</div>';
        dom.qsTagFilter.focus();
        availableSearchTags = await loadAvailableTags();
        renderQuickSearchTagOptions();
    });

    dom.qsTagFilter.addEventListener('input', renderQuickSearchTagOptions);
    document.addEventListener('click', e => {
        if (!dom.qsTagMenu.contains(e.target) && !dom.qsTagMenuButton.contains(e.target)) {
            closeQuickSearchTagMenu();
        }
    });

    const commitQuickSearchTags = () => {
        const parsed = parseSearchQuery(dom.qsInput.value);
        if (parsed.tags.length === 0) return false;

        quickSearchTags = [...new Set([...quickSearchTags, ...parsed.tags])];
        dom.qsInput.value = parsed.text;
        renderQuickSearchTags();
        searchQuickSearch();
        return true;
    };

    dom.qsInput.addEventListener('input', () => {
        clearTimeout(quickSearchTagTimer);
        searchQuickSearch();

        const parsed = parseSearchQuery(dom.qsInput.value);
        if (parsed.tags.length === 0) return;
        if (/\s$/.test(dom.qsInput.value)) {
            commitQuickSearchTags();
            return;
        }
        quickSearchTagTimer = setTimeout(commitQuickSearchTags, 500);
    });

    dom.qsInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            clearTimeout(quickSearchTagTimer);
            if (commitQuickSearchTags()) e.preventDefault();
        } else if (e.key === 'Backspace' && !dom.qsInput.value && quickSearchTags.length > 0) {
            quickSearchTags.pop();
            renderQuickSearchTags();
            searchQuickSearch();
            e.preventDefault();
        }
    });

    dom.qsClear.onclick = () => {
        clearTimeout(quickSearchTagTimer);
        quickSearchTags = [];
        dom.qsInput.value = '';
        renderQuickSearchTags();
        dom.qsClear.classList.add('hidden');
        executeGlobalSearch('');
    };

    dom.pageSearchInput.addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase();
        dom.pageSearchClear.classList.toggle('hidden', val === '');
        const filtered = state.pages.filter(p =>
            p.title.toLowerCase().includes(val) || p.category.toLowerCase().includes(val));
        renderTree(filtered, dom.pagesTree);
    });
    dom.pageSearchClear.onclick = () => {
        dom.pageSearchInput.value = '';
        dom.pageSearchClear.classList.add('hidden');
        renderTree(state.pages, dom.pagesTree);
    };

    dom.linkCancel.onclick = () => {
        dom.linkModal.classList.add('hidden');
        state.pendingLink = '';
    };
    dom.linkOkay.onclick = () => {
        dom.linkModal.classList.add('hidden');
        if (state.pendingLink) window.open(state.pendingLink, '_blank');
    };

    dom.toggleSplitViewBtn.onclick = () => {
        state.isSplitView = !state.isSplitView;
        if (state.isSplitView) {
            dom.toggleSplitViewBtn.classList.add('text-white');
            dom.toggleSplitViewBtn.classList.remove('text-neutral-300');
            if (state.currentActiveFile && !state.splitFile1) {
                state.splitFile1 = state.currentActiveFile;
                state.slot1Language = pickLang(state.currentActiveFile);
            }
            renderSplitView();
        } else {
            dom.toggleSplitViewBtn.classList.remove('text-white');
            dom.toggleSplitViewBtn.classList.add('text-neutral-300');
            const prev = state.splitFile1 || state.currentActiveFile;
            if (prev) handleFileSelection(prev); else renderDashboard();
        }
    };

    document.getElementById('ui-language-select').addEventListener('change', async (e) => {
        await loadLanguage(e.target.value);
        retranslatePages();
        renderTree(state.pages, dom.pagesTree);
        if (state.isSplitView) renderSplitView();
        else if (state.currentActiveFile) dom.breadcrumb.textContent = getFileDisplayPath(state.currentActiveFile);
        else renderDashboard();
    });
}

window.flashHeading = flashHeading;
window.__resolveJumpTarget = resolveJumpTarget;