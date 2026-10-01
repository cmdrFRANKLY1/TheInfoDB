import { state } from '../state/state.js';
import { dom } from '../dom/dom.js';

/**
 * Constructs the display path (breadcrumb-style) for a given file object.
 */
export function getFileDisplayPath(file) {
    if (!file) return "";
    return file.category && file.category !== '' ? `${file.category} / ${file.title}` : file.title;
}

/**
 * Triggers a download of a text-based file using the browser's Blob API.
 */
export function downloadFile(filename, content) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * Determines the best available language for a file based on current UI settings.
 */
export function pickLang(file) {
    if (!file || !file.paths) return 'English';
    if (state.uiLanguage === 'German' && file.paths['German']) return 'German';
    if (file.paths[state.uiLanguage]) return state.uiLanguage;
    if (file.paths['English']) return 'English';
    return Object.keys(file.paths)[0];
}

export function afterScrollSettles(scroller, callback) {
    let quietTimer;
    let completed = false;

    const finish = () => {
        if (completed) return;
        completed = true;
        clearTimeout(quietTimer);
        scroller.removeEventListener('scroll', onScroll);
        scroller.removeEventListener('scrollend', finish);
        callback();
    };
    const onScroll = () => {
        clearTimeout(quietTimer);
        quietTimer = setTimeout(finish, 120);
    };

    scroller.addEventListener('scroll', onScroll, { passive: true });
    scroller.addEventListener('scrollend', finish, { once: true });
    quietTimer = setTimeout(finish, 120);
}

/**
 * Smoothly scrolls the correct view pane to a specified DOM element anchor.
 */
export function jumpToAnchor(id, slot) {
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;

    let scrollRoot;
    // Determine which pane is scrolling based on split view and slot status
    if (state.isSplitView) {
        scrollRoot = slot === '2' ? dom.documentContentSecondary : dom.documentContent;
    } else {
        scrollRoot = dom.contentScrollArea;
    }

    const rootRect = scrollRoot.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const toolbarSlot = state.isSplitView
        ? (slot === '2' ? dom.documentToolbarSecondary : dom.documentToolbarPrimary)
        : dom.documentToolbarPrimary;
    const toolbar = toolbarSlot.querySelector('.doc-toolbar');
    const toolbarBottom = toolbar ? toolbar.getBoundingClientRect().bottom - rootRect.top : 0;
    const offset = targetRect.top - rootRect.top + scrollRoot.scrollTop - toolbarBottom - 12;

    afterScrollSettles(scrollRoot, () => {
        if (!target.isConnected) return;
        const flashClass = target.classList.contains('h3-block') ? 'jump-target-h3' : 'jump-target';
        clearTimeout(target.__jumpHighlightTimer);
        target.classList.remove('jump-target', 'jump-target-h3');
        void target.offsetWidth;
        target.classList.add(flashClass);
        target.__jumpHighlightTimer = setTimeout(() => {
            target.classList.remove(flashClass);
            target.__jumpHighlightTimer = null;
        }, 2000);
    });

    scrollRoot.scrollTo({ top: offset, behavior: 'smooth' });
}