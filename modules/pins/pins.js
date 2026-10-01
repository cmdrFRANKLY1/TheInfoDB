import { state } from '../state/state.js';
import { dom } from '../dom/dom.js';
import { showToast } from '../ui/ui.js';

export function pinTopic(path, topic, text) {
    state.pinnedTopics.push({ path, topic, text });
    renderPins();
    showToast(state.translations?.toastPinned || "Pinned topic");
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

    // Separate cell pins from full topic pins
    const cellPins = [];
    const topicPins = [];
    
    state.pinnedTopics.forEach((pin, originalIndex) => {
        if (pin.text.startsWith('[Cell] ')) {
            cellPins.push({ ...pin, originalIndex });
        } else {
            topicPins.push({ ...pin, originalIndex });
        }
    });

    // 1. Render Pinned Cells Embedded List Panel
    if (cellPins.length > 0) {
        const listPanel = document.createElement('div');
        // Give it an "embedded" inset look
        listPanel.className = "pinned-card bg-[#050505] border border-neutral-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] rounded-lg p-2.5 mb-4";
        
        const listHeader = document.createElement('div');
        listHeader.className = "flex items-center justify-between mb-2 px-1";

        const headerTitle = document.createElement('div');
        headerTitle.className = "text-[10px] font-bold text-neutral-500 uppercase tracking-wider";
        headerTitle.textContent = `Pinned Cells (${cellPins.length})`;

        // Global Copy All Button
        const copyAllBtn = document.createElement('button');
        copyAllBtn.className = "flex items-center gap-1 text-[9px] uppercase font-bold text-neutral-500 hover:text-white transition-colors bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 px-1.5 py-0.5 rounded";
        copyAllBtn.title = "Copy all cells to clipboard";
        copyAllBtn.innerHTML = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> <span>Copy All</span>`;
        copyAllBtn.onclick = () => {
            const allText = cellPins.map(p => p.text.replace('[Cell] ', '')).join('\n');
            navigator.clipboard.writeText(allText).then(() => showToast(state.translations?.toastCopied || 'Copied!'));
        };

        listHeader.appendChild(headerTitle);
        listHeader.appendChild(copyAllBtn);
        listPanel.appendChild(listHeader);

        // Container for items - tightly packed, with borders
            const listContainer = document.createElement('ul');
            listContainer.className = "flex flex-col m-0 p-0 list-none bg-[#0a0a0a] border border-neutral-800/60 rounded overflow-hidden";

            cellPins.forEach((pin) => {
            const li = document.createElement('li');
            li.className = "group relative flex items-center justify-between py-0.5 px-4 min-h-[25px] hover:bg-neutral-900 text-neutral-300 border-b border-neutral-800/50 last:border-0";
            
            const rawText = pin.text.replace('[Cell] ', '');

            const textWrap = document.createElement('span');
            textWrap.className = "truncate pr-12 select-all font-mono text-[11px] cursor-text leading-tight flex-1";
            textWrap.textContent = rawText;
            
            // Action container: floats to right on hover
            const actionContainer = document.createElement('div');
            actionContainer.className = "absolute right-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 bg-[#0a0a0a] group-hover:bg-neutral-900 rounded shadow-[0_0_4px_rgba(0,0,0,0.4)] pl-1";

            // Per-line Copy Button
            const copyBtn = document.createElement('button');
            copyBtn.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
            copyBtn.className = "text-neutral-500 hover:text-white p-1 rounded hover:bg-neutral-800";
            copyBtn.title = "Copy cell";
            copyBtn.onclick = () => {
                navigator.clipboard.writeText(rawText).then(() => showToast(state.translations?.toastCopied || 'Copied!'));
            };

            // Remove Button
            const removeBtn = document.createElement('button');
            removeBtn.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
            removeBtn.className = "text-neutral-500 hover:text-red-400 p-1 rounded hover:bg-neutral-800";
            removeBtn.title = "Remove cell from pins";
            removeBtn.onclick = () => {
                state.pinnedTopics.splice(pin.originalIndex, 1);
                renderPins();
            };

            actionContainer.appendChild(copyBtn);
            actionContainer.appendChild(removeBtn);

            li.title = `From: ${pin.path}\nSection: ${pin.topic}`;
            li.appendChild(textWrap);
            li.appendChild(actionContainer);
            listContainer.appendChild(li);
        });

        listPanel.appendChild(listContainer);
        dom.pinsContainer.appendChild(listPanel);
    }

    // 2. Build the DOM elements for each full pinned topic
    topicPins.forEach((pin) => {
        const p = document.createElement('div');
        p.className = "pinned-card bg-[#0a0a0a] border border-neutral-800 rounded p-3 relative group hover:border-neutral-700 transition-colors mb-3";

        const removeBtn = document.createElement('button');
        removeBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
        removeBtn.className = "absolute top-2 right-2 text-neutral-600 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity p-1";
        removeBtn.onclick = () => {
            state.pinnedTopics.splice(pin.originalIndex, 1);
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
