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
import { pickLang, downloadFile, getFileDisplayPath } from '../utils/utils.js';
import { executeGlobalSearch } from '../search/search.js';
import { loadLanguage, retranslatePages } from '../i18n/i18n.js';
import { loadTooltips } from '../api/api.js';

export function setupSidebarResize() {
    let isResizing = false;
    let startY = 0;
    let startHeight = 0;

    dom.sidebarResizeHandle.addEventListener('mousedown', (e) => {
        isResizing = true;
        startY = e.clientY;
        startHeight = dom.sidebarResizableContainer.getBoundingClientRect().height;
        document.body.style.cursor = 'ns-resize';
        document.body.style.userSelect = 'none';
        e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        const delta = e.clientY - startY;
        const newHeight = startHeight + delta;
        const minH = 120;
        const maxH = window.innerHeight - 200;
        if (newHeight >= minH && newHeight <= maxH) {
            dom.sidebarResizableContainer.style.height = `${newHeight}px`;
        }
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
    let isResizing = false;
    let startY = 0;
    let startHeight = 0;

    dom.pinsResizeHandle.addEventListener('mousedown', (e) => {
        isResizing = true;
        startY = e.clientY;
        startHeight = dom.pinsResizableContainer.getBoundingClientRect().height;
        document.body.style.cursor = 'ns-resize';
        document.body.style.userSelect = 'none';
        e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        const delta = startY - e.clientY;
        const newHeight = startHeight + delta;
        const minH = 120;
        const maxH = window.innerHeight - 120;
        if (newHeight >= minH && newHeight <= maxH) {
            dom.pinsResizableContainer.style.height = `${newHeight}px`;
        }
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
        
        // Lookup the definition using the language embedded in the span
        const langDict = state.tooltips[lang] || {};
        const desc = langDict[term];
        if (!desc) return;

        clearTimeout(hideTimer);
        dom.globalTooltip.textContent = desc;
        dom.globalTooltip.classList.add('show');

        const rect = el.getBoundingClientRect();
        const tipRect = dom.globalTooltip.getBoundingClientRect();
        let left = rect.left + rect.width / 2 - tipRect.width / 2;
        let top = rect.top - tipRect.height - 8;
        if (left < 8) left = 8;
        if (left + tipRect.width > window.innerWidth - 8) {
            left = window.innerWidth - tipRect.width - 8;
        }
        if (top < 8) top = rect.bottom + 8;
        dom.globalTooltip.style.left = `${left}px`;
        dom.globalTooltip.style.top = `${top}px`;
    });

    document.addEventListener('mouseout', (e) => {
        const el = e.target.closest && e.target.closest('.tooltip-term');
        if (!el) return;
        hideTimer = setTimeout(() => {
            dom.globalTooltip.classList.remove('show');
        }, 60);
    });

    window.addEventListener('scroll', () => {
        dom.globalTooltip.classList.remove('show');
    }, true);
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

export function setupEventListeners() {
    // Context Menu Close
    window.addEventListener('click', () => dom.contextMenu.classList.add('hidden'));

    // Theme Toggle
    dom.themeToggleBtn.addEventListener('click', () => {
        applyTheme(state.theme === 'dark' ? 'light' : 'dark');
    });

    // Context Menu: Open Left
    dom.ctxOpenLeft.onclick = () => {
        if (!state.contextFile) return;
        state.isSplitView = true;
        dom.toggleSplitViewBtn.classList.add('bg-neutral-800', 'text-white');
        dom.toggleSplitViewBtn.classList.remove('text-neutral-300');
        state.splitFile1 = state.contextFile;
        state.slot1Language = pickLang(state.contextFile);
        renderSplitView();
    };

    // Context Menu: Open Right
    dom.ctxOpenRight.onclick = () => {
        if (!state.contextFile) return;
        state.isSplitView = true;
        dom.toggleSplitViewBtn.classList.add('bg-neutral-800', 'text-white');
        dom.toggleSplitViewBtn.classList.remove('text-neutral-300');
        state.splitFile2 = state.contextFile;
        state.slot2Language = pickLang(state.contextFile);
        renderSplitView();
    };

    // Download Pins
    document.getElementById('dl-pins-txt').onclick = () => {
        if (state.pinnedTopics.length === 0) return showToast(state.translations.toastNoPins);
        const content = state.pinnedTopics.map(p => `${p.path} - ${p.topic}\n\n${p.text}`).join('\n\n---\n\n');
        downloadFile('pinned_topics.txt', content);
    };
    document.getElementById('dl-pins-md').onclick = () => {
        if (state.pinnedTopics.length === 0) return showToast(state.translations.toastNoPins);
        const content = state.pinnedTopics.map(p => `<!-- ${p.path} -->\n${p.text}`).join('\n\n---\n\n');
        downloadFile('pinned_topics.md', content);
    };

    // Pins Sidebar Toggle
    dom.pinsBtn.onclick = () => {
        dom.pinsSidebar.classList.toggle('hidden');
    };
    document.getElementById('close-pins-btn').onclick = () => {
        dom.pinsSidebar.classList.add('hidden');
    };

    // Global Search Interactions
    dom.qsInput.addEventListener('input', (e) => {
        dom.qsClear.classList.toggle('hidden', e.target.value === '');
        executeGlobalSearch(e.target.value);
    });
    dom.qsClear.onclick = () => {
        dom.qsInput.value = '';
        dom.qsClear.classList.add('hidden');
        if (state.isSplitView) {
            renderSplitView();
        } else if (state.currentActiveFile) {
            handleFileSelection(state.currentActiveFile);
        } else {
            renderDashboard();
        }
    };

    // Page Search Interactions
    dom.pageSearchInput.addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase();
        dom.pageSearchClear.classList.toggle('hidden', val === '');
        const filtered = state.pages.filter(p =>
            p.title.toLowerCase().includes(val) ||
            p.category.toLowerCase().includes(val));
        renderTree(filtered, dom.pagesTree);
    });
    dom.pageSearchClear.onclick = () => {
        dom.pageSearchInput.value = '';
        dom.pageSearchClear.classList.add('hidden');
        renderTree(state.pages, dom.pagesTree);
    };

    // Link Modal
    dom.linkCancel.onclick = () => {
        dom.linkModal.classList.add('hidden');
        state.pendingLink = '';
    };
    dom.linkOkay.onclick = () => {
        dom.linkModal.classList.add('hidden');
        if (state.pendingLink) window.open(state.pendingLink, '_blank');
    };

    // Toggle Split View
    dom.toggleSplitViewBtn.onclick = () => {
        state.isSplitView = !state.isSplitView;
        if (state.isSplitView) {
            dom.toggleSplitViewBtn.classList.add('bg-neutral-800', 'text-white');
            dom.toggleSplitViewBtn.classList.remove('text-neutral-300');
            if (state.currentActiveFile && !state.splitFile1) {
                state.splitFile1 = state.currentActiveFile;
                state.slot1Language = pickLang(state.currentActiveFile);
            }
            renderSplitView();
        } else {
            dom.toggleSplitViewBtn.classList.remove('bg-neutral-800', 'text-white');
            dom.toggleSplitViewBtn.classList.add('text-neutral-300');
            const prev = state.splitFile1 || state.currentActiveFile;
            if (prev) {
                handleFileSelection(prev);
            } else {
                renderDashboard();
            }
        }
    };

    // UI Language Select
    document.getElementById('ui-language-select').addEventListener('change', async (e) => {
        await loadLanguage(e.target.value);
        // Tooltips are now preloaded for all languages, no need to reload them here!
        retranslatePages();
        renderTree(state.pages, dom.pagesTree);
        
        if (state.isSplitView) {
            renderSplitView();
        } else if (state.currentActiveFile) {
            dom.breadcrumb.textContent = getFileDisplayPath(state.currentActiveFile);
        } else {
            renderDashboard();
        }
    });
}