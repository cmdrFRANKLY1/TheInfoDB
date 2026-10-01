import { state } from '../state/state.js';

/**
 * Escapes special HTML characters to prevent XSS and formatting issues.
 */
export function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/**
 * Dynamically builds a regular expression based on the loaded tooltips state.
 */
export function buildTooltipRegex() {
    const langDict = state.tooltips[state.currentRenderingLang] || {};
    const keys = Object.keys(langDict);
    if (keys.length === 0) return null;
    const escaped = keys
        .map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .sort((a, b) => b.length - a.length);
    return new RegExp(`\\b(${escaped.join('|')})\\b`, 'g');
}

/**
 * Scans HTML text and injects tooltip wrappers around matched keywords.
 */
export function injectTooltips(html) {
    if (!html) return html;
    const rx = buildTooltipRegex();
    if (!rx) return html;
    const langDict = state.tooltips[state.currentRenderingLang] || {};

    const parts = html.split(/(<[^>]+>)/g);
    return parts.map(part => {
        if (!part) return part;
        if (part.startsWith('<')) return part;
        return part.replace(rx, (match) => {
            const exactKey = Object.keys(langDict).find(k => k.toLowerCase() === match.toLowerCase());
            if (!exactKey) return match;
            // Embed the language so the mouseover event knows which dictionary to check
            return `<span class="tooltip-term" data-term="${exactKey}" data-lang="${state.currentRenderingLang}">${match}</span>`;
        });
    }).join('');
}

/**
 * Formats raw markdown text into HTML, applying bold, italics, code, hyperlinks, and lists.
 */
export function formatMarkdownText(text) {
    if (!text) return '';
    let escaped = escapeHtml(text);
    let formatted = escaped
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code class="bg-neutral-900 border border-neutral-800 text-neutral-200 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-400 hover:underline external-link">$1</a>');

    if (state.hyperlinks && Object.keys(state.hyperlinks).length > 0) {
        Object.entries(state.hyperlinks).forEach(([term, url]) => {
            const regex = new RegExp(`\\b(${term})\\b(?![^<]*>|[^<>]*</a>)`, 'g');
            formatted = formatted.replace(regex, `<a href="${url}" class="text-blue-400 hover:underline external-link">$1</a>`);
        });
    }

    const lines = formatted.split('\n');
    const out = [];
    let listBuffer = [];
    const flushList = () => {
        if (listBuffer.length) {
            out.push(`<ul class="list-disc pl-5 space-y-1 my-2">${listBuffer.map(i => `<li>${i}</li>`).join('')}</ul>`);
            listBuffer = [];
        }
    };
    lines.forEach(line => {
        if (line.trim().startsWith('- ')) {
            listBuffer.push(line.trim().replace(/^- /, ''));
        } else {
            flushList();
            out.push(line);
        }
    });
    flushList();

    let joined = out.join('<br>').replace(/(<br>)+(<ul)/g, '$2').replace(/(<\/ul>)(<br>)+/g, '$1');
    joined = injectTooltips(joined);
    return joined;
}

/**
 * Processes chunks of lines into blocks, specifically handling tables and raw content.
 */
export function processBlockContent(linesArr) {
    const processed = [];
    let tableBuffer = [];

    const flushTable = () => {
        if (tableBuffer.length >= 2) {
            const headers = tableBuffer[0].split('|').map(s => s.trim()).filter(Boolean);
            const rows = tableBuffer.slice(2).map(r => r.split('|').map(s => s.trim()).filter(Boolean));
            let html = '<div class="overflow-x-auto"><table class="w-full border-collapse my-3"><thead><tr>';
            headers.forEach(h => html += `<th class="border border-neutral-800 p-2 text-left text-xs bg-neutral-900 text-white">${formatMarkdownText(h)}</th>`);
            html += '</tr></thead><tbody>';
            rows.forEach(row => {
                html += '<tr>';
                row.forEach(cell => html += `<td class="border border-neutral-800 p-2 text-xs text-neutral-300">${formatMarkdownText(cell)}</td>`);
                html += '</tr>';
            });
            html += '</tbody></table></div>';
            processed.push(html);
        }
        tableBuffer = [];
    };

    for (let idx = 0; idx < linesArr.length; idx++) {
        const l = linesArr[idx];
        if (l.trim().startsWith('|') && l.trim().endsWith('|')) {
            tableBuffer.push(l.trim());
        } else {
            flushTable();
            if (l.trim() === '---') {
                processed.push('<hr class="border-neutral-800 my-4">');
            } else if (l.trim() !== '') {
                processed.push(formatMarkdownText(l));
            }
        }
    }
    flushTable();
    return processed.join('<br>');
}

/**
 * Parses raw markdown content into structured sections based on headings (#, ##, ###).
 */
export function parseAdvancedMarkdown(content) {
    const lines = content.split('\n');
    let overallTitle = "Document";
    const mainSections = [];
    let currentMain = null;
    let currentSub = null;
    let introBuffer = [];

    const flushIntro = () => {
        if (currentMain && introBuffer.length > 0 && !currentMain.intro) {
            currentMain.intro = processBlockContent(introBuffer);
        }
        introBuffer = [];
    };

    let i = 0;
    while (i < lines.length) {
        const line = lines[i];

        if (line.startsWith('# ')) {
            if (currentMain) {
                flushIntro();
                if (currentSub) { currentMain.subtopics.push(currentSub); currentSub = null; }
                mainSections.push(currentMain);
            }
            overallTitle = line.replace(/^#\s+/, '');
            currentMain = { title: overallTitle, intro: '', subtopics: [] };
            currentSub = null;
            i++;
        } else if (line.startsWith('## ') || line.startsWith('### ')) {
            if (currentMain) {
                flushIntro();
                if (currentSub) currentMain.subtopics.push(currentSub);
                const subTitle = line.replace(/^#{2,3}\s+/, '');
                const level = line.startsWith('### ') ? 3 : 2;
                currentSub = { title: subTitle, level, contentLines: [] };
            }
            i++;
        } else {
            if (currentSub) {
                currentSub.contentLines.push(line);
            } else {
                introBuffer.push(line);
            }
            i++;
        }
    }

    if (currentMain) {
        flushIntro();
        if (currentSub) currentMain.subtopics.push(currentSub);
        mainSections.push(currentMain);
    }

    if (mainSections.length === 0) {
        mainSections.push({ title: overallTitle, intro: processBlockContent(lines), subtopics: [] });
    }

    return mainSections;
}

/**
 * Re-assembles a structured markdown section back into raw text (useful for copying/pinning).
 */
export function assembleTopicMarkdown(section) {
    const lines = [];
    lines.push(`# ${section.title}`);
    lines.push('');

    if (section.intro) {
        const rawIntro = section.intro
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<[^>]+>/g, '')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .trim();
        if (rawIntro) {
            lines.push(rawIntro);
            lines.push('');
        }
    }

    (section.subtopics || []).forEach(sub => {
        const prefix = sub.level === 3 ? '###' : '##';
        lines.push(`${prefix} ${sub.title}`);
        lines.push('');
        const body = (sub.contentLines || []).join('\n').trim();
        if (body) {
            lines.push(body);
            lines.push('');
        }
    });

    return lines.join('\n').trim();
}