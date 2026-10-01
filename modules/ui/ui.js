import { state } from '../state/state.js';
import { dom, ICONS } from '../dom/dom.js';
import { fetchContent } from '../api/api.js';
import { translateFolder } from '../i18n/i18n.js';
import { parseAdvancedMarkdown, processBlockContent, assembleTopicMarkdown } from '../markdown/markdown.js';
import { getFileDisplayPath, downloadFile, pickLang, jumpToAnchor } from '../utils/utils.js';
import { pinTopic } from '../pins/pins.js';
import { attachLinkListeners } from '../events/events.js';

export function applyDocFontScope(columnEl, slotTag) {
    if (!columnEl) return;
    const scale = slotTag === '2' ? state.docFontScale2 : state.docFontScale1;
    columnEl.classList.add('doc-scope');
    columnEl.style.setProperty('--doc-scale', String(scale));
}

export function buildDocFontSizeControl(slotTag) {
    const size = document.createElement('select');
    size.className = "toolbar-select";
    size.title = "Document font size";
    [['0.85','85%'],['0.9','90%'],['1','100%'],['1.1','110%'],['1.25','125%'],['1.5','150%']].forEach(([v,l]) => {
        const o = document.createElement('option');
        o.value = v;
        o.textContent = l;
        size.appendChild(o);
    });
    size.value = String(slotTag === '2' ? state.docFontScale2 : state.docFontScale1);

    size.addEventListener('change', () => {
        const val = parseFloat(size.value) || 1;
        if (slotTag === '2') {
            state.docFontScale2 = val;
            localStorage.setItem('docFontScale2', String(val));
            applyDocFontScope(dom.documentContentSecondary, '2');
        } else {
            state.docFontScale1 = val;
            localStorage.setItem('docFontScale1', String(val));
            applyDocFontScope(dom.documentContent, '1');
        }
    });
    return size;
}

export function buildDocViewModeControl(slotTag) {
    const sel = document.createElement('select');
    sel.className = "toolbar-select";
    sel.title = "View mode";
    const modes = [
        ['Stylized', state.translations.viewModeStylized || 'Markdown'],
        ['Raw', state.translations.viewModeRaw || 'Raw']
    ];
    modes.forEach(([v,label]) => {
        const o = document.createElement('option');
        o.value = v;
        o.textContent = label;
        sel.appendChild(o);
    });
    const current = slotTag === '2' ? state.viewMode2 : (state.isSplitView ? state.viewMode1 : state.viewMode);
    sel.value = current;

    sel.addEventListener('change', () => {
        if (state.isSplitView) {
            if (slotTag === '2') state.viewMode2 = sel.value;
            else state.viewMode1 = sel.value;
            renderSplitView();
        } else {
            state.viewMode = sel.value;
            if (state.currentActiveFile) handleFileSelection(state.currentActiveFile);
        }
    });
    return sel;
}

export function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (theme === 'light') {
        dom.themeIconSun.style.display = 'none';
        dom.themeIconMoon.style.display = 'block';
    } else {
        dom.themeIconSun.style.display = 'block';
        dom.themeIconMoon.style.display = 'none';
    }
}

export function showToast(msg) {
    dom.toast.textContent = msg;
    dom.toast.classList.add('show');
    setTimeout(() => dom.toast.classList.remove('show'), 2000);
}

export function renderTree(files, container) {
    container.innerHTML = '';

    if (!files || files.length === 0) {
        container.innerHTML =
            '<div class="text-neutral-500 text-xs p-3 leading-relaxed">No pages to show.</div>';
        return;
    }

    const tree = { folders: {}, files: [] };

    files.forEach(f => {
        let current = tree;
        if (f.categoryParts && f.categoryParts.length > 0) {
            const rawParts = (f.rawCategoryParts && f.rawCategoryParts.length)
                ? f.rawCategoryParts
                : f.categoryParts;
            rawParts.forEach((rawPart, idx) => {
                const displayPart = (f.categoryParts && f.categoryParts[idx]) || translateFolder(rawPart);
                if (!current.folders[rawPart]) {
                    current.folders[rawPart] = {
                        folders: {},
                        files: [],
                        displayName: displayPart
                    };
                }
                current = current.folders[rawPart];
            });
        }
        current.files.push(f);
    });

    function buildDOM(node, containerElement, rawPathPrefix = '') {
        Object.keys(node.folders).sort((a, b) => {
            const da = node.folders[a].displayName || a;
            const db = node.folders[b].displayName || b;
            return da.localeCompare(db);
        }).forEach(rawFolderName => {
            const folderData = node.folders[rawFolderName];
            const rawFolderPath = rawPathPrefix ? `${rawPathPrefix}/${rawFolderName}` : rawFolderName;

            const details = document.createElement('details');
            details.className = "tree-details mb-0.5";
            if (state.treeOpenState[rawFolderPath] !== undefined) {
                details.open = state.treeOpenState[rawFolderPath];
            } else {
                details.open = rawPathPrefix === '';
            }

            details.addEventListener('toggle', () => {
                state.treeOpenState[rawFolderPath] = details.open;
            });

            const summary = document.createElement('summary');
            summary.className = "text-neutral-300 font-medium flex items-center select-none text-xs py-0.5 px-1 rounded";
            summary.innerHTML =
                `<svg width="10" height="10" class="mr-1.5 text-neutral-500 transition-transform duration-200 details-arrow shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>` +
                `<span class="tree-icon mr-1.5 text-neutral-500 group-hover:text-neutral-300">${ICONS.folder}</span>` +
                `<span class="truncate">${folderData.displayName || rawFolderName}</span>`;

            const list = document.createElement('div');
            list.className = "pl-3 ml-1 space-y-0.5 border-l border-neutral-800/60";

            buildDOM(folderData, list, rawFolderPath);
            details.appendChild(summary);
            details.appendChild(list);
            containerElement.appendChild(details);
        });

        node.files.sort((a,b) => a.title.localeCompare(b.title)).forEach(file => {
            const el = document.createElement('div');
            el.className = "text-neutral-400 hover:text-white cursor-pointer py-1 px-1 text-xs flex items-center justify-between group rounded hover:bg-neutral-900";

            const leftPart = document.createElement('div');
            leftPart.className = "flex items-center truncate mr-2 flex-1";
            leftPart.innerHTML =
                `<span class="tree-icon mr-1.5 text-neutral-600 group-hover:text-neutral-400">${ICONS.document}</span>` +
                `<span class="truncate">${file.title}</span>`;

            el.appendChild(leftPart);

            const actionsDiv = document.createElement('div');
            actionsDiv.className = "file-actions flex items-center space-x-1 shrink-0 " + (state.isSplitView ? "" : "hidden");

            const isLeftOpen = state.splitFile1 && state.splitFile1.id === file.id;
            const isRightOpen = state.splitFile2 && state.splitFile2.id === file.id;

            const lBtn = document.createElement('button');
            lBtn.className = "px-1 py-0.5 text-[10px] font-mono border rounded " + (isLeftOpen ? "bg-blue-600 border-blue-500 text-white font-bold" : "bg-neutral-900 hover:bg-neutral-800 border-neutral-700 text-neutral-300 hover:text-white");
            lBtn.textContent = "L";
            lBtn.onclick = (e) => {
                e.stopPropagation();
                state.splitFile1 = file;
                state.slot1Language = pickLang(file);
                renderSplitView();
            };

            const rBtn = document.createElement('button');
            rBtn.className = "px-1 py-0.5 text-[10px] font-mono border rounded " + (isRightOpen ? "bg-emerald-600 border-emerald-500 text-white font-bold" : "bg-neutral-900 hover:bg-neutral-800 border-neutral-700 text-neutral-300 hover:text-white");
            rBtn.textContent = "R";
            rBtn.onclick = (e) => {
                e.stopPropagation();
                state.splitFile2 = file;
                state.slot2Language = pickLang(file);
                renderSplitView();
            };

            actionsDiv.appendChild(lBtn);
            actionsDiv.appendChild(rBtn);
            el.appendChild(actionsDiv);

            el.onclick = () => {
                if (state.isSplitView) {
                    if (!state.splitFile1) {
                        state.splitFile1 = file;
                        state.slot1Language = pickLang(file);
                    } else if (!state.splitFile2) {
                        state.splitFile2 = file;
                        state.slot2Language = pickLang(file);
                    } else {
                        state.splitFile1 = file;
                        state.slot1Language = pickLang(file);
                    }
                    renderSplitView();
                } else {
                    handleFileSelection(file);
                }
            };

            el.oncontextmenu = (e) => {
                e.preventDefault();
                state.contextFile = file;
                dom.contextMenu.style.top = `${e.clientY}px`;
                dom.contextMenu.style.left = `${e.clientX}px`;
                dom.contextMenu.classList.remove('hidden');
            };

            containerElement.appendChild(el);
        });
    }
    buildDOM(tree, container);
}

export function renderDashboard() {
    state.currentActiveFile = null;
    state.splitFile1 = null;
    state.splitFile2 = null;
    dom.contentScrollArea.classList.remove('split-active');
    dom.documentView.classList.add('hidden');
    dom.dashboardView.classList.remove('hidden');
    dom.breadcrumb.textContent = state.translations.dashboardTitle || "Dashboard";

    const shuffled = [...state.pages].sort(() => 0.5 - Math.random());
    dom.dashboardGrid.innerHTML = '';

    shuffled.forEach(file => {
        const card = document.createElement('div');
        card.className = "dashboard-card border border-neutral-800 p-5 rounded-lg bg-[#050505] hover:bg-neutral-900 cursor-pointer transition-all duration-200 hover:border-neutral-700";
        card.innerHTML = `
            <div class="text-xs text-neutral-500 mb-2 font-mono">${getFileDisplayPath(file)}</div>
            <h3 class="text-lg font-bold text-white">${file.title}</h3>
        `;
        card.onclick = () => handleFileSelection(file);
        dom.dashboardGrid.appendChild(card);
    });
}

export async function handleFileSelection(pageObj, preferredLang = null) {
    dom.contentScrollArea.classList.remove('split-active');
    dom.dashboardView.classList.add('hidden');
    dom.documentView.classList.remove('hidden');
    dom.documentView.classList.remove('max-w-[1600px]', 'w-full');
    dom.documentView.classList.add('w-full', 'max-w-[1000px]');
    dom.splitDivider.classList.add('hidden');

    const targetLang = preferredLang || state.uiLanguage;
    const defaultLang = pageObj.paths[targetLang] ? targetLang : pickLang(pageObj);
    state.slot1Language = defaultLang;

    if (state.isSplitView) {
        if (!state.splitFile1) {
            state.splitFile1 = pageObj;
            state.slot1Language = defaultLang;
        } else if (!state.splitFile2) {
            state.splitFile2 = pageObj;
            state.slot2Language = defaultLang;
        } else {
            state.splitFile1 = pageObj;
            state.slot1Language = defaultLang;
        }
        await renderSplitView();
    } else {
        state.currentActiveFile = pageObj;
        state.splitFile1 = null;

        dom.documentContent.classList.remove('split-column');
        dom.documentContentSecondary.classList.add('hidden');
        dom.documentContentSecondary.classList.remove('split-column');

        dom.breadcrumb.textContent = getFileDisplayPath(pageObj);
        dom.documentContent.innerHTML = '<div class="text-neutral-500 mt-10">Loading...</div>';
        const path = pageObj.paths[defaultLang] || pageObj.paths['English'] || Object.values(pageObj.paths)[0];

        if (!path) {
            dom.documentContent.innerHTML = '<div class="text-red-500 mt-10">No content available.</div>';
            return;
        }

        const content = await fetchContent(path);
        applyDocFontScope(dom.documentContent, '1');
        parseAndRenderMarkdownDocument(
            content,
            dom.documentContent,
            pageObj,
            state.viewMode,
            false, '', '1',
            () => { renderDashboard(); },
            state.slot1Language,
            (newLang) => {
                state.slot1Language = newLang;
                handleFileSelection(pageObj, newLang);
            }
        );
    }
}

export async function renderSplitView() {
    state.isSplitView = true;
    dom.contentScrollArea.classList.add('split-active');
    dom.documentView.classList.remove('max-w-[1000px]');
    dom.documentView.classList.add('w-full', 'max-w-[1600px]');
    dom.documentContentSecondary.classList.remove('hidden');
    dom.documentContent.classList.add('split-column');
    dom.documentContentSecondary.classList.add('split-column');
    dom.splitDivider.classList.remove('hidden');

    applyDocFontScope(dom.documentContent, '1');
    applyDocFontScope(dom.documentContentSecondary, '2');

    let breadcrumbParts = [];

    if (state.splitFile1) {
        breadcrumbParts.push(`[1] ${getFileDisplayPath(state.splitFile1)}`);
        dom.documentContent.innerHTML = '<div class="text-neutral-500 mt-10">Loading 1...</div>';
        const path1 = state.splitFile1.paths[state.slot1Language] || state.splitFile1.paths['English'] || Object.values(state.splitFile1.paths)[0];
        const content1 = path1 ? await fetchContent(path1) : "No content available.";
        parseAndRenderMarkdownDocument(
            content1,
            dom.documentContent,
            state.splitFile1,
            state.viewMode1,
            false, '', '1',
            () => { state.splitFile1 = null; renderSplitView(); },
            state.slot1Language,
            (newLang) => { state.slot1Language = newLang; renderSplitView(); },
            '◀ LEFT', '#60a5fa'
        );
    } else {
        dom.documentContent.innerHTML =
            '<div class="column-header" style="color:#60a5fa;">◀ LEFT</div>' +
            '<div class="text-neutral-500 text-center mt-12 p-8 border border-dashed border-neutral-800 rounded-lg">Select topic for Left from the sidebar or click [L]</div>';
    }

    if (state.splitFile2) {
        breadcrumbParts.push(`[2] ${getFileDisplayPath(state.splitFile2)}`);
        dom.documentContentSecondary.innerHTML = '<div class="text-neutral-500 mt-10">Loading 2...</div>';
        const path2 = state.splitFile2.paths[state.slot2Language] || state.splitFile2.paths['English'] || Object.values(state.splitFile2.paths)[0];
        const content2 = path2 ? await fetchContent(path2) : "No content available.";
        parseAndRenderMarkdownDocument(
            content2,
            dom.documentContentSecondary,
            state.splitFile2,
            state.viewMode2,
            false, '', '2',
            () => { state.splitFile2 = null; renderSplitView(); },
            state.slot2Language,
            (newLang) => { state.slot2Language = newLang; renderSplitView(); },
            'RIGHT ▶', '#34d399'
        );
    } else {
        dom.documentContentSecondary.innerHTML =
            '<div class="column-header" style="color:#34d399;">RIGHT ▶</div>' +
            '<div class="text-neutral-500 text-center mt-12 p-8 border border-dashed border-neutral-800 rounded-lg">Select topic for Right from the sidebar or click [R]</div>';
    }

    dom.breadcrumb.textContent = breadcrumbParts.length > 0 ? breadcrumbParts.join(' | ') : "Split View";
    renderTree(state.pages, dom.pagesTree);
}

export function parseAndRenderMarkdownDocument(content, container, fileData, viewModeOverride = null, isSearch = false, query = '', slotTag = '', onClose = null, activeDocLang = 'English', onDocLangChange = null, columnLabel = null, columnColor = null) {
    // Let the markdown engine know which document language is actively being rendered right now
    state.currentRenderingLang = activeDocLang || 'English';

    const effectiveMode = viewModeOverride || state.viewMode;
    const isRaw = effectiveMode === 'Raw';

    const preservedHeader = columnLabel ? (() => {
        const h = document.createElement('div');
        h.className = 'column-header';
        if (columnColor) h.style.color = columnColor;
        h.textContent = columnLabel;
        return h;
    })() : null;

    if (!isSearch) {
        container.innerHTML = '';
        if (preservedHeader) container.appendChild(preservedHeader);
    }

    if (isRaw) {
        const overallWrapper = document.createElement('div');
        overallWrapper.className = 'w-full';

        if (fileData) {
            const slotHeader = document.createElement('div');
            slotHeader.className = "doc-toolbar flex justify-between items-center mb-5 gap-3";

            const titleBadge = document.createElement('span');
            titleBadge.className = "text-xs font-mono text-neutral-400 truncate min-w-0";
            titleBadge.textContent = (slotTag ? `[${slotTag}] ` : "") + getFileDisplayPath(fileData);
            slotHeader.appendChild(titleBadge);

            const rightControls = document.createElement('div');
            rightControls.className = "flex items-center space-x-2 shrink-0";

            rightControls.appendChild(buildDocViewModeControl(slotTag));
            rightControls.appendChild(buildDocFontSizeControl(slotTag));

            const availableLangs = Object.keys(fileData.paths || {});
            if (availableLangs.length > 1) {
                const docLangSelect = document.createElement('select');
                docLangSelect.className = "bg-neutral-900 border border-neutral-700 text-xs text-white rounded px-2 py-1 outline-none";
                availableLangs.forEach(l => {
                    const opt = document.createElement('option');
                    opt.value = l;
                    opt.textContent = l;
                    if (l === activeDocLang) opt.selected = true;
                    docLangSelect.appendChild(opt);
                });
                docLangSelect.onchange = (e) => {
                    if (slotTag === '2') {
                        state.slot2Language = e.target.value;
                        renderSplitView();
                    } else if (onDocLangChange) {
                        onDocLangChange(e.target.value);
                    }
                };
                rightControls.appendChild(docLangSelect);
            }

            const dlDropdown = document.createElement('div');
            dlDropdown.className = "dropdown relative";
            dlDropdown.tabIndex = 0;
            dlDropdown.innerHTML = `
                <button class="doc-action-btn text-neutral-300 hover:text-white border border-neutral-700 rounded hover:bg-neutral-800" title="Download">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                </button>
                <div class="dropdown-content mt-1">
                    <button class="dl-txt-btn">Textfile</button>
                    <button class="dl-md-btn">Markdown</button>
                </div>
            `;
            dlDropdown.querySelector('.dl-txt-btn').onclick = () => downloadFile(`${fileData.title}.txt`, content);
            dlDropdown.querySelector('.dl-md-btn').onclick = () => downloadFile(`${fileData.title}.md`, content);
            rightControls.appendChild(dlDropdown);

            if (onClose) {
                const closeBtn = document.createElement('button');
                closeBtn.className = "doc-action-btn text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded";
                closeBtn.innerHTML = `<span>✕</span>`;
                closeBtn.onclick = onClose;
                rightControls.appendChild(closeBtn);
            }

            slotHeader.appendChild(rightControls);
            overallWrapper.appendChild(slotHeader);
        }

        const rawBox = document.createElement('div');
        rawBox.className = 'panel-raw';
        rawBox.textContent = content;
        overallWrapper.appendChild(rawBox);
        container.appendChild(overallWrapper);
        return;
    }

    const overallWrapper = document.createElement('div');
    overallWrapper.className = 'w-full';

    if (fileData) {
        const slotHeader = document.createElement('div');
        slotHeader.className = "doc-toolbar flex justify-between items-center mb-5 gap-3";

        const titleBadge = document.createElement('span');
        titleBadge.className = "text-xs font-mono text-neutral-400 truncate min-w-0";
        titleBadge.textContent = (slotTag ? `[${slotTag}] ` : "") + getFileDisplayPath(fileData);
        slotHeader.appendChild(titleBadge);

        const rightControls = document.createElement('div');
        rightControls.className = "flex items-center space-x-2 shrink-0";

        rightControls.appendChild(buildDocViewModeControl(slotTag));
        rightControls.appendChild(buildDocFontSizeControl(slotTag));

        const availableLangs = Object.keys(fileData.paths || {});
        if (availableLangs.length > 1) {
            const docLangSelect = document.createElement('select');
            docLangSelect.className = "bg-neutral-900 border border-neutral-700 text-xs text-white rounded px-2 py-1 outline-none";
            availableLangs.forEach(l => {
                const opt = document.createElement('option');
                opt.value = l;
                opt.textContent = l;
                if (l === activeDocLang) opt.selected = true;
                docLangSelect.appendChild(opt);
            });
            docLangSelect.onchange = (e) => {
                if (slotTag === '2') {
                    state.slot2Language = e.target.value;
                    renderSplitView();
                } else if (onDocLangChange) {
                    onDocLangChange(e.target.value);
                }
            };
            rightControls.appendChild(docLangSelect);
        }

        const dlDropdown = document.createElement('div');
        dlDropdown.className = "dropdown relative";
        dlDropdown.tabIndex = 0;
        dlDropdown.innerHTML = `
            <button class="doc-action-btn text-neutral-300 hover:text-white border border-neutral-700 rounded hover:bg-neutral-800" title="Download">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            </button>
            <div class="dropdown-content mt-1">
                <button class="dl-txt-btn">Textfile</button>
                <button class="dl-md-btn">Markdown</button>
            </div>
        `;
        dlDropdown.querySelector('.dl-txt-btn').onclick = () => downloadFile(`${fileData.title}.txt`, content);
        dlDropdown.querySelector('.dl-md-btn').onclick = () => downloadFile(`${fileData.title}.md`, content);
        rightControls.appendChild(dlDropdown);

        if (onClose) {
            const closeBtn = document.createElement('button');
            closeBtn.className = "doc-action-btn text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded";
            closeBtn.innerHTML = `<span>✕</span>`;
            closeBtn.onclick = onClose;
            rightControls.appendChild(closeBtn);
        }

        slotHeader.appendChild(rightControls);
        overallWrapper.appendChild(slotHeader);
    }

    const mainSections = parseAdvancedMarkdown(content);
    const displayPath = getFileDisplayPath(fileData);

    mainSections.forEach((section, secIdx) => {
        if (isSearch && query) {
            const q = query.toLowerCase();
            const matches = section.title.toLowerCase().includes(q)
                || (section.intro || '').toLowerCase().includes(q)
                || section.subtopics.some(s =>
                    s.title.toLowerCase().includes(q) ||
                    s.contentLines.join('\n').toLowerCase().includes(q));
            if (!matches) return;
        }

        const mainSectionDiv = document.createElement('div');
        mainSectionDiv.className = 'panel-stylized';
        const anchorId = `${slotTag || 'doc'}-h1-${secIdx}`;
        mainSectionDiv.id = anchorId;

        const headerBar = document.createElement('div');
        headerBar.className = "group flex justify-between items-start mb-4 gap-3";

        const titleWrap = document.createElement('div');
        titleWrap.className = "min-w-0";

        const headingEl = document.createElement('h1');
        headingEl.className = "text-2xl font-bold text-white tracking-tight truncate";
        headingEl.textContent = section.title;
        titleWrap.appendChild(headingEl);
        headerBar.appendChild(titleWrap);

        const actions = document.createElement('div');
        actions.className = "hover-actions flex items-center gap-2";

        if (isSearch) {
            const jumpToTopicBtn = document.createElement('button');
            jumpToTopicBtn.className = "text-neutral-500 hover:text-white flex items-center text-xs space-x-1";
            jumpToTopicBtn.title = "Jump to section";
            jumpToTopicBtn.innerHTML = `
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="12" x2="15" y2="12"></line>
                    <line x1="3" y1="18" x2="11" y2="18"></line>
                    <polyline points="17 14 20 17 23 14"></polyline>
                </svg>
            `;
            jumpToTopicBtn.onclick = async () => {
                dom.qsInput.value = '';
                dom.qsClear.classList.add('hidden');
                dom.pageSearchInput.value = '';
                dom.pageSearchClear.classList.add('hidden');
                renderTree(state.pages, dom.pagesTree);
                await handleFileSelection(fileData);
                setTimeout(() => {
                    jumpToAnchor(anchorId, slotTag || '1');
                    showToast(`Jumped to ${getFileDisplayPath(fileData)} / ${section.title}`);
                }, 150);
            };
            actions.appendChild(jumpToTopicBtn);
        }

        const pinBtn = document.createElement('button');
        pinBtn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="17" x2="12" y2="22"></line><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path></svg>';
        pinBtn.className = "text-neutral-500 hover:text-white";
        pinBtn.title = "Pin topic (with all subtopics)";
        pinBtn.onclick = () => {
            const fullMd = assembleTopicMarkdown(section);
            pinTopic(displayPath, section.title, fullMd);
        };
        actions.appendChild(pinBtn);

        const copyBtn = document.createElement('button');
        copyBtn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
        copyBtn.className = "text-neutral-500 hover:text-white";
        copyBtn.title = "Copy topic (with all subtopics)";
        copyBtn.onclick = () => {
            const fullMd = assembleTopicMarkdown(section);
            navigator.clipboard.writeText(fullMd).then(() => showToast(state.translations.toastCopied));
        };
        actions.appendChild(copyBtn);

        headerBar.appendChild(actions);
        mainSectionDiv.appendChild(headerBar);

        if (section.intro) {
            if (!isSearch || !query || section.intro.toLowerCase().includes(query.toLowerCase())) {
                const introDiv = document.createElement('div');
                introDiv.className = "text-neutral-300 text-sm leading-relaxed mb-2";
                introDiv.innerHTML = section.intro;
                mainSectionDiv.appendChild(introDiv);
            }
        }

        section.subtopics.forEach((sub, subIdx) => {
            const subText = processBlockContent(sub.contentLines);
            const rawSubText = sub.contentLines.join('\n').trim();
            if (isSearch && query
                && !sub.title.toLowerCase().includes(query.toLowerCase())
                && !rawSubText.toLowerCase().includes(query.toLowerCase())) {
                return;
            }

            const subAnchorId = `${slotTag || 'doc'}-h${sub.level}-${secIdx}-${subIdx}`;

            if (sub.level === 3) {
                const h3Wrap = document.createElement('div');
                h3Wrap.className = 'h3-block relative group';
                h3Wrap.id = subAnchorId;

                const h3TopRow = document.createElement('div');
                h3TopRow.className = "flex justify-between items-start mb-1.5 gap-3";

                const h3Title = document.createElement('div');
                h3Title.className = "text-[11px] font-semibold text-neutral-300 uppercase tracking-wider";
                h3Title.textContent = sub.title;
                h3TopRow.appendChild(h3Title);

                const h3Actions = document.createElement('div');
                h3Actions.className = "hover-actions flex items-center gap-1.5";

                if (isSearch) {
                    const h3JumpBtn = document.createElement('button');
                    h3JumpBtn.className = "text-neutral-500 hover:text-white flex items-center text-xs space-x-1";
                    h3JumpBtn.title = "Jump to subtopic";
                    h3JumpBtn.innerHTML = `
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="12" x2="15" y2="12"></line>
                            <line x1="3" y1="18" x2="11" y2="18"></line>
                            <polyline points="17 14 20 17 23 14"></polyline>
                        </svg>
                    `;
                    h3JumpBtn.onclick = async () => {
                        dom.qsInput.value = '';
                        dom.qsClear.classList.add('hidden');
                        dom.pageSearchInput.value = '';
                        dom.pageSearchClear.classList.add('hidden');
                        renderTree(state.pages, dom.pagesTree);
                        await handleFileSelection(fileData);
                        setTimeout(() => {
                            jumpToAnchor(subAnchorId, slotTag || '1');
                            showToast(`Jumped to ${getFileDisplayPath(fileData)} / ${section.title} / ${sub.title}`);
                        }, 150);
                    };
                    h3Actions.appendChild(h3JumpBtn);
                }

                const h3PinBtn = document.createElement('button');
                h3PinBtn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="17" x2="12" y2="22"></line><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path></svg>';
                h3PinBtn.className = "text-neutral-500 hover:text-white";
                h3PinBtn.title = "Pin subtopic";
                h3PinBtn.onclick = () => pinTopic(displayPath, `${section.title} > ${sub.title}`, `### ${sub.title}\n\n${rawSubText}`);
                h3Actions.appendChild(h3PinBtn);

                const h3CopyBtn = document.createElement('button');
                h3CopyBtn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
                h3CopyBtn.className = "text-neutral-500 hover:text-white";
                h3CopyBtn.onclick = () => {
                    navigator.clipboard.writeText(`### ${sub.title}\n\n${rawSubText}`).then(() => showToast(state.translations.toastCopied));
                };
                h3Actions.appendChild(h3CopyBtn);

                h3TopRow.appendChild(h3Actions);
                h3Wrap.appendChild(h3TopRow);

                const h3Body = document.createElement('div');
                h3Body.className = "text-neutral-300 text-sm leading-relaxed";
                h3Body.innerHTML = subText;
                h3Wrap.appendChild(h3Body);

                mainSectionDiv.appendChild(h3Wrap);
            } else {
                const subtopicPanel = document.createElement('div');
                subtopicPanel.className = 'subtopic-panel group';
                subtopicPanel.id = subAnchorId;

                const subHeader = document.createElement('div');
                subHeader.className = "flex justify-between items-start mb-2 gap-3";

                const subTitleEl = document.createElement('h2');
                subTitleEl.className = "text-base font-semibold text-white";
                subTitleEl.textContent = sub.title;
                subHeader.appendChild(subTitleEl);

                const subActions = document.createElement('div');
                subActions.className = "hover-actions flex items-center gap-2";

                if (isSearch) {
                    const subJumpBtn = document.createElement('button');
                    subJumpBtn.className = "text-neutral-500 hover:text-white flex items-center text-xs space-x-1";
                    subJumpBtn.title = "Jump to subtopic";
                    subJumpBtn.innerHTML = `
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="12" x2="15" y2="12"></line>
                            <line x1="3" y1="18" x2="11" y2="18"></line>
                            <polyline points="17 14 20 17 23 14"></polyline>
                        </svg>
                    `;
                    subJumpBtn.onclick = async () => {
                        dom.qsInput.value = '';
                        dom.qsClear.classList.add('hidden');
                        dom.pageSearchInput.value = '';
                        dom.pageSearchClear.classList.add('hidden');
                        renderTree(state.pages, dom.pagesTree);
                        await handleFileSelection(fileData);
                        setTimeout(() => {
                            jumpToAnchor(subAnchorId, slotTag || '1');
                            showToast(`Jumped to ${getFileDisplayPath(fileData)} / ${section.title} / ${sub.title}`);
                        }, 150);
                    };
                    subActions.appendChild(subJumpBtn);
                }

                const subPinBtn = document.createElement('button');
                subPinBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="17" x2="12" y2="22"></line><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path></svg>';
                subPinBtn.className = "text-neutral-500 hover:text-white";
                subPinBtn.title = "Pin subtopic";
                subPinBtn.onclick = () => pinTopic(displayPath, `${section.title} > ${sub.title}`, `## ${sub.title}\n\n${rawSubText}`);
                subActions.appendChild(subPinBtn);

                const subCopyBtn = document.createElement('button');
                subCopyBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
                subCopyBtn.className = "text-neutral-500 hover:text-white";
                subCopyBtn.onclick = () => {
                    navigator.clipboard.writeText(`## ${sub.title}\n\n${rawSubText}`).then(() => showToast(state.translations.toastCopied));
                };
                subActions.appendChild(subCopyBtn);

                subHeader.appendChild(subActions);
                subtopicPanel.appendChild(subHeader);

                if (subText) {
                    const subContentDiv = document.createElement('div');
                    subContentDiv.className = "text-neutral-300 text-sm leading-relaxed";
                    subContentDiv.innerHTML = subText;
                    subtopicPanel.appendChild(subContentDiv);
                }

                mainSectionDiv.appendChild(subtopicPanel);
            }
        });

        overallWrapper.appendChild(mainSectionDiv);
    });

    container.appendChild(overallWrapper);
    attachLinkListeners(container);
}