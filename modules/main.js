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

    // 2. Load configurations and internationalization
    await loadHyperlinks();
    await loadTooltips();
    await loadPageRegistry();
    await loadLanguage('English');
    
    // 3. Fetch the repository tree and render the sidebar/dashboard
    await fetchGitHubTree();
    renderTree(state.pages, dom.pagesTree);
    renderDashboard();
    
    // 4. Attach all interactive event listeners
    setupEventListeners();
    setupSidebarResize();
    setupPinsResize();
    setupTooltipEngine();

    // 5. Fire off background content preloading
    preloadContentForAllLanguages();
}

// Start the application
init();