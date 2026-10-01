# TheInfoDB - Application Architecture & Module Structure

This document outlines the architecture, file structure, and module responsibilities of TheInfoDB, a vanilla JavaScript client-side application designed to fetch, parse, and display Markdown documentation directly from a GitHub repository.

Following a major refactoring, the application utilizes native ES6 Modules to enforce a strict separation of concerns, making the codebase highly maintainable, scalable, and easy to debug.

# 📁 Directory Structure

/ (Project Root)
├── index.html                       # Main HTML layout and Tailwind/custom CSS
├── hyperlinks.json                  # (Data) Global auto-hyperlink mappings
├── mouseOverTooltips.json           # (Data) Global tooltip definitions
├── languages/                       # (Data) Localization files
│   ├── index/
│   │   ├── indexLanguage_English.json
│   │   └── indexLanguage_German.json
│   └── pages/
│       ├── pagesLanguage_English.json
│       └── pagesLanguage_German.json
└── modules/                         # (Logic) ES6 JavaScript Modules
    ├── main.js                      # Application entry point
    ├── state/
    │   └── state.js                 # Global application state and constants
    ├── dom/
    │   └── dom.js                   # Centralized DOM element caching and icons
    ├── api/
    │   └── api.js                   # Network requests and GitHub integration
    ├── markdown/
    │   └── markdown.js              # Custom Markdown parser and HTML formatter
    ├── ui/
    │   └── ui.js                    # View rendering (Tree, Dashboard, Split View)
    ├── i18n/
    │   └── i18n.js                  # Internationalization and translation logic
    ├── events/
    │   └── events.js                # DOM event listeners and interactivity handling
    ├── search/
    │   └── search.js                # Global search engine logic
    ├── pins/
    │   └── pins.js                  # Pinning topics and managing the pins sidebar
    └── utils/
        └── utils.js                 # Reusable helper functions


# 🧩 Module Breakdown

## 1. main.js (The Orchestrator)

The entry point of the application. It does not contain business logic itself. Instead, it imports initialization functions from other modules and executes them in the correct sequence to bootstrap the application.

Key Responsibilities: Applying the initial theme, loading configurations, triggering the GitHub tree fetch, and attaching global event listeners.

## 2. state.js (The Single Source of Truth)

Contains the global state object and configuration constants (like supported languages and fixed keys).

Key Responsibilities: Storing the current active files (for single and split view), user preferences (theme, font scale, view mode), cached file contents, and the processed repository tree map.

Note: Other modules import this object by reference, meaning mutations to state are globally reflected.

## 3. dom.js (The Element Cache)

Acts as a registry for DOM elements. Instead of scattering document.getElementById calls throughout the codebase, they are executed once here and exported in a dom object.

Key Responsibilities: Providing structured access to UI elements and exporting raw SVG strings (ICONS) used for dynamic rendering.

## 4. api.js (The Network Layer)

Handles all external HTTP requests via the fetch API.

Key Responsibilities:

Fetching and parsing the GitHub repository tree (fetchGitHubTree).

Fetching raw Markdown content (fetchContent).

Preloading documents in the background (preloadContentForAllLanguages).

Loading local JSON configuration files for translations, hyperlinks, and tooltips.

## 5. markdown.js (The Parsing Engine)

A custom, zero-dependency Markdown parser tailored for TheInfoDB's specific formatting needs.

Key Responsibilities:

Converting Markdown to HTML (bold, italics, code blocks, hyperlinks).

Parsing structured sections based on header depths (#, ##, ###).

Generating HTML tables from Markdown syntax.

Injecting span wrappers around text that matches dictionary keys for global tooltips.

## 6. ui.js (The Rendering Engine)

The largest module, responsible for generating DOM structures dynamically based on application state.

Key Responsibilities:

Rendering the hierarchical sidebar navigation (renderTree).

Rendering the main grid overview (renderDashboard).

Managing Single View vs. Split View DOM transitions (handleFileSelection, renderSplitView).

Injecting parsed HTML from markdown.js into the view containers.

## 7. events.js (The Interaction Controller)

Centralizes the setup for user interactions that don't belong strictly to one rendering function.

Key Responsibilities:

Sidebar and Pins panel drag-to-resize logic.

The Global Tooltip engine (calculating mouse coordinates and displaying popups).

Binding click events for theme toggling, context menus, modal dialogs, and external link warnings.

## 8. i18n.js (The Localization Manager)

Manages the user interface language and category string translations.

Key Responsibilities:

Fetching JSON language packs.

Applying translated strings to static HTML elements via data-i18n attributes.

Translating dynamic folder names in the sidebar navigation (translateFolder).

## 9. search.js (The Search Subsystem)

Handles querying the loaded document cache.

Key Responsibilities: Interating through cached Markdown content to find query matches, then delegating to ui.js to render the filtered view, highlighting relevant sections.

## 10. pins.js (The Pinning Subsystem)

Manages the "Pinned Topics" feature, allowing users to save specific sections of Markdown for quick reference.

Key Responsibilities: Adding topics to the pinned state array and re-rendering the pinned sidebar panel.

## 11. utils.js (The Helpers)

A collection of pure functions and isolated utilities used by various other modules.

Key Responsibilities: Browser file downloading (downloadFile), breadcrumb path generation, language fallback logic (pickLang), and smooth scrolling to specific anchor tags.

# 🔄 Initialization Flow (Lifecycle)

When the browser loads index.html, the following sequence occurs via main.js:

UI Preparation: applyTheme sets up dark/light mode CSS variables. Default UI selections (like the language dropdown) are set.

Configuration Loading: api.js concurrently fetches local JSON data (Hyperlinks, Tooltips, Page Registry translations).

Localization Setup: i18n.js loads the default English language pack and applies text to the DOM.

Tree Fetching: api.js queries the GitHub API for the repository tree. It filters for .md files, infers the document root, and structures the navigation hierarchy.

Initial Rendering: ui.js takes the processed tree data and renders the Sidebar navigation and the Dashboard Grid.

Event Binding: events.js attaches all dynamic event listeners (search bars, resizers, tooltips).

Background Preloading: A silent background process kicks off to fetch all .md files from GitHub and store them in state.fileCache, ensuring subsequent clicks load instantly.

# Tags

- theinfodb
- application-architecture
- javascript
- markdown
- modules
- github
