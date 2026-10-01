import { state } from './state/state.js';
import { dom } from './dom/dom.js';
import { applyTheme, renderTree, renderDashboard } from './ui/ui.js';
import {
    loadHyperlinks,
    loadTooltips,
    loadPageRegistry,
    fetchGitHubTree
} from './api/api.js';
import { loadLanguage } from './i18n/i18n.js';
import {
    setupEventListeners,
    setupSidebarResize,
    setupPinsResize,
    setupTooltipEngine
} from './events/events.js';

/* ============================================================
    JUMP FLASH — subtle heading shadow for the target
   ============================================================ */

const TEXT_FLASH_MS = 1100;
const SCROLL_SETTLE_MS = 350;

/**
 * Read the current theme's flash palette from CSS variables in index.html.
 * Uses the low-intensity theme colors defined in the page stylesheet.
 */
function getFlashPalette() {
    const cs = getComputedStyle(document.documentElement);
    const read = (name, fallback) =>
        (cs.getPropertyValue(name) || '').trim() || fallback;

    return {
        glow:    read('--flash-glow',     'rgba(250,204,21,0.12)'),
        glowSoft: read('--flash-glow-soft','rgba(250,204,21,0.05)'),
    };
}

/**
 * Find the most meaningful heading inside (or equal to) the target.
 * Prefers h1/h2/h3, falls back to the element itself.
 */
function findHeading(el) {
    if (!el) return null;
    if (/^H[1-6]$/.test(el.tagName)) return el;

    // Prefer the first heading that is not a section divider
    const h = el.querySelector('h1, h2, h3, h4, h5, h6');
    return h || el;
}

/**
 * Flash the heading text via inline styles. Theme-aware colors.
 *
 * @param {HTMLElement|null} targetEl - the panel (or heading) that was jumped to
 */
function flashHeading(targetEl) {
    if (!targetEl) {
        console.warn('[flashHeading] called with no element');
        return;
    }

    const heading = findHeading(targetEl);
    if (!heading) return;

    const p = getFlashPalette();

    // Save original inline styles so we can restore cleanly
    const prev = {
        textShadow: heading.style.textShadow,
        transition: heading.style.transition,
        position:   heading.style.position,
        zIndex:     heading.style.zIndex,
    };

    heading.style.position = heading.style.position || 'relative';
    heading.style.zIndex = '50';
    heading.style.transition =
        'color 0.15s ease, text-shadow 0.15s ease';

    const applyPeak = () => {
        const pal = getFlashPalette(); // re-read in case theme flipped mid-flash
        heading.style.textShadow =
            `0 0 8px ${pal.glow}, 0 0 16px ${pal.glowSoft}`;
    };

    const clearPeak = () => {
        heading.style.textShadow = prev.textShadow;
    };

    // Two pulses for visibility
    applyPeak();

    const t1 = window.setTimeout(clearPeak, TEXT_FLASH_MS * 0.35);
    const t2 = window.setTimeout(() => {
        heading.style.textShadow = prev.textShadow;
        heading.style.transition = prev.transition;
        heading.style.zIndex = prev.zIndex;
        if (prev.position !== 'relative') heading.style.position = prev.position;
    }, TEXT_FLASH_MS);

    // Cancel prior timers if the same heading is flashed again
    if (heading.__flashTimers) {
        heading.__flashTimers.forEach(clearTimeout);
    }
    heading.__flashTimers = [t1, t2];
}

/**
 * Scroll the target into view, wait for the scroll to settle,
 * then flash its heading.
 */
function scrollToAndFlash(targetEl) {
    if (!targetEl) return;

    targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

    let lastY = window.scrollY;
    let stableFrames = 0;
    const checkStable = () => {
        if (Math.abs(window.scrollY - lastY) < 1) {
            stableFrames++;
        } else {
            stableFrames = 0;
            lastY = window.scrollY;
        }
        if (stableFrames > 3) {
            flashHeading(targetEl);
        } else {
            requestAnimationFrame(checkStable);
        }
    };
    requestAnimationFrame(checkStable);

    // Safety net if the page didn't need to scroll
    window.setTimeout(() => {
        const heading = findHeading(targetEl);
        if (heading && !heading.__flashTimers) flashHeading(targetEl);
    }, SCROLL_SETTLE_MS);
}

window.flashHeading = flashHeading;
window.scrollToAndFlash = scrollToAndFlash;

/* ============================================================
   INIT
   ============================================================ */

async function init() {
    applyTheme(state.theme);
    dom.uiLanguageSelect.value = 'English';

    await loadLanguage('English');
    await loadPageRegistry();

    await fetchGitHubTree();

    await loadHyperlinks();
    await loadTooltips();

    renderTree(state.pages, dom.pagesTree);
    renderDashboard();

    setupEventListeners();
    setupSidebarResize();
    setupPinsResize();
    setupTooltipEngine();

}

init();