/**
 * Viona Reports API Client
 * Path: modules/calendar/apis/api_forViona.js
 *
 * Pulls "Ausbildungsnachweis" .docx files from a GitHub repo and
 * parses each one to a map of { "YYYY-MM-DD": { activities: [...] } }.
 *
 * Repo used:
 *   https://github.com/cmdrFRANKLY1/Viona/tree/main/Reports
 *
 * GitHub REST API is used to list the folder contents (no auth needed
 * for public repos; rate-limited to 60 req/hr per IP).
 *
 * Public API:
 *   VionaAPI.listReports()                  → Promise<Report[]>
 *   VionaAPI.fetchReport(url)               → Promise<ReportDetail>
 *   VionaAPI.loadAll({ onProgress })        → Promise<Map<dateKey, DayData>>
 *   VionaAPI.getActivitiesForDate(date)     → DayData | null   (post-load)
 *   VionaAPI.clearCache()
 *
 * DayData shape:
 *   { activities: string[], hours: string|null, source: { name, url } }
 */

(function () {
    'use strict';

    // ─────────────────────────────────────────────────────────────
    // 0. Config
    // ─────────────────────────────────────────────────────────────
    const GITHUB_OWNER  = 'cmdrFRANKLY1';
    const GITHUB_REPO   = 'Viona';
    const GITHUB_BRANCH = 'main';
    const REPORTS_DIR   = 'Reports';

    const GITHUB_API = 'https://api.github.com';
    const RAW_BASE   = 'https://raw.githubusercontent.com';

    // ─────────────────────────────────────────────────────────────
    // 1. In-memory caches
    // ─────────────────────────────────────────────────────────────
    let reportsListCache = null;      // Report[]
    const reportCache    = new Map(); // url → ReportDetail
    let activitiesByDate = new Map(); // "YYYY-MM-DD" → DayData

    // ─────────────────────────────────────────────────────────────
    // 2. GitHub folder listing
    // ─────────────────────────────────────────────────────────────
    async function listReports() {
        if (reportsListCache) return reportsListCache;

        const url = GITHUB_API + '/repos/' + GITHUB_OWNER + '/' + GITHUB_REPO +
                    '/contents/' + REPORTS_DIR + '?ref=' + GITHUB_BRANCH;

        const res = await fetch(url, {
            headers: { 'Accept': 'application/vnd.github+json' }
        });
        if (!res.ok) throw new Error('GitHub list HTTP ' + res.status);
        const json = await res.json();

        const reports = (Array.isArray(json) ? json : [])
            .filter(item => item.type === 'file' && /\.docx?$/i.test(item.name))
            .map(item => {
                const parsed = parseReportFilename(item.name);
                return {
                    name: item.name,
                    url: item.download_url || (RAW_BASE + '/' + GITHUB_OWNER + '/' + GITHUB_REPO + '/' + GITHUB_BRANCH + '/' + item.path),
                    htmlUrl: item.html_url,
                    start: parsed.start,
                    end: parsed.end,
                    rangeKey: parsed.rangeKey
                };
            })
            .filter(r => r.start && r.end);

        reportsListCache = reports;
        return reports;
    }

    // Filename looks like "Ausbildungsnachweis 03.08.26 - 08.08.26.docx"
    // (also supports other separators and 4-digit years)
    function parseReportFilename(name) {
        // strip extension
        const base = name.replace(/\.[^.]+$/, '');

        // find up to two date-like tokens: DD.MM.YY or DD.MM.YYYY
        const dateRe = /(\d{1,2})\.(\d{1,2})\.(\d{2,4})/g;
        const matches = [];
        let m;
        while ((m = dateRe.exec(base)) !== null) {
            const day = Number(m[1]);
            const month = Number(m[2]);
            let year = Number(m[3]);
            if (year < 100) year += 2000;
            if (day >= 1 && day <= 31 && month >= 1 && month <= 12) {
                matches.push(new Date(year, month - 1, day));
            }
        }

        if (matches.length === 0) return { start: null, end: null, rangeKey: null };

        let start = matches[0];
        let end   = matches[1] || matches[0];

        // Ensure start ≤ end (files are named start - end)
        if (start > end) { const tmp = start; start = end; end = tmp; }

        return {
            start,
            end,
            rangeKey: isoKey(start) + '..' + isoKey(end)
        };
    }

    function isoKey(d) {
        const pad = n => String(n).padStart(2, '0');
        return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
    }

    // ─────────────────────────────────────────────────────────────
    // 3. DOCX download + parse
    // ─────────────────────────────────────────────────────────────
    async function fetchReport(url) {
        if (reportCache.has(url)) return reportCache.get(url);

        const res = await fetch(url, { cache: 'no-cache' });
        if (!res.ok) throw new Error('Report fetch HTTP ' + res.status);
        const arrayBuffer = await res.arrayBuffer();

        // Prefer mammoth.js if the page has loaded it. Fall back to a
        // minimal built-in parser that extracts word/document.xml text.
        let text;
        if (window.mammoth) {
            try {
                const result = await window.mammoth.extractRawText({ arrayBuffer });
                text = result.value;
            } catch (_) {
                text = await fallbackExtractText(arrayBuffer);
            }
        } else {
            text = await fallbackExtractText(arrayBuffer);
        }

        const detail = {
            url,
            text,
            days: parseReportText(text)
        };
        reportCache.set(url, detail);
        return detail;
    }

    // Minimal DOCX parser: unzip the archive in memory, grab word/document.xml,
    // strip tags, decode basic entities, and return plain text.
    async function fallbackExtractText(arrayBuffer) {
        if (!window.JSZip) {
            // Try a dynamic load of JSZip from jsDelivr (once)
            await loadScript('https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js');
        }
        if (!window.JSZip) throw new Error('JSZip unavailable and mammoth not loaded');

        const zip = await window.JSZip.loadAsync(arrayBuffer);
        const docXmlFile = zip.file('word/document.xml');
        if (!docXmlFile) throw new Error('No word/document.xml in docx');
        const xml = await docXmlFile.async('string');

        // Paragraph boundaries
        let s = xml
            .replace(/<w:p\b[^>]*\/>/g, '\n')
            .replace(/<w:p\b[^>]*>/g, '\n')
            .replace(/<w:tab\b[^>]*\/>/g, '\t')
            .replace(/<w:br\b[^>]*\/>/g, '\n');

        // Convert <w:t>text</w:t> runs; drop all other tags
        s = s.replace(/<\/w:t>/g, '\u0000').replace(/<[^>]+>/g, '');
        s = s.replace(/\u0000/g, '');

        // Basic XML entities
        s = s.replace(/&lt;/g, '<').replace(/&gt;/g, '>')
             .replace(/&amp;/g, '&').replace(/&quot;/g, '"')
             .replace(/&apos;/g, "'");

        return s;
    }

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            if (document.querySelector('script[src="' + src + '"]')) return resolve();
            const s = document.createElement('script');
            s.src = src; s.async = false;
            s.onload = () => resolve();
            s.onerror = () => reject(new Error('Failed to load ' + src));
            document.head.appendChild(s);
        });
    }

    // ─────────────────────────────────────────────────────────────
    // 4. Parse the extracted text into per-day activities
    // ─────────────────────────────────────────────────────────────
    const WEEKDAY_MAP = {
        'montag': 1, 'monday': 1, 'mo': 1,
        'dienstag': 2, 'tuesday': 2, 'di': 2,
        'mittwoch': 3, 'wednesday': 3, 'mi': 3,
        'donnerstag': 4, 'thursday': 4, 'do': 4,
        'freitag': 5, 'friday': 5, 'fr': 5,
        'samstag': 6, 'saturday': 6, 'sa': 6,
        'sonntag': 0, 'sunday': 0, 'so': 0
    };

    function parseReportText(text) {
        // The docx table typically flattens to lines like:
        //   "Montag", "…bullet1", "…bullet2", "8" (hours)
        //   "Dienstag", "…", "8"
        //   ...
        // We detect weekday tokens and collect until the next weekday
        // token or a numeric "hours" cell.

        const lines = String(text || '')
            .replace(/\r\n?/g, '\n')
            .split('\n')
            .map(l => l.trim())
            .filter(Boolean);

        // Extract the week range from the header line if present
        let start = null, end = null;
        const rangeRe = /(\d{1,2})\.(\d{1,2})\.(\d{2,4})/g;
        const headSearch = lines.slice(0, 40).join(' ');
        const hits = [];
        let m;
        while ((m = rangeRe.exec(headSearch)) !== null) {
            const d = Number(m[1]), mo = Number(m[2]);
            let y = Number(m[3]); if (y < 100) y += 2000;
            if (d >= 1 && d <= 31 && mo >= 1 && mo <= 12) hits.push(new Date(y, mo - 1, d));
        }
        if (hits.length >= 2) { start = hits[0]; end = hits[1]; }
        if (!start || !end) return [];

        const days = [];
        let currentDayIdx = null;
        let buffer = [];

        const flush = () => {
            if (currentDayIdx === null) return;
            // Determine the date for this weekday within [start, end]
            const targetDow = currentDayIdx;
            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                if (d.getDay() === targetDow) {
                    const activities = buffer.filter(Boolean).map(cleanActivity).filter(Boolean);
                    const hours = extractHours(buffer);
                    days.push({ date: isoKey(d), activities, hours });
                    break;
                }
            }
            buffer = [];
        };

        for (const raw of lines) {
            const norm = raw.toLowerCase().replace(/[^a-zäöüß]/g, ' ').replace(/\s+/g, ' ').trim();
            const parts = norm.split(' ');
            let matchedDow = null;

            // Check first token(s) for a weekday key
            for (let i = 0; i < Math.min(parts.length, 2); i++) {
                if (WEEKDAY_MAP[parts[i]] !== undefined) {
                    matchedDow = WEEKDAY_MAP[parts[i]];
                    break;
                }
            }

            if (matchedDow !== null) {
                flush();
                currentDayIdx = matchedDow;
                // Capture any trailing text on the same line as an activity
                const stripped = raw.replace(/^[^\p{L}]*[\p{L}äöüß]+\.?\s*/u, '').trim();
                if (stripped && stripped !== raw) buffer.push(stripped);
                else {
                    const after = raw.replace(new RegExp('^' + parts[0] + '\\s*', 'i'), '').trim();
                    if (after) buffer.push(after);
                }
                continue;
            }

            buffer.push(raw);
        }
        flush();
        return days;
    }

    function cleanActivity(s) {
        if (!s) return '';
        return String(s)
            .replace(/^[-•·●▪◦\-\u2022\s]+/, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function extractHours(lines) {
        for (const l of lines) {
            // A line that's just "8" or "8 h" or "8 Stunden"
            const m = l.match(/^(\d{1,2})\s*(?:h|std|stunden)?\.?$/i);
            if (m) return m[1];
        }
        return null;
    }

    // ─────────────────────────────────────────────────────────────
    // 5. Aggregate reports into a date → activities map
    // ─────────────────────────────────────────────────────────────
    async function loadAll(opts) {
        const options = opts || {};
        const onProgress = options.onProgress || (() => {});

        const list = await listReports();
        activitiesByDate = new Map();

        if (list.length === 0) {
            onProgress({ stage: 'empty', loaded: 0, total: 0 });
            return activitiesByDate;
        }

        let loaded = 0;
        for (const report of list) {
            try {
                const detail = await fetchReport(report.url);
                for (const d of detail.days) {
                    const existing = activitiesByDate.get(d.date);
                    if (existing) {
                        existing.activities = existing.activities.concat(d.activities);
                        if (!existing.hours && d.hours) existing.hours = d.hours;
                    } else {
                        activitiesByDate.set(d.date, {
                            activities: d.activities.slice(),
                            hours: d.hours || null,
                            source: { name: report.name, url: report.htmlUrl || report.url }
                        });
                    }
                }
            } catch (err) {
                console.warn('[VionaAPI] Failed to parse ' + report.name + ':', err);
            }
            loaded++;
            onProgress({ stage: 'loading', loaded, total: list.length, current: report.name });
        }

        onProgress({ stage: 'done', loaded, total: list.length });
        return activitiesByDate;
    }

    // ─────────────────────────────────────────────────────────────
    // 6. Lookup
    // ─────────────────────────────────────────────────────────────
    function getActivitiesForDate(date) {
        if (!date) return null;
        return activitiesByDate.get(isoKey(date)) || null;
    }

    function clearCache() {
        reportsListCache = null;
        reportCache.clear();
        activitiesByDate = new Map();
    }

    // ─────────────────────────────────────────────────────────────
    // 7. Export
    // ─────────────────────────────────────────────────────────────
    window.VionaAPI = {
        listReports,
        fetchReport,
        loadAll,
        getActivitiesForDate,
        clearCache,
        parseReportFilename,
        get repoUrl() {
            return 'https://github.com/' + GITHUB_OWNER + '/' + GITHUB_REPO +
                   '/tree/' + GITHUB_BRANCH + '/' + REPORTS_DIR;
        },
        get loadedCount() { return activitiesByDate.size; }
    };

    console.log('[VionaAPI] Module ready.');
})();