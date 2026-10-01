import { state, SUPPORTED_LANGUAGES } from '../state/state.js';
import { dom } from '../dom/dom.js';
import { translateFolder } from '../i18n/i18n.js';

const pendingContentRequests = new Map();

export async function loadHyperlinks() {
    state.hyperlinks = {};

    const fallbackPaths = [
        'modules/hyperlinks/hyperlinks_networking.json',
        'modules/hyperlinks/hyperlinks_linux.json',
        'modules/hyperlinks/hyperlinks_computing.json'
    ];
    const paths = state.hyperlinkPaths.length > 0 ? state.hyperlinkPaths : fallbackPaths;
    const loadPaths = pathsToLoad => Promise.allSettled(pathsToLoad.map(async (path) => {
        try {
            const res = await fetch(`./${path}`);
            if (res.ok) {
                const data = await res.json();
                Object.assign(state.hyperlinks, data);
            }
        } catch {
            console.warn(`Failed to load hyperlink file: ${path}`);
        }
    }));

    await loadPaths(paths);
    if (Object.keys(state.hyperlinks).length === 0 && paths !== fallbackPaths) {
        await loadPaths(fallbackPaths);
    }
}

export async function loadTooltips() {
    state.tooltips = {};
    // Pre-initialize empty objects for all supported languages
    SUPPORTED_LANGUAGES.forEach(lang => state.tooltips[lang] = {});

    const fallbackPaths = ['Linux', 'Windows', 'Networking', 'Security', 'DevOps', 'Programming', 'Integration', 'Computing']
        .flatMap(topic => SUPPORTED_LANGUAGES.map(lang => `modules/tooltips/mouseOverToolTips_${topic}_in${lang}.json`));
    const paths = state.tooltipPaths.length > 0 ? state.tooltipPaths : fallbackPaths;
    const loadPaths = pathsToLoad => Promise.allSettled(SUPPORTED_LANGUAGES.map(async lang => {
        const languagePaths = pathsToLoad.filter(path => path.endsWith(`_in${lang}.json`));
        await Promise.allSettled(languagePaths.map(async path => {
            try {
                const res = await fetch(`./${path}`);
                if (res.ok) {
                    const data = await res.json();
                    Object.assign(state.tooltips[lang], data);
                }
            } catch(e) {
                console.warn(`Failed to load tooltip file: ${path}`);
            }
        }));
    }));

    await loadPaths(paths);
    if (paths !== fallbackPaths) {
        const missingLanguages = SUPPORTED_LANGUAGES.filter(lang => Object.keys(state.tooltips[lang]).length === 0);
        await Promise.all(missingLanguages.map(lang => loadPaths(fallbackPaths.filter(path => path.endsWith(`_in${lang}.json`)))));
    }
}

export async function loadPageRegistry() {
    state.pageRegistry = {};
    await Promise.allSettled(SUPPORTED_LANGUAGES.map(async (lang) => {
        try {
            const res = await fetch(`./languages/pages/pagesLanguage_${lang}.json`);
            if (res.ok) {
                state.pageRegistry[lang] = await res.json();
            } else {
                state.pageRegistry[lang] = {};
            }
        } catch (e) {
            state.pageRegistry[lang] = {};
        }
    }));
}

export async function fetchGitHubTree() {
    try {
        const res = await fetch('https://api.github.com/repos/cmdrFRANKLY1/TheInfoDB/git/trees/main?recursive=1');
        console.log('[tree] status:', res.status, 'ratelimit remaining:', res.headers.get('x-ratelimit-remaining'));
        if (!res.ok) {
            const body = await res.text();
            throw new Error(`GitHub API ${res.status}: ${body.slice(0, 200)}`);
        }
        const data = await res.json();

        // Dynamically extract all hyperlink config files from the tree
        const hyperlinkNodes = (data.tree || []).filter(n => n.type === 'blob' && n.path.startsWith('modules/hyperlinks/') && n.path.endsWith('.json'));
        state.hyperlinkPaths = hyperlinkNodes.map(n => n.path);
        
        // Dynamically extract all tooltip config files from the tree
        const tooltipNodes = (data.tree || []).filter(n => n.type === 'blob' && n.path.startsWith('modules/tooltips/') && n.path.endsWith('.json'));
        state.tooltipPaths = tooltipNodes.map(n => n.path);

        // Discover markdown files
        const allMd = (data.tree || []).filter(n => n.type === 'blob' && n.path.endsWith('.md') && !n.path.startsWith('modules/'));
        console.log('[tree] all content .md paths:', allMd.map(n => n.path));

        if (allMd.length === 0) {
            dom.pagesTree.innerHTML =
                '<div class="text-neutral-500 text-xs p-3 leading-relaxed">' +
                'No .md files found in the repository.' +
                '</div>';
            return;
        }

        // Detect docs root: whichever top-level folder holds the most .md files.
        const counts = {};
        let rootCount = 0;
        allMd.forEach(n => {
            const parts = n.path.split('/');
            if (parts.length === 1) {
                rootCount++;
            } else {
                const top = parts[0];
                counts[top] = (counts[top] || 0) + 1;
            }
        });

        let detectedRoot = '';
        let best = rootCount;
        Object.keys(counts).forEach(k => {
            if (counts[k] > best) {
                best = counts[k];
                detectedRoot = k;
            }
        });

        state.docsRoot = detectedRoot ? (detectedRoot + '/') : '';
        console.log('[tree] detected docs root:', state.docsRoot || '(repo root)', 'with', best, 'md files');

        const pagesMap = {};
        const extractTitle = (filename) => {
            return filename
                .replace(/_in[a-zA-Z]+\.md$/, '')
                .replace(/\.md$/, '');
        };

        const rootPrefix = state.docsRoot;
        allMd.forEach(node => {
            if (!node.path.startsWith(rootPrefix)) return;

            const relativePath = node.path.slice(rootPrefix.length);
            const pathParts = relativePath.split('/');
            const filename = pathParts.pop();
            const displayTitle = extractTitle(filename);

            const dirParts = pathParts.slice();
            while (dirParts.length > 0) {
                const last = dirParts[dirParts.length - 1];
                if (last.toLowerCase() === displayTitle.toLowerCase()) {
                    dirParts.pop();
                } else {
                    break;
                }
            }

            const displayCategoryParts = dirParts.map(p => translateFolder(p));
            const category = displayCategoryParts.join(' / ');
            const id = (dirParts.length > 0 ? `${dirParts.join('/')}/` : '') + displayTitle;

            const langMatch = filename.match(/_in([a-zA-Z]+)\.md$/);
            const lang = langMatch ? langMatch[1] : 'English';

            if (!pagesMap[id]) {
                pagesMap[id] = {
                    id,
                    title: displayTitle,
                    category,
                    rawCategoryParts: dirParts.slice(),
                    categoryParts: displayCategoryParts,
                    paths: {}
                };
            }
            pagesMap[id].paths[lang] = node.path;
        });

        state.pages = Object.values(pagesMap);

        if (state.pages.length === 0) {
            dom.pagesTree.innerHTML =
                '<div class="text-neutral-500 text-xs p-3 leading-relaxed">' +
                `Found ${allMd.length} .md file(s), but none under root "<code class="text-neutral-300">${state.docsRoot || "(repo root)"}</code>."` +
                '</div>';
        }
    } catch (e) {
        console.error('[tree] fetch failed:', e);
        dom.pagesTree.innerHTML =
            `<div class="text-red-500 text-xs p-3 leading-relaxed">` +
            `Failed to load repository tree.<br><br>` +
            `<span class="text-neutral-400">${e.message}</span>` +
            `</div>`;
        dom.dashboardGrid.innerHTML = `<div class="text-red-500 text-sm">Failed to load repository tree: ${e.message}</div>`;
    }
}

export async function fetchContent(path) {
    if (state.fileCache[path]) return state.fileCache[path];
    if (!pendingContentRequests.has(path)) {
        const request = (async () => {
            try {
                const localResponse = await fetch(`./${path}`);
                const contentType = localResponse.headers.get('content-type') || '';
                if (localResponse.ok && !contentType.includes('text/html')) {
                    const text = await localResponse.text();
                    state.fileCache[path] = text;
                    return text;
                }
            } catch {}

            try {
                const remoteResponse = await fetch(`https://raw.githubusercontent.com/cmdrFRANKLY1/TheInfoDB/main/${path}`);
                if (!remoteResponse.ok) return 'Failed to fetch document content.';
                const text = await remoteResponse.text();
                state.fileCache[path] = text;
                return text;
            } catch {
                return 'Network error loading document.';
            }
        })().finally(() => pendingContentRequests.delete(path));
        pendingContentRequests.set(path, request);
    }
    return pendingContentRequests.get(path);
}