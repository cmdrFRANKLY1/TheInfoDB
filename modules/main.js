import { state } from './state/state.js';
import { dom } from './dom/dom.js';
import { applyTheme, renderTree, renderDashboard } from './ui/ui.js';
import { 
    loadHyperlinks, 
    loadTooltips, 
    loadPageRegistry, 
    fetchGitHubTree, 
    preloadContentForAllLanguages 
} from './api/api.js';
import { loadLanguage } from './i18n/i18n.js';
import { 
    setupEventListeners, 
    setupSidebarResize, 
    setupPinsResize, 
    setupTooltipEngine 
} from './events/events.js';

async function init() {
    // 1. Setup base UI state and theme
    applyTheme(state.theme);
    dom.uiLanguageSelect.value = 'English';

    // 2. Load languages and registry first (Tree relies on registry for translations)
    await loadLanguage('English');
    await loadPageRegistry();
    
    // 3. Fetch the repository tree (discovers .md pages AND dynamic config files)
    await fetchGitHubTree();

    // 4. Load dynamic configurations using paths discovered from the tree
    await loadHyperlinks();
    await loadTooltips();
    
    // 5. Render UI
    renderTree(state.pages, dom.pagesTree);
    renderDashboard();
    
    // 6. Attach all interactive event listeners
    setupEventListeners();
    setupSidebarResize();
    setupPinsResize();
    setupTooltipEngine();

    // 7. Fire off background content preloading
    preloadContentForAllLanguages();
}

// Start the application
init();