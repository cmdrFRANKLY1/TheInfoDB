(function() {
    // Ensure the core API is available before proceeding
    if (!window.theInfoDB) {
        console.warn("InfoDB ColorScheme Module: Core API not found. Aborting.");
        return;
    }

    const api = window.theInfoDB;

    // Define the core CSS variables that control the entire UI
    const colorTokens = [
        { token: 'bg-color', label: 'Background' },
        { token: 'panel-bg', label: 'Panel' },
        { token: 'text-color', label: 'Text' },
        { token: 'border-color', label: 'Border' },
        { token: 'accent-color', label: 'Accent' }
    ];

    const styles = `
        .settings-panel {
            display: flex;
            flex-direction: column;
            width: 100%;
            max-width: 400px;
            margin: 0 auto;
            gap: 8px;
            padding: 12px;
        }
        .panel-header {
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
        .header-actions {
            display: flex;
            gap: 6px;
        }
        .action-btn {
            background: transparent;
            border: 1px solid var(--border-color);
            color: var(--text-color);
            font-size: 0.75rem;
            padding: 2px 8px;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.1s ease;
        }
        .action-btn:hover {
            background-color: var(--border-color);
            color: var(--text-color);
            border-color: var(--accent-color);
        }
        .module-color-scheme {
            display: flex;
            flex-direction: column;
            background-color: var(--panel-bg);
            border-radius: 6px;
            border: 1px solid var(--border-color);
            overflow: hidden;
        }
        .color-item {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            padding: 6px 12px;
            background-color: transparent;
            transition: background-color 0.1s ease;
        }
        .color-item:not(:last-child) {
            border-bottom: 1px solid var(--border-color);
        }
        .color-item:hover {
            background-color: rgba(128, 128, 128, 0.05);
        }
        .color-label {
            font-size: 0.8rem;
            font-weight: 500;
            color: var(--text-color);
        }
        .color-circle-input {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 1px solid var(--border-color);
            padding: 0;
            background: transparent;
            cursor: pointer;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            transition: transform 0.1s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.1s ease;
        }
        .color-circle-input:hover {
            transform: scale(1.15);
            border-color: var(--accent-color);
        }
        /* Shadow DOM targeting to reshape the internal color swatch */
        .color-circle-input::-webkit-color-swatch-wrapper {
            padding: 0;
        }
        .color-circle-input::-webkit-color-swatch {
            border: none;
            border-radius: 50%;
        }
        .color-circle-input::-moz-color-swatch {
            border: none;
            border-radius: 50%;
        }
    `;
    
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);

    const panel = document.createElement('div');
    panel.className = 'settings-panel';

    const header = document.createElement('div');
    header.className = 'panel-header';
    
    const titleText = document.createElement('span');
    titleText.textContent = 'Appearance';
    
    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'header-actions';
    
    const randomBtn = document.createElement('button');
    randomBtn.className = 'action-btn';
    randomBtn.textContent = 'Random';

    const resetBtn = document.createElement('button');
    resetBtn.className = 'action-btn';
    resetBtn.textContent = 'Reset';
    
    actionsContainer.appendChild(randomBtn);
    actionsContainer.appendChild(resetBtn);
    
    header.appendChild(titleText);
    header.appendChild(actionsContainer);

    const container = document.createElement('div');
    container.className = 'module-color-scheme';

    panel.appendChild(header);
    panel.appendChild(container);

    // Native color inputs require exact 6-character hex codes.
    // This helper safely standardizes values fetched from CSS variables.
    const rgbToHex = (str) => {
        if (!str) return '#000000';
        if (str.startsWith('#')) return str.substring(0, 7); // Truncate alpha if present
        
        const rgb = str.match(/\d+/g);
        if (!rgb || rgb.length < 3) return '#000000';
        
        return '#' + rgb.slice(0, 3).map(x => {
            const hex = parseInt(x).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    };

    colorTokens.forEach(({ token, label }) => {
        const row = document.createElement('div');
        row.className = 'color-item';
        
        const labelEl = document.createElement('span');
        labelEl.className = 'color-label';
        labelEl.textContent = label;
        
        const inputEl = document.createElement('input');
        inputEl.type = 'color';
        inputEl.className = 'color-circle-input';
        inputEl.dataset.token = token;
        
        // Fetch initial color securely from the core API
        inputEl.value = rgbToHex(api.colorAPI.getColor(token));
        
        // Using 'input' ensures zero-latency live updating while dragging the OS color cursor
        inputEl.addEventListener('input', (e) => {
            api.colorAPI.setTheme({ [token]: e.target.value });
        }, { passive: true });

        row.appendChild(labelEl);
        row.appendChild(inputEl);
        container.appendChild(row);
    });

    // Mount the entire panel to the exposed 'settings-menu' target
    api.ui.registerElement('settings-menu', panel);

    const syncColors = () => {
        container.querySelectorAll('.color-circle-input').forEach(input => {
            input.value = rgbToHex(api.colorAPI.getColor(input.dataset.token));
        });
    };

    // High-performance hex generator
    randomBtn.addEventListener('click', () => {
        const randomTheme = {};
        colorTokens.forEach(({ token }) => {
            // Generate a random 24-bit color and pad with leading zeros if necessary
            randomTheme[token] = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        });
        api.colorAPI.setTheme(randomTheme);
        // The MutationObserver will automatically catch the style change and sync the circles,
        // but calling syncColors here guarantees immediate visual feedback before the next frame.
        syncColors(); 
    });

    // Strip inline properties to instantly revert to index.html CSS root defaults
    resetBtn.addEventListener('click', () => {
        colorTokens.forEach(({ token }) => {
            document.documentElement.style.removeProperty(`--${token}`);
        });
        syncColors();
    });

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.attributeName === 'class' || mutation.attributeName === 'style') {
                syncColors();
                break;
            }
        }
    });

    // Observe root where themes are applied
    observer.observe(document.documentElement, { 
        attributes: true, 
        attributeFilter: ['class', 'style'] 
    });

})();