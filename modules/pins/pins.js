import { state } from '../state/state.js';
import { dom } from '../dom/dom.js';
// We import showToast from ui.js to display the notification when pinning
import { showToast } from '../ui/ui.js';

export function pinTopic(path, topic, text) {
    state.pinnedTopics.push({ path, topic, text });
    renderPins();
    showToast(state.translations.toastPinned || "Pinned topic");
}

export function renderPins() {
    dom.pinsContainer.innerHTML = '';
    
    // Show the placeholder message if there are no pins
    if (state.pinnedTopics.length === 0) {
        dom.noPinsMsg.style.display = 'block';
        dom.pinsContainer.appendChild(dom.noPinsMsg);
        return;
    }
    
    dom.noPinsMsg.style.display = 'none';

    // Build the DOM elements for each pinned topic
    state.pinnedTopics.forEach((pin, index) => {
        const p = document.createElement('div');
        p.className = "pinned-card bg-[#0a0a0a] border border-neutral-800 rounded p-3 relative group hover:border-neutral-700 transition-colors";

        const removeBtn = document.createElement('button');
        removeBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
        removeBtn.className = "absolute top-2 right-2 text-neutral-600 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity";
        removeBtn.onclick = () => {
            state.pinnedTopics.splice(index, 1);
            renderPins();
        };

        const pathEl = document.createElement('div');
        pathEl.className = "text-[10px] text-neutral-500 font-mono mb-1 truncate pr-4";
        pathEl.textContent = pin.path;

        const titleEl = document.createElement('div');
        titleEl.className = "text-sm font-semibold text-white mb-2";
        titleEl.textContent = pin.topic;

        const preview = document.createElement('div');
        preview.className = "text-xs text-neutral-400 overflow-hidden";
        preview.style.whiteSpace = "pre-wrap";
        preview.style.wordBreak = "break-word";
        preview.textContent = pin.text;
        preview.style.maxHeight = "180px";
        preview.style.overflow = "hidden";

        p.appendChild(removeBtn);
        p.appendChild(pathEl);
        p.appendChild(titleEl);
        p.appendChild(preview);
        dom.pinsContainer.appendChild(p);
    });
}