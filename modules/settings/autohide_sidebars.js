(function() {
    // Ensure the core API is available before proceeding
    if (!window.theInfoDB) {
        console.warn("InfoDB AutoHide Module: Core API not found. Aborting.");
        return;
    }

    const api = window.theInfoDB;

    const styles = `
        .autohide-panel {
            display: flex;
            flex-direction: column;
            width: 100%;
            max-width: 400px;
            margin: 0 auto;
            gap: 8px;
            padding: 8px 12px;
        }
        .autohide-header {
            font-size: 0.9rem;
            font-weight: 600;
            color: var(--text-color);
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 4px;
            margin-bottom: 2px;
            letter-spacing: -0.01em;
        }
        .module-autohide {
            display: flex;
            flex-direction: column;
            background-color: var(--panel-bg);
            border-radius: 6px;
            border: 1px solid var(--border-color);
            overflow: hidden;
        }
        .autohide-row {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            padding: 4px 10px;
            background-color: transparent;
            transition: background-color 0.1s ease;
        }
        .autohide-row:not(:last-child) {
            border-bottom: 1px solid var(--border-color);
        }
        .autohide-row:hover {
            background-color: rgba(128, 128, 128, 0.05);
        }
        .autohide-label {
            font-size: 0.75rem;
            font-weight: 500;
            color: var(--text-color);
        }
        
        /* Modern Compact Toggle Switch */
        .toggle-switch {
            position: relative;
            display: inline-block;
            width: 26px;
            height: 14px;
        }
        .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        .toggle-slider {
            position: absolute;
            cursor: pointer;
            top: 0; left: 0; right: 0; bottom: 0;
            background-color: var(--border-color);
            transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            border-radius: 14px;
        }
        .toggle-slider:before {
            position: absolute;
            content: "";
            height: 10px;
            width: 10px;
            left: 2px;
            bottom: 2px;
            background-color: var(--text-color);
            transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            border-radius: 50%;
        }
        .toggle-switch input:checked + .toggle-slider {
            background-color: var(--accent-color);
        }
        .toggle-switch input:checked + .toggle-slider:before {
            transform: translateX(12px);
            background-color: #ffffff;
        }
    `;
    
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);

    const panel = document.createElement('div');
    panel.className = 'autohide-panel';

    const header = document.createElement('div');
    header.className = 'autohide-header';
    header.textContent = 'Sidebar Behavior';

    const container = document.createElement('div');
    container.className = 'module-autohide';

    panel.appendChild(header);
    panel.appendChild(container);

    const elements = {
        leftSidebar: document.getElementById('left-sidebar'),
        rightSidebar: document.getElementById('right-sidebar'),
        body: document.body,
        toggleLeft: document.getElementById('toggle-left'),
        toggleRight: document.getElementById('toggle-right')
    };

    const state = {
        autoHideLeft: false,
        autoHideRight: false,
        hoverShowLeft: false,
        hoverShowRight: false
    };

    // These invisible divs act as highly performant hitboxes on the screen edges
    const leftEdge = document.createElement('div');
    leftEdge.style.cssText = 'position:fixed; top:48px; left:0; width:15px; bottom:0; z-index:9998; display:none;';
    document.body.appendChild(leftEdge);

    const rightEdge = document.createElement('div');
    rightEdge.style.cssText = 'position:fixed; top:48px; right:0; width:15px; bottom:0; z-index:9998; display:none;';
    document.body.appendChild(rightEdge);

    const openLeft = () => {
        elements.leftSidebar.classList.remove('closed');
        elements.body.classList.remove('left-closed');
    };
    const closeLeft = () => {
        if (!elements.leftSidebar.classList.contains('closed')) {
            elements.leftSidebar.classList.add('closed');
            elements.body.classList.add('left-closed');
        }
    };

    const openRight = () => {
        elements.rightSidebar.classList.remove('closed');
        elements.body.classList.remove('right-closed');
    };
    const closeRight = () => {
        if (!elements.rightSidebar.classList.contains('closed')) {
            elements.rightSidebar.classList.add('closed');
            elements.body.classList.add('right-closed');
        }
    };

    // Global click listener for Auto-Hide (Click Outside)
    // Checks if the click occurred outside the sidebar AND outside the topbar toggle button
    document.addEventListener('click', (e) => {
        if (state.autoHideLeft && !elements.leftSidebar.classList.contains('closed')) {
            if (!elements.leftSidebar.contains(e.target) && !elements.toggleLeft.contains(e.target)) {
                closeLeft();
            }
        }
        if (state.autoHideRight && !elements.rightSidebar.classList.contains('closed')) {
            if (!elements.rightSidebar.contains(e.target) && !elements.toggleRight.contains(e.target)) {
                closeRight();
            }
        }
    }, { passive: true });

    // Hover interaction listeners (Only trigger if hover toggles are enabled)
    elements.leftSidebar.addEventListener('mouseleave', () => { if (state.hoverShowLeft) closeLeft(); }, { passive: true });
    leftEdge.addEventListener('mouseenter', () => { if (state.hoverShowLeft) openLeft(); }, { passive: true });

    elements.rightSidebar.addEventListener('mouseleave', () => { if (state.hoverShowRight) closeRight(); }, { passive: true });
    rightEdge.addEventListener('mouseenter', () => { if (state.hoverShowRight) openRight(); }, { passive: true });

    const createToggleRow = (labelText, onChangeCallback) => {
        const row = document.createElement('div');
        row.className = 'autohide-row';
        
        const label = document.createElement('span');
        label.className = 'autohide-label';
        label.textContent = labelText;
        
        const toggleContainer = document.createElement('label');
        toggleContainer.className = 'toggle-switch';
        
        const input = document.createElement('input');
        input.type = 'checkbox';
        
        const slider = document.createElement('span');
        slider.className = 'toggle-slider';
        
        input.addEventListener('change', onChangeCallback, { passive: true });
        
        toggleContainer.appendChild(input);
        toggleContainer.appendChild(slider);
        
        row.appendChild(label);
        row.appendChild(toggleContainer);
        return row;
    };

    const autoLeftRow = createToggleRow('Auto-Hide Left Sidebar (Click Outside)', (e) => {
        state.autoHideLeft = e.target.checked;
    });

    const hoverLeftRow = createToggleRow('Show Left Sidebar on Hover', (e) => {
        state.hoverShowLeft = e.target.checked;
        leftEdge.style.display = state.hoverShowLeft ? 'block' : 'none';
        if (state.hoverShowLeft) closeLeft(); // Reset position to test hover
    });

    const autoRightRow = createToggleRow('Auto-Hide Right Sidebar (Click Outside)', (e) => {
        state.autoHideRight = e.target.checked;
    });

    const hoverRightRow = createToggleRow('Show Right Sidebar on Hover', (e) => {
        state.hoverShowRight = e.target.checked;
        rightEdge.style.display = state.hoverShowRight ? 'block' : 'none';
        if (state.hoverShowRight) closeRight(); // Reset position to test hover
    });

    container.appendChild(autoLeftRow);
    container.appendChild(hoverLeftRow);
    container.appendChild(autoRightRow);
    container.appendChild(hoverRightRow);

    // Inject directly into the center settings menu exposed by index.html
    api.ui.registerElement('settings-menu', panel);

})();