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
    const offset = targetRect.top - rootRect.top + scrollRoot.scrollTop - 12;

    scrollRoot.scrollTo({ top: offset, behavior: 'smooth' });

    // Flash the targeted section to highlight it briefly
    const flashClass = target.classList.contains('h3-block') ? 'jump-target-h3' : 'jump-target';
    target.classList.remove('jump-target', 'jump-target-h3');
    void target.offsetWidth; // Trigger reflow to restart animation
    target.classList.add(flashClass);
    
    // Clean up the flash class after the animation completes
    setTimeout(() => target.classList.remove(flashClass), 1300);
}