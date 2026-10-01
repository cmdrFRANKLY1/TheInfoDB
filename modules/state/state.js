export const state = {
    pages: [],
    fileCache: {},
    hyperlinks: {},
    hyperlinkPaths: [], // Stores dynamically discovered config files
    tooltips: {},
    tooltipPaths: [], // Stores dynamically discovered tooltip files
    currentRenderingLang: 'English',
    pinnedTopics: [],
    currentActiveFile: null,
    splitFile1: null,
    splitFile2: null,
    slot1Language: 'English',
    slot2Language: 'English',
    viewMode: 'Stylized',
    viewMode1: 'Stylized',
    viewMode2: 'Stylized',
    isSplitView: false,
    pendingLink: '',
    uiLanguage: 'English',
    translations: {},
    contextFile: null,
    theme: localStorage.getItem('theme') || 'dark',
    treeOpenState: {},
    pageRegistry: {},
    docsRoot: null,
    docFontScale1: parseFloat(localStorage.getItem('docFontScale1') || '1'),
    docFontScale2: parseFloat(localStorage.getItem('docFontScale2') || '1')
};

export const defaultTranslations = {
    searchPagesPlaceholder: "Search pages...",
    searchEverythingPlaceholder: "Search everything (tag:linux)...",
    pagesTitle: "Pages",
    dashboardTitle: "Dashboard",
    viewModeStylized: "Markdown",
    viewModeRaw: "Raw",
    downloadTextfile: "Textfile",
    downloadMarkdown: "Markdown",
    dashboardOverview: "Overview",
    noMatchingTopics: "No matching topics found.",
    pinnedTopicsTitle: "Pinned Topics",
    noPinsMsg: "No topics pinned yet.",
    linkModalTitle: "External Link",
    linkModalText: "You are leaving this page. Are you sure?",
    linkModalCancel: "Cancel",
    linkModalOkay: "Okay",
    toastCopied: "Copied to Clipboard!",
    toastPinned: "Pinned topic",
    toastNoFile: "No file selected.",
    toastNoPins: "No pins to download.",
    searchResults: "Search Results:",
    jumpToTitle: "Jump to section",
    jumpNoSections: "No sections in this document.",
    toastJumped: "Jumped to"
};

export const FIXED_ENGLISH_KEYS = new Set(['viewModeStylized', 'viewModeRaw']);

export const SUPPORTED_LANGUAGES = ['English', 'German'];