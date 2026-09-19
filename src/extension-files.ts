import { ExtensionFileItem } from './types';

export const MANIFEST_JSON = `{
  "manifest_version": 3,
  "name": "Google Maps Lead Scraper - No Website Finder",
  "version": "1.0.0",
  "description": "Zero-API direct DOM scraper that extracts Google Maps businesses without a website into CSV for lead generation.",
  "permissions": [
    "activeTab",
    "scripting",
    "storage",
    "downloads"
  ],
  "host_permissions": [
    "https://*.google.com/maps/*",
    "https://google.com/maps/*"
  ],
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
  "content_scripts": [
    {
      "matches": [
        "https://*.google.com/maps/*",
        "https://google.com/maps/*"
      ],
      "js": ["content.js"],
      "run_at": "document_idle"
    }
  ],
  "background": {
    "service_worker": "background.js"
  }
}`;

export const CONTENT_JS = `/**
 * Google Maps Direct DOM Lead Scraper
 * Extracts business listings without a website directly from Google Maps DOM without any API calls.
 */

(function () {
  if (window.__G_MAPS_SCRAPER_INITIALIZED__) {
    return;
  }
  window.__G_MAPS_SCRAPER_INITIALIZED__ = true;

  let isScraping = false;
  let shouldStop = false;
  let scrapedLeads = new Map(); // keyed by business name + address to prevent duplicates
  let config = {
    onlyNoWebsite: true,
    scrollDelayMs: 1500,
    maxLeads: 50,
    requirePhone: false,
    minRating: 0
  };

  console.log('[MapLeadScraper] Content script loaded and ready on Google Maps.');

  // Listen for messages from popup or background
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'PING') {
      sendResponse({ status: 'PONG', isGoogleMaps: isGoogleMapsPage(), isScraping, leadsCount: scrapedLeads.size });
      return true;
    }

    if (request.action === 'START_SCRAPE') {
      config = { ...config, ...(request.config || {}) };
      shouldStop = false;
      startScrapingSession();
      sendResponse({ status: 'STARTED' });
      return true;
    }

    if (request.action === 'STOP_SCRAPE') {
      shouldStop = true;
      isScraping = false;
      sendResponse({ status: 'STOPPED', leadsCount: scrapedLeads.size });
      return true;
    }

    if (request.action === 'GET_LEADS') {
      sendResponse({ leads: Array.from(scrapedLeads.values()), isScraping });
      return true;
    }

    if (request.action === 'EXPORT_CSV') {
      exportToCsv();
      sendResponse({ status: 'EXPORTED', count: scrapedLeads.size });
      return true;
    }

    if (request.action === 'CLEAR_LEADS') {
      scrapedLeads.clear();
      sendResponse({ status: 'CLEARED' });
      return true;
    }
  });

  function isGoogleMapsPage() {
    return window.location.hostname.includes('google.') && window.location.pathname.includes('/maps');
  }

  function getFeedContainer() {
    // Primary Google Maps search results feed element
    return document.querySelector('div[role="feed"]') ||
           document.querySelector('.m6QErb[aria-label*="Results for" i]') ||
           document.querySelector('div[aria-label*="Results for" i]');
  }

  async function startScrapingSession() {
    if (isScraping) return;
    isScraping = true;
    shouldStop = false;

    console.log('[MapLeadScraper] Starting DOM scraping session...');
    notifyPopupStatus('SCRAPING_STARTED');

    const feed = getFeedContainer();
    if (!feed) {
      console.warn('[MapLeadScraper] Results feed not found. Make sure you searched for a business query on Google Maps.');
      notifyPopupStatus('FEED_NOT_FOUND');
      isScraping = false;
      return;
    }

    let previousHeight = 0;
    let unchangedScrollCount = 0;

    while (!shouldStop && isScraping) {
      // 1. Scrape currently visible cards in the feed
      scrapeVisibleCards(feed);

      notifyPopupStatus('PROGRESS_UPDATE');

      if (scrapedLeads.size >= config.maxLeads) {
        console.log(\`[MapLeadScraper] Reached max lead limit of \${config.maxLeads}.\`);
        break;
      }

      // Check if "You've reached the end of the list" indicator is displayed
      const endMarker = document.querySelector('.HlvSq, div[aria-label*="end of the list" i]');
      if (endMarker && endMarker.offsetParent !== null) {
        console.log('[MapLeadScraper] Reached end of Google Maps results feed.');
        break;
      }

      // 2. Scroll the feed container down to trigger lazy loading
      previousHeight = feed.scrollHeight;
      feed.scrollTop = feed.scrollHeight;

      await sleep(config.scrollDelayMs);

      // Check if scroll actually triggered new DOM items
      if (feed.scrollHeight === previousHeight) {
        unchangedScrollCount++;
        // Try scrolling specific child or container
        feed.scrollBy(0, 1000);
        await sleep(1000);

        if (unchangedScrollCount >= 3) {
          console.log('[MapLeadScraper] Feed stopped growing after 3 attempts. Scraping complete.');
          break;
        }
      } else {
        unchangedScrollCount = 0;
      }
    }

    isScraping = false;
    notifyPopupStatus('SCRAPING_COMPLETED');
    console.log(\`[MapLeadScraper] Session finished. Total qualifying leads collected: \${scrapedLeads.size}\`);
  }

  function scrapeVisibleCards(feed) {
    // Select all result cards inside the feed
    const cardElements = feed.querySelectorAll('div.Nv2PK, div[role="article"]');

    cardElements.forEach((card) => {
      try {
        const lead = extractLeadFromCard(card);
        if (!lead) return;

        // Apply filters
        if (config.onlyNoWebsite && lead.hasWebsite) {
          return; // Skip businesses that already have a website
        }

        if (config.requirePhone && !lead.phone) {
          return; // Skip if user requires a phone number and none found
        }

        if (config.minRating > 0 && (lead.rating || 0) < config.minRating) {
          return;
        }

        const uniqueKey = (lead.name + '|' + (lead.address || '')).toLowerCase();
        if (!scrapedLeads.has(uniqueKey)) {
          scrapedLeads.set(uniqueKey, lead);
          console.log(\`[MapLeadScraper] Found lead without website: \${lead.name} (\${lead.category || 'Local Business'})\`);
        }
      } catch (err) {
        console.debug('[MapLeadScraper] Error parsing card:', err);
      }
    });
  }

  function extractLeadFromCard(card) {
    // 1. Business Name
    const nameEl = card.querySelector('.qBF1Pd, .fontHeadlineSmall, [role="heading"]') ||
                   card.querySelector('a.hfpxzc[aria-label]');
    const name = nameEl ? (nameEl.getAttribute('aria-label') || nameEl.textContent || '').trim() : '';
    if (!name) return null;

    // 2. Google Maps Place URL
    const linkEl = card.querySelector('a.hfpxzc, a[href*="/maps/place/"]');
    const mapsUrl = linkEl ? linkEl.href : window.location.href;

    // 3. Website Detection (DOM directly)
    // Check if card has a dedicated website button or external link
    const websiteBtn = card.querySelector('a[data-value="Website"], a[aria-label*="website" i], a[data-tooltip*="website" i], button[data-tooltip*="website" i]');
    
    // Check for any anchor tag with external link that is not google
    const externalLinks = Array.from(card.querySelectorAll('a[href^="http"]')).filter(a => {
      const href = a.href.toLowerCase();
      return !href.includes('google.') && !href.includes('gstatic.') && !href.includes('ggpht.');
    });

    let hasWebsite = Boolean(websiteBtn || externalLinks.length > 0);
    let websiteUrl = '';
    if (websiteBtn && websiteBtn.href) {
      websiteUrl = websiteBtn.href;
    } else if (externalLinks.length > 0) {
      websiteUrl = externalLinks[0].href;
    }

    // 4. Rating & Reviews
    let rating = 0;
    let reviewsCount = 0;
    const ratingEl = card.querySelector('span.MW4etd, span[aria-label*="stars" i]');
    if (ratingEl) {
      const match = ratingEl.textContent.match(/([0-9]+\.?[0-9]*)/);
      if (match) rating = parseFloat(match[1]);
    }

    const reviewEl = card.querySelector('span.UY7F9');
    if (reviewEl) {
      const numMatch = reviewEl.textContent.replace(/[^0-9]/g, '');
      if (numMatch) reviewsCount = parseInt(numMatch, 10);
    }

    // 5. Category, Address & Phone from secondary text lines (.W4Efsd)
    const textLines = Array.from(card.querySelectorAll('.W4Efsd')).map(el => el.textContent.trim());
    let category = '';
    let address = '';
    let phone = '';

    const phoneRegex = /(?:\\+?\\d{1,3}[-.\\s]?)?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}/;

    textLines.forEach((line) => {
      // Check for phone number
      const phoneMatch = line.match(phoneRegex);
      if (phoneMatch && !phone) {
        phone = phoneMatch[0].trim();
      }

      // Check for category separator " · "
      if (line.includes('·')) {
        const parts = line.split('·').map(p => p.trim());
        if (!category && parts[0]) {
          category = parts[0].replace(/[0-9.]+\\s*★?/, '').trim();
        }
        if (!address && parts.length > 1) {
          // Look for part that resembles an address or city
          const candidate = parts.find(p => p !== parts[0] && !p.match(phoneRegex) && !p.toLowerCase().includes('open') && !p.toLowerCase().includes('close'));
          if (candidate) address = candidate;
        }
      } else if (!category && line.length < 35 && !line.match(phoneRegex) && !line.toLowerCase().includes('open') && !line.toLowerCase().includes('review')) {
        category = line;
      }
    });

    return {
      id: btoa(encodeURIComponent(name + (address || ''))).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16),
      name,
      category: category || 'Local Business',
      hasWebsite,
      websiteUrl,
      phone: phone || 'Not listed on card',
      rating: rating || undefined,
      reviewsCount: reviewsCount || undefined,
      address: address || 'Local area',
      mapsUrl,
      scrapedAt: new Date().toISOString().split('T')[0]
    };
  }

  function exportToCsv() {
    const leads = Array.from(scrapedLeads.values());
    if (leads.length === 0) {
      alert('No leads collected yet. Start scraping first!');
      return;
    }

    const headers = [
      'Business Name',
      'Has Website',
      'Category',
      'Phone Number',
      'Rating',
      'Reviews Count',
      'Address',
      'Google Maps URL',
      'Scraped Date'
    ];

    const rows = leads.map(l => [
      escapeCsv(l.name),
      l.hasWebsite ? 'Yes' : 'NO (High Value Lead)',
      escapeCsv(l.category),
      escapeCsv(l.phone || ''),
      l.rating || '',
      l.reviewsCount || 0,
      escapeCsv(l.address || ''),
      escapeCsv(l.mapsUrl || ''),
      l.scrapedAt
    ]);

    const csvContent = '\\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\\r\\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().slice(0, 10);
    link.setAttribute('href', url);
    link.setAttribute('download', \`google_maps_no_website_leads_\${timestamp}.csv\`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function escapeCsv(str) {
    if (str == null) return '""';
    const stringValue = String(str).replace(/"/g, '""');
    return \`"\${stringValue}"\`;
  }

  function notifyPopupStatus(status) {
    chrome.runtime.sendMessage({
      action: 'STATUS_UPDATE',
      status,
      count: scrapedLeads.size,
      leads: Array.from(scrapedLeads.values())
    }).catch(() => {
      // Popup might be closed, perfectly normal
    });
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
})();
`;

export const POPUP_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>MapLead Scraper</title>
  <style>
    :root {
      --bg: #0f172a;
      --card: #1e293b;
      --accent: #3b82f6;
      --accent-hover: #2563eb;
      --text: #f8fafc;
      --muted: #94a3b8;
      --border: #334155;
      --success: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body {
      width: 380px;
      background: var(--bg);
      color: var(--text);
      padding: 16px;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border);
      padding-bottom: 12px;
      margin-bottom: 14px;
    }
    .title-group {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .logo-icon {
      width: 28px;
      height: 28px;
      background: linear-gradient(135deg, #3b82f6, #06b6d4);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 14px;
    }
    h1 { font-size: 15px; font-weight: 700; color: #fff; }
    .badge {
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 9999px;
      font-weight: 600;
    }
    .badge-active { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); }
    .badge-inactive { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); }
    
    .stats-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 14px;
    }
    .stat-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 10px;
      text-align: center;
    }
    .stat-num { font-size: 22px; font-weight: 800; color: #38bdf8; }
    .stat-label { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px; }

    .config-box {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 14px;
      font-size: 13px;
    }
    .toggle-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .toggle-row:last-child { margin-bottom: 0; }
    .toggle-label { color: #e2e8f0; font-size: 12px; }
    
    .actions {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 12px;
    }
    .btn {
      width: 100%;
      padding: 10px 14px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 13px;
      cursor: pointer;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: all 0.2s;
    }
    .btn-primary { background: #2563eb; color: #fff; }
    .btn-primary:hover { background: #1d4ed8; }
    .btn-stop { background: #dc2626; color: #fff; }
    .btn-stop:hover { background: #b91c1c; }
    .btn-secondary { background: #334155; color: #f8fafc; }
    .btn-secondary:hover { background: #475569; }
    .btn-success { background: #059669; color: #fff; }
    .btn-success:hover { background: #047857; }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }

    .lead-preview {
      max-height: 140px;
      overflow-y: auto;
      background: #090d16;
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 8px;
      font-size: 11px;
    }
    .lead-item {
      padding: 6px 4px;
      border-bottom: 1px solid #1e293b;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .lead-item:last-child { border-bottom: none; }
    .lead-name { font-weight: 600; color: #f1f5f9; }
    .lead-phone { color: #38bdf8; font-family: monospace; }
    .no-leads { color: var(--muted); text-align: center; padding: 12px; }
    .footer-note { font-size: 10px; color: var(--muted); text-align: center; margin-top: 10px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="title-group">
      <div class="logo-icon">📍</div>
      <div>
        <h1>MapLead Scraper</h1>
        <span style="font-size: 10px; color: var(--muted);">Zero-API DOM Extractor</span>
      </div>
    </div>
    <span id="pageBadge" class="badge badge-inactive">Not on Maps</span>
  </div>

  <div class="stats-row">
    <div class="stat-card">
      <div id="noWebsiteCount" class="stat-num">0</div>
      <div class="stat-label">No-Website Leads</div>
    </div>
    <div class="stat-card">
      <div id="statusText" class="stat-num" style="font-size: 16px; margin-top: 4px; color: #34d399;">IDLE</div>
      <div class="stat-label">Scraper State</div>
    </div>
  </div>

  <div class="config-box">
    <div class="toggle-row">
      <span class="toggle-label">Filter: Only WITHOUT Website</span>
      <input type="checkbox" id="onlyNoWebsite" checked>
    </div>
    <div class="toggle-row">
      <span class="toggle-label">Require Phone Number</span>
      <input type="checkbox" id="requirePhone">
    </div>
    <div class="toggle-row">
      <span class="toggle-label">Max Leads Limit</span>
      <input type="number" id="maxLeads" value="50" min="5" max="500" style="width: 60px; background: #0f172a; border: 1px solid #334155; color: #fff; padding: 2px 4px; border-radius: 4px; font-size: 11px;">
    </div>
  </div>

  <div class="actions">
    <button id="btnToggleScrape" class="btn btn-primary">Start Scraping DOM</button>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
      <button id="btnExportCsv" class="btn btn-success" disabled>Export to CSV</button>
      <button id="btnClear" class="btn btn-secondary">Clear</button>
    </div>
  </div>

  <div style="font-size: 11px; font-weight: 600; color: var(--muted); margin-bottom: 6px; display: flex; justify-content: space-between;">
    <span>Live Lead Feed</span>
    <span id="feedCount">0 items</span>
  </div>
  <div id="leadsList" class="lead-preview">
    <div class="no-leads">Search a business term on Google Maps (e.g. "plumbers in Austin") and click Start Scraping.</div>
  </div>

  <div class="footer-note">100% Client-side DOM scraping • Zero external API costs</div>

  <script src="popup.js"></script>
</body>
</html>`;

export const POPUP_JS = `let isScraping = false;
let leads = [];

const pageBadge = document.getElementById('pageBadge');
const noWebsiteCount = document.getElementById('noWebsiteCount');
const statusText = document.getElementById('statusText');
const btnToggleScrape = document.getElementById('btnToggleScrape');
const btnExportCsv = document.getElementById('btnExportCsv');
const btnClear = document.getElementById('btnClear');
const leadsList = document.getElementById('leadsList');
const feedCount = document.getElementById('feedCount');
const onlyNoWebsite = document.getElementById('onlyNoWebsite');
const requirePhone = document.getElementById('requirePhone');
const maxLeads = document.getElementById('maxLeads');

// Query active tab
async function getActiveTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
}

async function init() {
  const tab = await getActiveTab();
  if (!tab || !tab.url) {
    updateBadge(false);
    return;
  }

  const isMaps = tab.url.includes('google.') && tab.url.includes('/maps');
  updateBadge(isMaps);

  if (!isMaps) {
    btnToggleScrape.disabled = true;
    btnToggleScrape.textContent = 'Open Google Maps First';
    return;
  }

  // Ping content script to see state
  try {
    chrome.tabs.sendMessage(tab.id, { action: 'PING' }, (response) => {
      if (chrome.runtime.lastError || !response) {
        // Content script might need injection
        injectContentScript(tab.id);
      } else {
        isScraping = response.isScraping;
        updateScrapeUi();
        fetchLeads();
      }
    });
  } catch (e) {
    console.error(e);
  }
}

function updateBadge(isMaps) {
  if (isMaps) {
    pageBadge.textContent = 'Maps Ready';
    pageBadge.className = 'badge badge-active';
  } else {
    pageBadge.textContent = 'Not on Maps';
    pageBadge.className = 'badge badge-inactive';
  }
}

async function injectContentScript(tabId) {
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['content.js']
    });
    fetchLeads();
  } catch (err) {
    console.warn('Could not inject content script:', err);
  }
}

async function fetchLeads() {
  const tab = await getActiveTab();
  if (!tab) return;

  chrome.tabs.sendMessage(tab.id, { action: 'GET_LEADS' }, (res) => {
    if (res && res.leads) {
      leads = res.leads;
      renderLeads();
    }
  });
}

function renderLeads() {
  noWebsiteCount.textContent = leads.length;
  feedCount.textContent = \`\${leads.length} items\`;
  btnExportCsv.disabled = leads.length === 0;

  if (leads.length === 0) {
    leadsList.innerHTML = '<div class="no-leads">No leads extracted yet.</div>';
    return;
  }

  leadsList.innerHTML = leads.map(l => \`
    <div class="lead-item">
      <div>
        <div class="lead-name">\${escapeHtml(l.name)}</div>
        <div style="color: #94a3b8; font-size: 10px;">\${escapeHtml(l.category || 'Local Business')} • \${escapeHtml(l.address || 'Local')}</div>
      </div>
      <div class="lead-phone">\${escapeHtml(l.phone || 'No phone')}</div>
    </div>
  \`).join('');
}

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));
}

function updateScrapeUi() {
  if (isScraping) {
    btnToggleScrape.textContent = 'Stop Scraping';
    btnToggleScrape.className = 'btn btn-stop';
    statusText.textContent = 'SCRAPING...';
    statusText.style.color = '#f59e0b';
  } else {
    btnToggleScrape.textContent = 'Start Scraping DOM';
    btnToggleScrape.className = 'btn btn-primary';
    statusText.textContent = 'IDLE';
    statusText.style.color = '#34d399';
  }
}

btnToggleScrape.addEventListener('click', async () => {
  const tab = await getActiveTab();
  if (!tab) return;

  if (isScraping) {
    chrome.tabs.sendMessage(tab.id, { action: 'STOP_SCRAPE' }, () => {
      isScraping = false;
      updateScrapeUi();
      fetchLeads();
    });
  } else {
    const config = {
      onlyNoWebsite: onlyNoWebsite.checked,
      requirePhone: requirePhone.checked,
      maxLeads: parseInt(maxLeads.value, 10) || 50
    };
    chrome.tabs.sendMessage(tab.id, { action: 'START_SCRAPE', config }, () => {
      isScraping = true;
      updateScrapeUi();
    });
  }
});

btnExportCsv.addEventListener('click', async () => {
  const tab = await getActiveTab();
  if (!tab) return;
  chrome.tabs.sendMessage(tab.id, { action: 'EXPORT_CSV' });
});

btnClear.addEventListener('click', async () => {
  const tab = await getActiveTab();
  if (!tab) return;
  chrome.tabs.sendMessage(tab.id, { action: 'CLEAR_LEADS' }, () => {
    leads = [];
    renderLeads();
  });
});

// Listen for broadcast status updates from content script
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === 'STATUS_UPDATE') {
    if (msg.leads) {
      leads = msg.leads;
      renderLeads();
    }
    if (msg.status === 'SCRAPING_COMPLETED' || msg.status === 'FEED_NOT_FOUND') {
      isScraping = false;
      updateScrapeUi();
    }
  }
});

init();
// Auto refresh leads every 2 seconds while popup is open
setInterval(fetchLeads, 2000);
`;

export const BACKGROUND_JS = `// Background Service Worker for Google Maps Lead Scraper
chrome.runtime.onInstalled.addListener(() => {
  console.log('MapLead Scraper Extension installed successfully.');
});

// Relay messages if needed between popup and content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'DOWNLOAD_CSV') {
    chrome.downloads.download({
      url: request.dataUrl,
      filename: request.filename || 'google_maps_leads.csv',
      saveAs: true
    });
    sendResponse({ success: true });
    return true;
  }
});
`;

export const README_MD = `# Google Maps No-Website Lead Scraper (Chrome Extension)

Direct DOM scraper for Google Maps that identifies businesses that **do not have a website** and exports qualified leads to CSV for outreach and cold outreach lead generation.

## 🚀 Key Advantages
- **Zero API Costs**: Scrapes directly from the browser DOM in real time. Never pay for Google Places API credits ($17-$32 per 1,000 requests).
- **Find Prime Web Design / Marketing Clients**: Businesses without websites are the highest-converting prospects for web agencies, freelancers, and local SEO consultants.
- **Rich Data Capture**: Extracts Business Name, Phone Number, Rating, Review Count, Category, Address, and Google Maps URL.
- **Anti-Duplication**: Automatically handles deduplication and infinite scroll in the Google Maps feed.

## 📦 How to Install (Takes 30 Seconds)
1. Download or extract the extension ZIP package.
2. In Google Chrome (or Brave / Edge), navigate to: \`chrome://extensions\`
3. Toggle ON **Developer mode** in the top right corner.
4. Click **Load unpacked** in the top left corner.
5. Select this folder (the one containing \`manifest.json\`).
6. Pin the 📍 **MapLead Scraper** icon to your Chrome toolbar.

## 🎯 How to Use
1. Go to [Google Maps](https://maps.google.com).
2. Search for any business niche + city (e.g. \`dentists in Denver\` or \`roofers in Miami\` or \`plumbers in Austin\`).
3. Click the **MapLead Scraper** icon in your browser toolbar.
4. Toggle **"Only WITHOUT Website"** (ON by default).
5. Click **"Start Scraping DOM"**.
6. Watch it auto-scroll and collect high-value leads.
7. Click **"Export to CSV"** to download your spreadsheet.
`;

export const CONSOLE_SCRIPT_JS = `/**
 * INSTANT GOOGLE MAPS NO-WEBSITE SCRAPER (DevTools Snippet)
 * Paste this directly into the Console on maps.google.com to scrape without installing anything!
 */
(async function scrapeGoogleMapsNoWebsite() {
  console.log('%c[MapLead Scraper] Starting Google Maps DOM Scraper...', 'color: #3b82f6; font-weight: bold; font-size: 14px;');

  const feed = document.querySelector('div[role="feed"]');
  if (!feed) {
    alert('Please run a search on Google Maps first so the results feed is visible on the left!');
    return;
  }

  const leads = new Map();
  const maxResults = 100;
  let noNewItems = 0;
  let lastHeight = 0;

  console.log('%cFiltering for businesses WITHOUT websites...', 'color: #10b981; font-weight: bold;');

  while (leads.size < maxResults && noNewItems < 4) {
    const cards = feed.querySelectorAll('div.Nv2PK, div[role="article"]');
    
    cards.forEach(card => {
      const nameEl = card.querySelector('.qBF1Pd, .fontHeadlineSmall') || card.querySelector('a.hfpxzc');
      const name = nameEl ? (nameEl.getAttribute('aria-label') || nameEl.textContent || '').trim() : '';
      if (!name) return;

      // Website check: Action button or external links
      const websiteBtn = card.querySelector('a[data-value="Website"], a[aria-label*="website" i], a[data-tooltip*="website" i]');
      const externalLink = Array.from(card.querySelectorAll('a[href^="http"]')).some(a => !a.href.includes('google.') && !a.href.includes('gstatic.'));

      if (websiteBtn || externalLink) {
        return; // Has website, skip!
      }

      // Extract phone & details
      const linkEl = card.querySelector('a.hfpxzc');
      const mapsUrl = linkEl ? linkEl.href : window.location.href;
      
      const ratingEl = card.querySelector('span.MW4etd');
      const rating = ratingEl ? ratingEl.textContent.trim() : 'N/A';
      
      const reviewsEl = card.querySelector('span.UY7F9');
      const reviews = reviewsEl ? reviewsEl.textContent.replace(/[^0-9]/g, '') : '0';

      const lines = Array.from(card.querySelectorAll('.W4Efsd')).map(e => e.textContent.trim());
      let category = 'Local Business';
      let phone = 'Not listed';
      let address = '';

      const phoneMatch = lines.join(' ').match(/(?:\\+?\\d{1,3}[-.\\s]?)?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}/);
      if (phoneMatch) phone = phoneMatch[0].trim();

      lines.forEach(l => {
        if (l.includes('·')) {
          const parts = l.split('·');
          if (parts[0]) category = parts[0].trim();
          if (parts[1]) address = parts[1].trim();
        }
      });

      const key = name.toLowerCase() + '|' + address.toLowerCase();
      if (!leads.has(key)) {
        leads.set(key, { name, category, phone, rating, reviews, address, mapsUrl });
        console.log(\`[+] Found lead: \${name} | Phone: \${phone}\`);
      }
    });

    lastHeight = feed.scrollHeight;
    feed.scrollTop = feed.scrollHeight;
    await new Promise(r => setTimeout(r, 1600));

    if (feed.scrollHeight === lastHeight) {
      noNewItems++;
    } else {
      noNewItems = 0;
    }
  }

  const items = Array.from(leads.values());
  console.log(\`%cScraping done! Found \${items.length} businesses with NO website.\`, 'color: #10b981; font-weight: bold; font-size: 14px;');

  if (items.length === 0) {
    alert('No businesses without websites found in the visible results.');
    return;
  }

  // Export CSV
  const csvRows = [
    ['Business Name', 'Category', 'Phone', 'Rating', 'Reviews', 'Address', 'Google Maps URL'],
    ...items.map(i => [
      \`"\${i.name.replace(/"/g, '""')}"\`,
      \`"\${i.category.replace(/"/g, '""')}"\`,
      \`"\${i.phone.replace(/"/g, '""')}"\`,
      \`"\${i.rating}"\`,
      \`"\${i.reviews}"\`,
      \`"\${i.address.replace(/"/g, '""')}"\`,
      \`"\${i.mapsUrl}"\`
    ])
  ];

  const blob = new Blob(['\\uFEFF' + csvRows.map(r => r.join(',')).join('\\r\\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = \`google_maps_no_website_\${new Date().toISOString().slice(0, 10)}.csv\`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  console.log('%cCSV file downloaded successfully!', 'color: #3b82f6; font-weight: bold;');
})();
`;

export const EXTENSION_FILES: ExtensionFileItem[] = [
  {
    name: 'manifest.json',
    path: 'manifest.json',
    description: 'Manifest V3 configuration with activeTab, scripting, storage, and host permissions',
    language: 'json',
    content: MANIFEST_JSON
  },
  {
    name: 'content.js',
    path: 'content.js',
    description: 'DOM scraping engine that detects result feed cards, checks for website buttons, extracts data & handles auto-scroll',
    language: 'javascript',
    content: CONTENT_JS
  },
  {
    name: 'popup.html',
    path: 'popup.html',
    description: 'Chrome Extension toolbar popup interface with real-time stats and filters',
    language: 'html',
    content: POPUP_HTML
  },
  {
    name: 'popup.js',
    path: 'popup.js',
    description: 'Popup controller handling user actions, messaging with content script, and lead rendering',
    language: 'javascript',
    content: POPUP_JS
  },
  {
    name: 'background.js',
    path: 'background.js',
    description: 'Background service worker for lifecycle management and CSV download bridging',
    language: 'javascript',
    content: BACKGROUND_JS
  },
  {
    name: 'README.md',
    path: 'README.md',
    description: '30-second installation and quick-start guide for Chrome, Brave, and Edge',
    language: 'markdown',
    content: README_MD
  }
];
