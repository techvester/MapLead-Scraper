import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, RefreshCw, FileSpreadsheet, Filter, CheckCircle2, XCircle, Search, Sparkles, MapPin, Phone, Star, AlertCircle, ArrowDown } from 'lucide-react';
import { BusinessLead, ScraperConfig, ScraperStats } from '../types';
import { SAMPLE_NICHES, SampleNichePreset } from '../data/mock-maps-data';
import { downloadLeadsCsv, copyLeadsToClipboard } from '../utils/csv-exporter';

interface LiveSimulatorProps {
  leads: BusinessLead[];
  setLeads: React.Dispatch<React.SetStateAction<BusinessLead[]>>;
}

export const LiveSimulator: React.FC<LiveSimulatorProps> = ({ leads, setLeads }) => {
  const [selectedPreset, setSelectedPreset] = useState<SampleNichePreset>(SAMPLE_NICHES[0]);
  const [customSearchQuery, setCustomSearchQuery] = useState(SAMPLE_NICHES[0].query);
  
  const [config, setConfig] = useState<ScraperConfig>({
    onlyNoWebsite: true,
    autoScroll: true,
    scrollDelayMs: 900,
    maxLeads: 50,
    requirePhone: false,
    minRating: 0
  });

  const [stats, setStats] = useState<ScraperStats>({
    scannedTotal: 0,
    noWebsiteFound: 0,
    withWebsiteSkipped: 0,
    phoneCaptured: 0,
    status: 'idle'
  });

  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);
  const [domLog, setDomLog] = useState<string[]>([]);
  const [copiedCsv, setCopiedCsv] = useState(false);

  const isScrapingRef = useRef(false);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const feedContainerRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    setDomLog(prev => [...prev.slice(-40), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [domLog]);

  const handleSelectPreset = (preset: SampleNichePreset) => {
    setSelectedPreset(preset);
    setCustomSearchQuery(preset.query);
    handleStop();
    addLog(`Switched target search to: "${preset.query}"`);
  };

  const handleStart = async () => {
    if (stats.status === 'scraping') return;

    isScrapingRef.current = true;
    setStats(prev => ({ ...prev, status: 'scraping' }));
    addLog(`Starting DOM Scraper for query: "${customSearchQuery}"...`);
    addLog(`Targeting feed element: div[role="feed"]`);

    const pool = selectedPreset.leads;
    let scanned = 0;
    let noWebCount = 0;
    let skipped = 0;
    let phoneCount = 0;

    for (let i = 0; i < pool.length; i++) {
      if (!isScrapingRef.current) break;

      setActiveItemIndex(i);
      const item = pool[i];
      scanned++;

      // Simulate DOM element inspection
      addLog(`Inspecting DOM card #${i + 1}: "${item.name}"`);
      await sleep(config.scrollDelayMs * 0.4);

      if (!isScrapingRef.current) break;

      if (item.hasWebsite) {
        skipped++;
        addLog(`  ⚠️ Found website link: "${item.websiteUrl || 'External URL'}" -> ${config.onlyNoWebsite ? 'SKIPPED (Has Website)' : 'Recorded'}`);
      } else {
        noWebCount++;
        if (item.phone && item.phone !== 'Not listed') phoneCount++;
        addLog(`  🎯 NO website button detected! -> Extracted Phone: ${item.phone || 'None'} -> QUALIFIED LEAD!`);

        // Check if already in leads
        setLeads(prev => {
          if (prev.some(l => l.name === item.name)) return prev;
          return [item, ...prev];
        });
      }

      setStats({
        scannedTotal: scanned,
        noWebsiteFound: noWebCount,
        withWebsiteSkipped: skipped,
        phoneCaptured: phoneCount,
        status: 'scraping'
      });

      // Scroll mock feed
      if (feedContainerRef.current) {
        feedContainerRef.current.scrollTop = (i + 1) * 90;
      }

      await sleep(config.scrollDelayMs * 0.6);
    }

    if (isScrapingRef.current) {
      addLog(`Reached end of Google Maps feed (.HlvSq). Scraping session completed!`);
      setStats(prev => ({ ...prev, status: 'completed' }));
      isScrapingRef.current = false;
      setActiveItemIndex(null);
    }
  };

  const handleStop = () => {
    isScrapingRef.current = false;
    setActiveItemIndex(null);
    setStats(prev => ({ ...prev, status: 'idle' }));
    addLog('Scraping stopped by user.');
  };

  const handleClear = () => {
    handleStop();
    setLeads([]);
    setDomLog([]);
    setStats({
      scannedTotal: 0,
      noWebsiteFound: 0,
      withWebsiteSkipped: 0,
      phoneCaptured: 0,
      status: 'idle'
    });
    addLog('Cleared leads and reset simulator.');
  };

  const handleExport = () => {
    downloadLeadsCsv(leads, `google_maps_leads_${selectedPreset.id}.csv`);
  };

  const handleCopy = async () => {
    const ok = await copyLeadsToClipboard(leads);
    if (ok) {
      setCopiedCsv(true);
      setTimeout(() => setCopiedCsv(false), 2000);
    }
  };

  function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Filtered leads calculation
  const displayedPool = selectedPreset.leads;

  return (
    <div className="space-y-6">
      {/* Top Controls & Preset Picker */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Interactive Google Maps DOM Scraper Simulator
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Experience the exact DOM extraction mechanics that run inside the Chrome Extension without any external API calls.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-400 font-medium mr-1">Sample Niche:</span>
            {SAMPLE_NICHES.map(p => (
              <button
                key={p.id}
                id={`preset-${p.id}`}
                onClick={() => handleSelectPreset(p)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition ${
                  selectedPreset.id === p.id
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Bar & Scraping Trigger */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-200">
              <input
                id="checkbox-only-no-website"
                type="checkbox"
                checked={config.onlyNoWebsite}
                onChange={e => setConfig(c => ({ ...c, onlyNoWebsite: e.target.checked }))}
                className="w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-700 focus:ring-0"
              />
              <span className="font-medium text-emerald-400">Only Leads WITHOUT Website</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                id="checkbox-require-phone"
                type="checkbox"
                checked={config.requirePhone}
                onChange={e => setConfig(c => ({ ...c, requirePhone: e.target.checked }))}
                className="w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-700 focus:ring-0"
              />
              <span>Require Phone Number</span>
            </label>

            <div className="flex items-center gap-2 text-slate-400">
              <span>Scroll delay:</span>
              <select
                value={config.scrollDelayMs}
                onChange={e => setConfig(c => ({ ...c, scrollDelayMs: Number(e.target.value) }))}
                className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded px-2 py-1"
              >
                <option value="500">Fast (500ms)</option>
                <option value="900">Normal (900ms)</option>
                <option value="1600">Stealth / Safe (1.6s)</option>
              </select>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex items-center gap-2">
            {stats.status === 'scraping' ? (
              <button
                id="btn-stop-scraping"
                onClick={handleStop}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-sm transition"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop Scraper</span>
              </button>
            ) : (
              <button
                id="btn-start-scraping"
                onClick={handleStart}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-md shadow-emerald-600/20 transition"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run DOM Scraper</span>
              </button>
            )}

            <button
              id="btn-clear-leads"
              onClick={handleClear}
              title="Reset results"
              className="p-2 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Live Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 text-center">
          <div className="text-2xl font-black text-white">{stats.scannedTotal}</div>
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-1">Cards Scanned</div>
        </div>

        <div className="bg-slate-900/90 border border-emerald-500/30 rounded-xl p-3.5 text-center bg-emerald-500/5">
          <div className="text-2xl font-black text-emerald-400">{leads.length}</div>
          <div className="text-[11px] font-medium text-emerald-300 uppercase tracking-wider mt-1">No-Website Leads</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 text-center">
          <div className="text-2xl font-black text-amber-400">{stats.withWebsiteSkipped}</div>
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-1">With Website (Skipped)</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 text-center">
          <div className="text-2xl font-black text-blue-400">
            {stats.scannedTotal > 0 ? `${Math.round((leads.length / stats.scannedTotal) * 100)}%` : '0%'}
          </div>
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-1">Target Conversion Rate</div>
        </div>
      </div>

      {/* Dual Panel: Mock Google Maps Feed vs Live DOM Inspector Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Mock Maps Feed (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden shadow-lg">
          {/* Mock Maps Header */}
          <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <div className="ml-2 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-mono flex items-center gap-1.5">
                <Search className="w-3 h-3 text-slate-500" />
                <span>maps.google.com/maps/search/{encodeURIComponent(customSearchQuery)}</span>
              </div>
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              div[role="feed"]
            </div>
          </div>

          {/* Results Feed */}
          <div
            ref={feedContainerRef}
            className="p-3 space-y-2.5 max-h-[420px] overflow-y-auto scroll-smooth divide-y divide-slate-800/60"
          >
            {displayedPool.map((item, index) => {
              const isActive = activeItemIndex === index;
              const isSaved = leads.some(l => l.name === item.name);

              return (
                <div
                  key={item.id}
                  className={`pt-2.5 first:pt-0 transition-all duration-300 rounded-lg p-2.5 ${
                    isActive
                      ? 'ring-2 ring-blue-500 bg-blue-950/30'
                      : isSaved
                      ? 'bg-emerald-950/20 border border-emerald-500/30'
                      : item.hasWebsite
                      ? 'opacity-60 bg-slate-950/40'
                      : 'bg-slate-950/60 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate">{item.name}</span>
                        {item.hasWebsite ? (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
                            Has Website
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            NO WEBSITE
                          </span>
                        )}
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                        {item.rating && (
                          <span className="flex items-center gap-0.5 text-amber-300 font-semibold">
                            <Star className="w-3 h-3 fill-current" />
                            {item.rating} ({item.reviewsCount})
                          </span>
                        )}
                        <span>•</span>
                        <span>{item.category}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          {item.address}
                        </span>
                      </div>

                      {item.phone && (
                        <div className="mt-1 flex items-center gap-1 text-[11px] text-blue-400 font-mono">
                          <Phone className="w-3 h-3" />
                          <span>{item.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Action button simulation */}
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      {item.hasWebsite ? (
                        <span className="text-[10px] text-slate-500 font-mono px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded">
                          &lt;a data-value="Website"&gt;
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-400 font-mono px-1.5 py-0.5 bg-emerald-950/60 border border-emerald-700/50 rounded">
                          [No &lt;a&gt; website]
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* End of list marker */}
            <div className="py-3 text-center text-xs text-slate-500 border-t border-slate-800/80">
              <span className="font-mono text-[11px]">.HlvSq</span> • You've reached the end of the Google Maps list.
            </div>
          </div>
        </div>

        {/* Live DOM Inspector Terminal (5 cols) */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-xl flex flex-col overflow-hidden shadow-lg">
          <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-slate-200">DOM Scraper Terminal</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Zero-API Content Script</span>
          </div>

          <div
            ref={logContainerRef}
            className="p-3 font-mono text-[11px] text-slate-300 space-y-1.5 h-[380px] overflow-y-auto bg-slate-950"
          >
            {domLog.length === 0 ? (
              <div className="text-slate-500 italic py-6 text-center">
                Click "Run DOM Scraper" above to observe the real-time DOM traversal and selector matching logic.
              </div>
            ) : (
              domLog.map((log, i) => (
                <div
                  key={i}
                  className={`${
                    log.includes('QUALIFIED LEAD')
                      ? 'text-emerald-400 font-bold bg-emerald-950/30 px-1 py-0.5 rounded'
                      : log.includes('SKIPPED')
                      ? 'text-slate-500'
                      : log.includes('Inspecting')
                      ? 'text-blue-300'
                      : 'text-slate-400'
                  }`}
                >
                  {log}
                </div>
              ))
            )}
          </div>

          <div className="p-2.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Filter: {config.onlyNoWebsite ? 'Only No-Website' : 'All'}</span>
            <span className="font-mono text-emerald-400">{leads.length} leads in memory</span>
          </div>
        </div>
      </div>

      {/* Export & Lead Action Bar */}
      {leads.length > 0 && (
        <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                {leads.length} High-Value No-Website Leads Captured
              </div>
              <p className="text-xs text-slate-400">
                Ready for cold outreach, local SEO pitches, and web design proposals.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              id="btn-copy-csv-clipboard"
              onClick={handleCopy}
              className="flex-1 sm:flex-initial px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition"
            >
              {copiedCsv ? 'Copied to Clipboard!' : 'Copy as CSV'}
            </button>
            <button
              id="btn-download-csv-leads"
              onClick={handleExport}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow transition"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Download CSV File</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
