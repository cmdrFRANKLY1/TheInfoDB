let localIndex = [];
let tooltipDictionary = {};
let isModuleInitialized = false;

// Dynamic Word Colors based on string hash
const WORD_COLORS = ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93', '#f15bb5', '#00bbf9', '#00f5d4', '#fb5607', '#ff006e', '#8338ec', '#3a86ff'];
function getWordColor(word) {
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
        hash = word.charCodeAt(i) + ((hash << 5) - hash);
    }
    return WORD_COLORS[Math.abs(hash) % WORD_COLORS.length];
}

// Supported file extensions for indexing
const TEXT_EXTS = ['.md', '.txt', '.csv'];
const BINARY_EXTS = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'];

// Safely fetch text data
async function safeFetchText(url) {
    try {
        const response = await fetch(url);
        if (response.ok) return await response.text();
        console.warn(`Fetch failed for ${url}: ${response.statusText}`);
    } catch (e) {
        console.warn(`Network error fetching ${url}.`, e);
    }
    return null;
}

// Recursively search for and index supported files from root registry
async function loadRegistries(url = 'pages/registryForPages.json') {
    const ext = url.split('.').pop().toLowerCase();
    
    // 1. If it's a JSON registry, fetch and recurse
    if (ext === 'json') {
        if (!url.toLowerCase().includes('registry')) return; // Ignore non-registry configs
        
        const textData = await safeFetchText(url);
        if (!textData) return;
        
        try {
            const registry = JSON.parse(textData);
            if (registry.files && Array.isArray(registry.files)) {
                for (const fileUrl of registry.files) {
                    await loadRegistries(fileUrl);
                }
            }
        } catch (e) {
            console.error(`Error parsing JSON registry ${url}:`, e);
        }
    } 
    // 2. If it's a Text-based document, fetch content and index
    else if (TEXT_EXTS.includes(`.${ext}`)) {
        const textData = await safeFetchText(url);
        if (textData) {
            indexTextDocument(url, textData, ext);
        }
    }
    // 3. If it's a Binary document, index metadata only (don't fetch content to avoid corruption)
    else if (BINARY_EXTS.includes(`.${ext}`)) {
        indexBinaryDocument(url, ext);
    }
}

// Load tooltips from the tooltip registry
async function loadTooltips() {
    try {
        const textData = await safeFetchText('modules/search/resources/tooltips/registryForTooltips.json');
        if (!textData) return;
        
        const registry = JSON.parse(textData);
        if (registry.files && Array.isArray(registry.files)) {
            for (const fileUrl of registry.files) {
                try {
                    const tRes = await safeFetchText(fileUrl);
                    if (tRes) {
                        const tooltips = JSON.parse(tRes);
                        
                        // Extract Topic by removing 'tooltips_for' and '.json'
                        const filename = fileUrl.split('/').pop();
                        const topicMatch = filename.match(/tooltips_for(.*?)\.json/i);
                        const topic = topicMatch ? topicMatch[1] : filename.replace('.json', '');
                        
                        tooltips.forEach(t => {
                            const wordLower = t.word.toLowerCase();
                            if (!tooltipDictionary[wordLower]) tooltipDictionary[wordLower] = [];
                            tooltipDictionary[wordLower].push({ topic: topic, description: t.description });
                        });
                    }
                } catch (e) {
                    console.warn(`Failed parsing tooltip file ${fileUrl}:`, e);
                }
            }
        }
    } catch (e) {
        console.warn("Could not load tooltips registry:", e);
    }
}

// Indexing logic for readable text files (MD, CSV, TXT)
function indexTextDocument(url, content, ext) {
    let title = url.split('/').pop();
    let summary = 'Document contents...';
    let tags = [ext];

    if (ext === 'md') {
        const titleMatch = content.match(/^#\s+(.+)$/m);
        if (titleMatch) title = titleMatch[1].trim();

        const explicitSummaryMatch = content.match(/##\s*(?:What is|Summary).*?\n([\s\S]*?)(?:#|$)/i);
        if (explicitSummaryMatch && explicitSummaryMatch[1].trim().length > 10) {
            summary = explicitSummaryMatch[1].replace(/\n/g, ' ').trim();
        } else {
            const firstLine = content.split('\n').find(l => l.trim() && !l.match(/^[#|>\-*\d]/) && !l.startsWith('!['));
            if (firstLine) summary = firstLine.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1').replace(/[`*_]/g, '');
        }

        const tagsMatch = content.match(/#\s*Tags\s*\n([\s\S]*?)(?:#|$)/i);
        if (tagsMatch) {
            tags = tags.concat(tagsMatch[1].replace(/`/g, '').split(',').map(t => t.trim().toLowerCase()));
        }
    } else if (ext === 'csv') {
        title = title.replace('.csv', ' (Spreadsheet)');
        const lines = content.split('\n').length;
        summary = `Spreadsheet data containing approximately ${lines} rows.`;
        tags.push('spreadsheet', 'data', 'table');
    } else if (ext === 'txt') {
        title = title.replace('.txt', ' (Text Note)');
        summary = content.substring(0, 150).replace(/\n/g, ' ') + '...';
        tags.push('notes');
    }

    if (summary.length > 180) summary = summary.substring(0, 180).trim() + '...';

    localIndex.push({
        id: url,
        title: title,
        summary: summary,
        tags: tags,
        url: url,
        rawContent: content,
        type: ext,
        searchableText: content.toLowerCase()
    });
}

// Indexing logic for binary files (PDF, DOCX, XLSX)
function indexBinaryDocument(url, ext) {
    const title = url.split('/').pop();
    localIndex.push({
        id: url,
        title: title,
        summary: `${ext.toUpperCase()} Document File. Select to preview or download.`,
        tags: [ext, 'document', 'file', 'binary'],
        url: url,
        rawContent: '',
        type: ext,
        searchableText: title.toLowerCase()
    });
}

// Fetch related concepts using Datamuse API
async function fetchRelatedTopics(query) {
    try {
        const response = await fetch(`https://api.datamuse.com/words?ml=${encodeURIComponent(query)}&max=5`);
        if (response.ok) {
            const data = await response.json();
            return data.map(item => item.word);
        }
    } catch (e) {
        console.warn("Could not fetch related topics:", e);
    }
    return [];
}

// Fetch Wikipedia results
async function fetchWikipediaResults(query) {
    try {
        const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json&origin=*`);
        if (response.ok) {
            const data = await response.json();
            return data.query.search.map(item => ({
                id: `wiki-${item.pageid}`,
                title: item.title,
                summary: item.snippet + '...',
                url: `https://en.wikipedia.org/?curid=${item.pageid}`,
                source: 'Wikipedia',
                type: 'web'
            }));
        }
    } catch (e) {
        console.warn("Could not fetch Wikipedia results:", e);
    }
    return [];
}

// Fetch a featured snippet for exact matches
async function fetchFeaturedAnswer(query, localResults) {
    try {
        const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=1&explaintext=1&redirects=1&titles=${encodeURIComponent(query)}&origin=*`;
        const response = await fetch(wikiUrl);
        if (response.ok) {
            const data = await response.json();
            if (data.query && data.query.pages) {
                const page = Object.values(data.query.pages)[0];
                if (page && page.pageid && page.extract) {
                    let snippet = page.extract.split(/(?<=\.)\s+/).slice(0, 3).join(' ');
                    if (snippet.length > 600) snippet = snippet.substring(0, 600) + '...';
                    return {
                        title: page.title,
                        content: snippet,
                        source: 'Wikipedia',
                        url: `https://en.wikipedia.org/?curid=${page.pageid}`
                    };
                }
            }
        }
    } catch (e) {
        console.warn("Featured Wiki fetch failed:", e);
    }

    const queryLower = query.toLowerCase();
    const localMatch = localResults.find(doc => {
        const noExt = doc.title.replace(/\.[^/.]+$/, "").toLowerCase();
        return noExt === queryLower || doc.title.toLowerCase() === queryLower;
    });
    
    if (localMatch && localMatch.type === 'md') {
        const explicitSummaryMatch = localMatch.rawContent.match(/##\s*(?:What is|What if|Summary|About).*?\n([\s\S]*?)(?:#|$)/i);
        let contentToShow = localMatch.summary;
        
        if (explicitSummaryMatch && explicitSummaryMatch[1].trim().length > 10) {
            contentToShow = explicitSummaryMatch[1].replace(/\n/g, ' ').trim();
            contentToShow = contentToShow.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1').replace(/[`*_]/g, '');
            if (contentToShow.length > 600) contentToShow = contentToShow.substring(0, 600) + '...';
        }
        
        return {
            title: localMatch.title,
            content: contentToShow,
            source: 'Local Database',
            originalDoc: localMatch
        };
    }

    return null;
}

async function performSearch(query) {
    const searchStr = query.toLowerCase().trim();
    if (!searchStr) return null;

    const localResults = localIndex.filter(doc => {
        const inTitle = doc.title.toLowerCase().includes(searchStr);
        const inTags = doc.tags.some(tag => tag.includes(searchStr));
        const inContent = doc.searchableText.includes(searchStr);
        return inTitle || inTags || inContent;
    }).map(doc => ({ ...doc, source: 'Local Database' }));

    const relatedTopics = await fetchRelatedTopics(query);
    const webResults = await fetchWikipediaResults(query);
    const featured = await fetchFeaturedAnswer(query, localResults);

    return { local: localResults, web: webResults, related: relatedTopics, featured: featured };
}

function parseMarkdown(md) {
    let html = md;
    html = html.replace(/^### (.*$)/gim, '<h4 class="text-lg font-semibold mt-4 mb-2 text-white">$1</h4>');
    html = html.replace(/^## (.*$)/gim, '<h3 class="text-xl font-bold mt-5 mb-2 text-white border-b border-[var(--border-color)] pb-1">$1</h3>');
    html = html.replace(/^# (.*$)/gim, '<h2 class="text-2xl font-bold mt-6 mb-3 text-[var(--accent-color)]">$1</h2>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em class="text-[var(--text-muted)]">$1</em>');
    html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-[var(--bg-primary)] p-3 rounded my-2 overflow-x-auto text-sm font-mono border border-[var(--border-color)] text-[var(--text-normal)]">$1</pre>');
    html = html.replace(/`([^`]+)`/g, '<code class="bg-[var(--bg-primary)] px-1.5 py-0.5 rounded text-sm font-mono text-[var(--accent-color)]">$1</code>');
    html = html.replace(/^\s*\*\s(.*)/gim, '<li class="ml-4 list-disc mb-1">$1</li>');
    html = html.replace(/\|(.+)\|/g, (match, p1) => {
        if (p1.includes('---')) return '';
        const cells = p1.split('|').filter(c => c.trim() !== '').map(c => `<td class="border border-[var(--border-color)] p-2 text-sm">${c.trim()}</td>`).join('');
        return `<tr class="border-b border-[var(--border-color)] hover:bg-[var(--bg-primary)]/50">${cells}</tr>\n`;
    });
    html = html.replace(/(<tr class="[^"]+">.*?<\/tr>\n)+/g, match => `<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-[var(--border-color)]">${match}</table></div>`);
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-[var(--accent-color)] hover:underline">$1</a>');
    html = html.replace(/\n\n/g, '<br><br>');
    return html;
}

function parseCSV(csv) {
    if (!csv) return '';
    const lines = csv.split('\n').filter(l => l.trim().length > 0);
    if (lines.length === 0) return 'Empty spreadsheet';
    
    let html = '<div class="overflow-x-auto my-4"><table class="w-full border-collapse text-sm">';
    lines.forEach((line, i) => {
        const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        html += `<tr class="${i === 0 ? 'bg-[var(--bg-primary)] text-white' : 'hover:bg-[var(--bg-primary)]/50 border-b border-[var(--border-color)]'}">`;
        cols.forEach(c => {
            let val = c.trim().replace(/^"|"$/g, '');
            html += `<t${i === 0 ? 'h' : 'd'} class="border border-[var(--border-color)] p-2 text-left">${val}</t${i === 0 ? 'h' : 'd'}>`;
        });
        html += '</tr>';
    });
    html += '</table></div>';
    return html;
}

function generateIframeViewer(url, ext) {
    if (ext === 'pdf') {
        return `<iframe src="${url}" class="w-full h-[600px] border-0 rounded bg-white mt-4 shadow-inner"></iframe>`;
    } else {
        const absUrl = new URL(url, window.location.href).href;
        return `
            <div class="mb-4 mt-4 bg-blue-900/30 border border-blue-500/50 text-blue-200 p-4 rounded text-sm flex flex-col gap-2 shadow-lg">
            <div class="flex items-center font-bold text-white"><i class="fa-solid fa-cloud-arrow-down mr-2 text-blue-400"></i> Document Viewer</div>
            <p>Office files (.docx, .xlsx) require a public network connection to preview via Google Docs. If it fails to load below on a local server, please download it directly.</p>
            <a href="${url}" download class="inline-block self-start mt-2 bg-[var(--accent-color)] text-white px-4 py-2 rounded hover:brightness-110 transition-all"><i class="fa-solid fa-download mr-1"></i> Download Original File</a>
        </div>
        <iframe src="https://docs.google.com/gview?url=${encodeURIComponent(absUrl)}&embedded=true" class="w-full h-[600px] border-0 rounded bg-white shadow-inner"></iframe>
    `;
    }
}

// Wraps text nodes checking for tooltips AND >4 letter words for potential Wikipedia processing
function wrapWordsInNode(node) {
    const excludeTags = new Set(['PRE', 'CODE', 'A', 'STYLE', 'SCRIPT', 'BUTTON', 'H1', 'H2', 'H3', 'H4']);
    if (node.nodeType === Node.TEXT_NODE) {
        if (!node.nodeValue.trim()) return;
        const fragment = document.createDocumentFragment();
        const words = node.nodeValue.split(/([^\w'-]+)/); 
        
        words.forEach(word => {
            const wordLower = word.toLowerCase();
            const hasTooltip = tooltipDictionary.hasOwnProperty(wordLower);
            
            if (hasTooltip) { 
                const defs = tooltipDictionary[wordLower];
                const wordColor = getWordColor(wordLower);

                const span = document.createElement('span');
                span.className = 'entity-word transition-colors duration-300 cursor-help underline decoration-dashed underline-offset-4 font-medium';
                span.textContent = word;
                span.dataset.rawWord = word;
                span.dataset.hasTooltip = "true";
                
                // Dynamically apply the color assigned to this specific word
                span.style.color = wordColor;
                span.style.textDecorationColor = wordColor;
                
                fragment.appendChild(span);
            } else {
                fragment.appendChild(document.createTextNode(word));
            }
        });
        node.parentNode.replaceChild(fragment, node);
    } else if (node.nodeType === Node.ELEMENT_NODE && !excludeTags.has(node.tagName)) {
        Array.from(node.childNodes).forEach(wrapWordsInNode);
    }
}

// Attach tooltip hover events
function attachTooltips(container) {
    // Ensure tooltip element exists in DOM body
    let tooltipEl = document.getElementById('global-knowledge-tooltip');
    if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.id = 'global-knowledge-tooltip';
        tooltipEl.className = 'fixed hidden z-[9999] max-w-sm bg-[var(--bg-secondary)] border border-[var(--border-color)] p-4 rounded-lg shadow-2xl text-[var(--text-normal)] text-sm pointer-events-none transition-opacity duration-150 opacity-0';
        document.body.appendChild(tooltipEl);
    }

    const spans = container.querySelectorAll('.entity-word[data-has-tooltip="true"]');
    spans.forEach(span => {
        span.addEventListener('mouseenter', () => {
            const wordLower = span.dataset.rawWord.toLowerCase();
            const defs = tooltipDictionary[wordLower];
            if (!defs) return;
            
            const primaryColor = getWordColor(wordLower);
            let html = `<div class="font-bold mb-3 text-lg capitalize border-b border-[var(--border-color)] pb-1" style="color: ${primaryColor};">${wordLower}</div>`;
            
            defs.forEach(d => {
                html += `
                    <div class="mb-3 last:mb-0">
                        <span class="text-xs uppercase font-bold tracking-widest block mb-1" style="color: ${primaryColor}; filter: brightness(1.2);">
                            <i class="fa-solid fa-book-bookmark mr-1"></i> ${d.topic}
                        </span>
                        <div class="leading-relaxed text-[var(--text-normal)]">${d.description}</div>
                    </div>`;
            });
            
            tooltipEl.innerHTML = html;
            tooltipEl.classList.remove('hidden');
            
            const rect = span.getBoundingClientRect();
            let top = rect.bottom + 5;
            let left = rect.left;
            
            // Allow DOM to calculate size before positioning to prevent off-screen tooltips
            setTimeout(() => {
                const tipRect = tooltipEl.getBoundingClientRect();
                if (left + tipRect.width > window.innerWidth) left = window.innerWidth - tipRect.width - 10;
                if (top + tipRect.height > window.innerHeight) top = rect.top - tipRect.height - 5;
                
                tooltipEl.style.top = `${top}px`;
                tooltipEl.style.left = `${left}px`;
                tooltipEl.classList.remove('opacity-0');
                tooltipEl.classList.add('opacity-100');
            }, 0);
        });
        
        span.addEventListener('mouseleave', () => {
            tooltipEl.classList.remove('opacity-100');
            tooltipEl.classList.add('opacity-0');
            setTimeout(() => { if (tooltipEl.classList.contains('opacity-0')) tooltipEl.classList.add('hidden'); }, 150);
        });
    });
}

function showKnowledgePanel(documentData) {
    const sidebar = document.getElementById('right-sidebar');
    const sidebarContent = document.getElementById('right-sidebar-content');
    
    sidebar.classList.remove('w-0');
    sidebar.classList.add('w-[500px]', 'border-l');
    
    setTimeout(() => {
        sidebarContent.classList.remove('opacity-0');
        sidebarContent.classList.add('opacity-100');
    }, 150);

    let viewerContent = '';
    
    if (documentData.type === 'md') {
        viewerContent = parseMarkdown(documentData.rawContent);
    } else if (documentData.type === 'csv') {
        viewerContent = parseCSV(documentData.rawContent);
    } else if (documentData.type === 'txt') {
        viewerContent = `<pre class="whitespace-pre-wrap font-mono text-sm text-[var(--text-normal)] bg-[var(--bg-tertiary)] p-4 rounded mt-4 border border-[var(--border-color)] shadow-inner">${documentData.rawContent}</pre>`;
    } else if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(documentData.type)) {
        viewerContent = generateIframeViewer(documentData.url, documentData.type);
    } else {
        viewerContent = `
            <div class="text-center mt-12 bg-[var(--bg-tertiary)] p-8 rounded border border-[var(--border-color)]">
                <i class="fa-solid fa-file-circle-question text-5xl text-[var(--text-muted)] mb-4"></i>
                <p class="text-[var(--text-muted)] text-lg">No preview available for .${documentData.type} files.</p>
                <a href="${documentData.url}" download class="mt-6 inline-block bg-[var(--accent-color)] text-white px-6 py-2 rounded font-medium hover:brightness-110 transition-all"><i class="fa-solid fa-download mr-2"></i> Download File</a>
            </div>`;
    }

    sidebarContent.innerHTML = `
        <div class="h-16 flex items-center justify-between px-6 border-b border-[var(--border-color)] bg-[var(--bg-tertiary)] flex-shrink-0">
            <div class="font-bold text-[var(--text-normal)] truncate pr-4 text-xl flex items-center">
                <i class="fa-solid fa-file-lines text-[var(--accent-color)] mr-3"></i> ${documentData.title}
            </div>
            <button id="close-panel-btn" class="text-[var(--text-muted)] hover:text-[var(--text-normal)] transition-colors bg-[var(--bg-primary)] hover:bg-[var(--interactive-hover)] w-8 h-8 rounded flex items-center justify-center border border-[var(--border-color)]">
                <i class="fa-solid fa-xmark text-lg"></i>
            </button>
        </div>

        <div class="flex-1 overflow-y-auto p-6 prose prose-invert max-w-none text-[var(--text-normal)]">
            <div class="text-xs text-[var(--text-muted)] mb-4 uppercase tracking-wider font-semibold border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
                 ${documentData.type.toUpperCase()} Document Snapshot
            </div>
            ${viewerContent}
        </div>
        
        ${documentData.tags && documentData.tags.length > 0 ? `
            <div class="p-5 border-t border-[var(--border-color)] bg-[var(--bg-tertiary)] flex-shrink-0">
                <div class="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3">Associated Tags</div>
                <div class="flex flex-wrap gap-2">
                    ${documentData.tags.map(tag => `<span class="bg-[var(--bg-primary)] text-xs px-2.5 py-1.5 rounded text-[var(--text-normal)] border border-[var(--border-color)] shadow-sm">${tag}</span>`).join('')}
                </div>
            </div>
        ` : ''}
    `;

    // Initialize API Enhancements & Tooltips for text documents
    if (['md', 'txt'].includes(documentData.type)) {
        const proseContainer = sidebarContent.querySelector('.prose');
        wrapWordsInNode(proseContainer);
        attachTooltips(proseContainer);
    }

    document.getElementById('close-panel-btn').addEventListener('click', () => {
        sidebarContent.classList.remove('opacity-100');
        sidebarContent.classList.add('opacity-0');
        sidebar.classList.remove('w-[500px]', 'border-l');
        sidebar.classList.add('w-0');
    });
}

function renderResults(results, container, query) {
    container.innerHTML = '';
    if (!results) return;

    const totalResults = results.local.length + results.web.length;
    container.insertAdjacentHTML('beforeend', `<div class="text-[var(--text-muted)] text-sm mb-6 pb-2 border-b border-[var(--border-color)]">About ${totalResults} results found for "${query}"</div>`);

    if (results.related.length > 0) {
        container.insertAdjacentHTML('beforeend', `
            <div class="flex gap-2 mb-8 flex-wrap">
                <span class="text-[var(--text-muted)] text-sm mr-2 flex items-center">Related:</span>
                ${results.related.map(w => `<span class="bg-[var(--bg-tertiary)] text-[var(--text-normal)] px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-[var(--accent-color)] hover:text-white border border-[var(--border-color)] transition-colors shadow-sm" onclick="document.getElementById('module-search-input').value='${w}'; document.getElementById('module-search-btn').click();">${w}</span>`).join('')}
            </div>`);
    }

    if (results.featured) {
        const featuredHtml = `
            <div class="mb-8 bg-[var(--bg-secondary)] border-2 border-[var(--accent-color)] rounded-xl shadow-lg relative overflow-hidden">
                <div class="p-6">
                    <h2 class="text-2xl font-bold text-[var(--text-normal)] mb-3">${results.featured.title}</h2>
                    <div class="text-[var(--text-normal)] leading-relaxed text-base">${results.featured.content}</div>
                    ${results.featured.source === 'Wikipedia' 
                        ? `<a href="${results.featured.url}" target="_blank" class="inline-block mt-4 text-[var(--accent-color)] hover:underline font-medium text-sm">Read full article <i class="fa-solid fa-arrow-up-right-from-square ml-1 text-xs"></i></a>`
                        : `<a href="#" id="featured-local-link" class="inline-block mt-4 text-[var(--accent-color)] hover:underline font-medium text-sm">Open Full Document <i class="fa-solid fa-arrow-right ml-1 text-xs"></i></a>`
                    }
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', featuredHtml);
        
        if (results.featured.source === 'Local Database') {
            const link = container.querySelector('#featured-local-link');
            if (link) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    showKnowledgePanel(results.featured.originalDoc);
                });
            }
        }
    }

    results.local.forEach(res => {
        const card = createResultCard(res, 'var(--accent-color)');
        card.querySelector('.title-link').addEventListener('click', (e) => {
            e.preventDefault();
            showKnowledgePanel(res);
        });
        container.appendChild(card);
    });

    if (results.web.length > 0) {
        container.insertAdjacentHTML('beforeend', `<h3 class="text-xl font-bold mt-10 mb-6 text-[var(--text-normal)] border-b border-[var(--border-color)] pb-2">Web Results (Wikipedia)</h3>`);
        results.web.forEach(res => container.appendChild(createResultCard(res, 'var(--text-muted)', true)));
    }

    if (totalResults === 0) {
        container.insertAdjacentHTML('beforeend', `<div class="text-center text-[var(--text-muted)] mt-12"><i class="fa-solid fa-magnifying-glass text-4xl mb-4"></i><br>No results found for "${query}".</div>`);
    }

    // Apply dynamic tooltips and coloring to search results
    wrapWordsInNode(container);
    attachTooltips(container);
}

function createResultCard(result, tagColor, isWeb = false) {
    const card = document.createElement('div');
    card.className = 'mb-6 bg-[var(--bg-secondary)] p-5 rounded-lg border border-[var(--border-color)] hover:border-[var(--accent-color)] transition-colors shadow-sm';
    
    card.innerHTML = `
        <div class="text-xs text-[var(--text-muted)] mb-2 flex items-center gap-2 uppercase tracking-wide font-semibold">
            <span style="color: ${tagColor}; font-size: 10px;">⬤</span> 
            ${result.source || 'Document'} <span class="text-gray-500">›</span> ${isWeb ? result.url : result.type.toUpperCase() + ' File'}
        </div>
        <a href="${isWeb ? result.url : '#'}" ${isWeb ? 'target="_blank"' : ''} class="title-link text-[var(--accent-color)] hover:underline text-xl font-bold cursor-pointer block mb-3">
            ${result.title}
        </a>
        <div class="text-[var(--text-normal)] text-sm leading-relaxed">${result.summary}</div>
    `;
    return card;
}

function showExternalLinkModal(url) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 backdrop-blur-sm transition-opacity';
    modal.innerHTML = `
        <div class="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
            <div class="bg-[var(--bg-tertiary)] p-4 border-b border-[var(--border-color)] flex items-center gap-3">
                <i class="fa-solid fa-up-right-from-square text-[var(--text-muted)] text-xl"></i>
                <h2 class="text-lg font-bold text-white tracking-wide">Leaving theInfoDB</h2>
            </div>
            <div class="p-6 text-[var(--text-normal)]">
                <p class="mb-4 text-sm leading-relaxed">You are about to leave this application and visit an external website. Are you sure you want to proceed?</p>
                <div class="bg-[var(--bg-tertiary)] p-3 rounded border border-[var(--border-color)] break-all font-mono text-xs text-[var(--text-muted)] mb-6 shadow-inner">
                    ${url}
                </div>
                <div class="flex justify-end gap-3 mt-2">
                    <button id="cancel-link-btn" class="px-5 py-2 rounded font-medium bg-[var(--bg-tertiary)] hover:bg-[var(--interactive-hover)] text-[var(--text-normal)] hover:text-gray-900 transition-colors border border-[var(--border-color)] shadow-sm">Cancel</button>
                    <button id="continue-link-btn" class="px-5 py-2 rounded font-medium bg-[var(--accent-color)] hover:brightness-110 text-white transition-all shadow-md">Continue to External Site</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('cancel-link-btn').addEventListener('click', () => modal.remove());
    document.getElementById('continue-link-btn').addEventListener('click', () => {
        window.open(url, '_blank');
        modal.remove();
    });
}

function showSearchCanvas() {
    const wrapper = document.createElement('div');
    wrapper.className = 'w-full h-full flex overflow-hidden absolute inset-0 bg-[var(--bg-primary)]';
    
    wrapper.innerHTML = `
        <div id="search-main-area" class="flex-1 h-full overflow-y-auto pt-16 px-10 flex flex-col items-center relative transition-all duration-300">
            <h1 id="search-logo" class="text-6xl font-bold text-[var(--text-normal)] mb-10 tracking-tighter transition-all duration-300">
                <span class="text-[var(--accent-color)]">the</span>InfoDB
            </h1>
            <div id="search-box-container" class="w-full max-w-3xl flex items-center bg-[var(--bg-tertiary)] rounded-full border border-[var(--border-color)] focus-within:border-[var(--accent-color)] focus-within:ring-2 focus-within:ring-[var(--accent-color)] transition-all shadow-lg px-6 py-4 mb-10">
                <i class="fa-solid fa-magnifying-glass text-[var(--text-muted)] mr-4 text-xl"></i>
                <input id="module-search-input" type="text" placeholder="Search knowledge base or web..." class="w-full bg-transparent text-[var(--text-normal)] outline-none text-lg">
                <button id="module-search-btn" class="hidden"></button>
            </div>
            <div id="results-container" class="w-full max-w-4xl text-left pb-12"></div>
        </div>

        <div id="right-sidebar" class="w-0 flex-shrink-0 border-[var(--border-color)] bg-[var(--bg-secondary)] overflow-hidden transition-all duration-300 h-full relative z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.1)]">
            <div id="right-sidebar-content" class="w-[500px] h-full flex flex-col opacity-0 transition-opacity duration-300 relative">
                <!-- Dynamic content loads here -->
            </div>
        </div>
    `;
    
    window.AppAPI.canvas.setContent(wrapper);
    const input = document.getElementById('module-search-input');
    const btn = document.getElementById('module-search-btn');
    const resultsContainer = document.getElementById('results-container');
    const logo = document.getElementById('search-logo');
    const searchBox = document.getElementById('search-box-container');
    const mainArea = document.getElementById('search-main-area');

    wrapper.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.href) {
            if (link.hasAttribute('download')) return;
            const url = new URL(link.href, window.location.origin);
            if (url.origin !== window.location.origin && link.href.startsWith('http')) {
                e.preventDefault();
                showExternalLinkModal(link.href);
            }
        }
    });

    input.addEventListener('keypress', (e) => { if (e.key === 'Enter') btn.click(); });

    btn.addEventListener('click', async () => {
        if (!input.value.trim()) return;
        
        mainArea.classList.replace('pt-16', 'pt-8');
        logo.classList.add('hidden');
        searchBox.classList.replace('mb-10', 'mb-6');
        searchBox.classList.replace('max-w-3xl', 'max-w-4xl');
        
        const sidebar = document.getElementById('right-sidebar');
        const sidebarContent = document.getElementById('right-sidebar-content');
        sidebarContent.classList.remove('opacity-100');
        sidebarContent.classList.add('opacity-0');
        sidebar.classList.remove('w-[500px]', 'border-l');
        sidebar.classList.add('w-0');

        resultsContainer.innerHTML = '<div class="text-center mt-20 text-[var(--text-muted)]"><i class="fa-solid fa-circle-notch fa-spin text-4xl mb-4 text-[var(--accent-color)]"></i><br>Searching database...</div>';
        
        const results = await performSearch(input.value);
        renderResults(results, resultsContainer, input.value);
    });

    input.focus();
}

async function initSearchModule() {
    if (isModuleInitialized) return;
    
    window.AppAPI.sidebar.addEntry('search', 'Search', 'fa-solid fa-magnifying-glass', showSearchCanvas);

    console.log("Search Module: Starting background recursive indexing...");
    // Load local documents and tooltips in parallel
    await Promise.all([loadRegistries(), loadTooltips()]);
    console.log(`Search Module: Loading complete. Loaded ${localIndex.length} docs and ${Object.keys(tooltipDictionary).length} tooltips.`);
    
    isModuleInitialized = true;
}

if (window.AppAPI) initSearchModule();
else console.warn("AppAPI not found. Search module failed to initialize.");