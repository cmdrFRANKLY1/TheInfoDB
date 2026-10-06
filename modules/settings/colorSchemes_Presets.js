(function() {
    // Ensure the core API exists before attempting to register the module
    if (!window.theInfoDB || !window.theInfoDB.ui || !window.theInfoDB.colorAPI) {
        console.error("InfoDB Color Presets Module: Core API not found.");
        return;
    }

    // A robust list of aesthetically pleasing, high-contrast color themes
    const themes = [
        {
            name: "System Default (Dark)",
            colors: {
                "bg-color": "#000000",
                "text-color": "#ffffff",
                "panel-bg": "#0a0a0a",
                "border-color": "#1a1a1a",
                "accent-color": "#3b82f6"
            }
        },
        {
            name: "Midnight Blue",
            colors: {
                "bg-color": "#0f172a",
                "text-color": "#f8fafc",
                "panel-bg": "#1e293b",
                "border-color": "#334155",
                "accent-color": "#38bdf8"
            }
        },
        {
            name: "Dracula",
            colors: {
                "bg-color": "#282a36",
                "text-color": "#f8f8f2",
                "panel-bg": "#44475a",
                "border-color": "#6272a4",
                "accent-color": "#bd93f9"
            }
        },
        {
            name: "Nord",
            colors: {
                "bg-color": "#2e3440",
                "text-color": "#d8dee9",
                "panel-bg": "#3b4252",
                "border-color": "#4c566a",
                "accent-color": "#88c0d0"
            }
        },
        {
            name: "Tokyo Night",
            colors: {
                "bg-color": "#1a1b26",
                "text-color": "#c0caf5",
                "panel-bg": "#24283b",
                "border-color": "#414868",
                "accent-color": "#7aa2f7"
            }
        },
        {
            name: "Solarized Dark",
            colors: {
                "bg-color": "#002b36",
                "text-color": "#839496",
                "panel-bg": "#073642",
                "border-color": "#586e75",
                "accent-color": "#268bd2"
            }
        },
        {
            name: "Gruvbox",
            colors: {
                "bg-color": "#282828",
                "text-color": "#ebdbb2",
                "panel-bg": "#3c3836",
                "border-color": "#504945",
                "accent-color": "#fe8019"
            }
        },
        {
            name: "Matrix Hacker",
            colors: {
                "bg-color": "#050505",
                "text-color": "#00ff41",
                "panel-bg": "#0d1411",
                "border-color": "#123b20",
                "accent-color": "#00ff41"
            }
        },
        {
            name: "Neon Synth",
            colors: {
                "bg-color": "#241b2f",
                "text-color": "#fdf0ed",
                "panel-bg": "#2b213a",
                "border-color": "#3a2d4d",
                "accent-color": "#ff79c6"
            }
        },
        {
            name: "Deep Ocean",
            colors: {
                "bg-color": "#011627",
                "text-color": "#d6deeb",
                "panel-bg": "#0b2942",
                "border-color": "#123c61",
                "accent-color": "#82aaff"
            }
        },
        {
            name: "Pine Forest",
            colors: {
                "bg-color": "#1c2321",
                "text-color": "#e6f9ec",
                "panel-bg": "#27312e",
                "border-color": "#364540",
                "accent-color": "#4ade80"
            }
        },
        {
            name: "Mocha Espresso",
            colors: {
                "bg-color": "#2a241f",
                "text-color": "#f4e6d4",
                "panel-bg": "#3b3228",
                "border-color": "#5e5246",
                "accent-color": "#d2b48c"
            }
        },
        {
            name: "Rose Pine",
            colors: {
                "bg-color": "#191724",
                "text-color": "#e0def4",
                "panel-bg": "#1f1d2e",
                "border-color": "#26233a",
                "accent-color": "#ebbcba"
            }
        },
        {
            name: "Carbon",
            colors: {
                "bg-color": "#161616",
                "text-color": "#f4f4f4",
                "panel-bg": "#262626",
                "border-color": "#393939",
                "accent-color": "#0f62fe"
            }
        },
        {
            name: "Sunset Flare",
            colors: {
                "bg-color": "#2a2139",
                "text-color": "#f4ede4",
                "panel-bg": "#34294f",
                "border-color": "#473b6b",
                "accent-color": "#ff7a59"
            }
        }
    ];

    // Injecting styles directly for the select dropdown to ensure it perfectly matches the app theme dynamically
    const styleId = 'infodb-theme-presets-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .preset-settings-panel {
                display: flex;
                flex-direction: column;
                width: 100%;
                max-width: 400px;
                margin: 0 auto;
                gap: 8px;
                padding: 12px;
            }
            .preset-panel-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 0.95rem;
                font-weight: 600;
                color: var(--text-color);
                letter-spacing: -0.01em;
                margin-bottom: 2px;
                border-bottom: 1px solid var(--border-color);
                padding-bottom: 6px;
            }
            .preset-module-container {
                display: flex;
                flex-direction: column;
                background-color: var(--panel-bg);
                border-radius: 6px;
                border: 1px solid var(--border-color);
                overflow: hidden;
            }
            .preset-item {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                padding: 6px 12px;
                background-color: transparent;
                transition: background-color 0.1s ease;
            }
            .preset-item:hover {
                background-color: rgba(128, 128, 128, 0.05);
            }
            .preset-label {
                font-size: 0.8rem;
                font-weight: 500;
                color: var(--text-color);
            }
            .theme-dropdown {
                background-color: var(--bg-color);
                color: var(--text-color);
                border: 1px solid var(--border-color);
                padding: 4px 8px;
                border-radius: 4px;
                font-family: inherit;
                font-size: 0.75rem;
                cursor: pointer;
                outline: none;
                transition: all 0.1s ease;
                min-width: 140px;
            }
            .theme-dropdown:hover, .theme-dropdown:focus {
                border-color: var(--accent-color);
            }
            .theme-dropdown option {
                background-color: var(--bg-color);
                color: var(--text-color);
            }
        `;
        document.head.appendChild(style);
    }

    // Constructing the DOM elements rather than HTML strings to securely attach listeners immediately
    const panel = document.createElement('div');
    panel.className = 'preset-settings-panel';

    const header = document.createElement('div');
    header.className = 'preset-panel-header';
    
    const titleText = document.createElement('span');
    titleText.textContent = 'Theme Presets';
    header.appendChild(titleText);

    const container = document.createElement('div');
    container.className = 'preset-module-container';

    const row = document.createElement('div');
    row.className = 'preset-item';

    const labelEl = document.createElement('span');
    labelEl.className = 'preset-label';
    labelEl.textContent = 'Global Palette';

    const select = document.createElement('select');
    select.className = 'theme-dropdown';
    select.setAttribute('aria-label', 'Select Color Scheme');

    // Populate options
    themes.forEach((theme, index) => {
        const option = document.createElement('option');
        option.value = index.toString(); // Store index to easily look up the color object later
        option.textContent = theme.name;
        select.appendChild(option);
    });

    // Listen for changes and update the global CSS variables using the provided Color API
    select.addEventListener('change', (e) => {
        const selectedIndex = parseInt(e.target.value, 10);
        const selectedTheme = themes[selectedIndex];
        
        if (selectedTheme) {
            // Un-toggle light theme if it was active to ensure our dark variables apply properly
            document.documentElement.classList.remove('theme-light');
            
            // Push colors to the API
            window.theInfoDB.colorAPI.setTheme(selectedTheme.colors);
        }
    });

    // Assemble the component
    row.appendChild(labelEl);
    row.appendChild(select);
    container.appendChild(row);
    
    panel.appendChild(header);
    panel.appendChild(container);

    // Register into the designated settings menu container inside the center pane
    window.theInfoDB.ui.registerElement('settings-menu', panel);

})();