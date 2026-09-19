import React, { useState } from 'react';
import { Download, Code2, Sparkles, Check, Globe, ShieldCheck } from 'lucide-react';
import { downloadExtensionZip } from '../utils/zip-generator';
import { CONSOLE_SCRIPT_JS } from '../extension-files';

interface NavbarProps {
  activeTab: 'simulator' | 'code' | 'install' | 'guide';
  setActiveTab: (tab: 'simulator' | 'code' | 'install' | 'guide') => void;
  leadsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, leadsCount }) => {
  const [downloading, setDownloading] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadExtensionZip();
    } finally {
      setTimeout(() => setDownloading(false), 800);
    }
  };

  const handleCopySnippet = async () => {
    await navigator.clipboard.writeText(CONSOLE_SCRIPT_JS);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-black text-lg">
              📍
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white">MapLead Scraper</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Zero API Cost
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Chrome Extension V3
                </span>
              </div>
              <p className="text-xs text-slate-400">Direct DOM Scraper for Google Maps • Finds Businesses Without Websites</p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-950/60 p-1 rounded-lg border border-slate-800">
            <button
              id="nav-tab-simulator"
              onClick={() => setActiveTab('simulator')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === 'simulator'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              DOM Simulator & Leads {leadsCount > 0 && <span className="ml-1.5 px-1.5 py-0.2 bg-emerald-500 text-slate-950 font-bold rounded-full text-[10px]">{leadsCount}</span>}
            </button>
            <button
              id="nav-tab-code"
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === 'code'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Extension Code ({6} files)
            </button>
            <button
              id="nav-tab-install"
              onClick={() => setActiveTab('install')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === 'install'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Install Guide (30s)
            </button>
            <button
              id="nav-tab-guide"
              onClick={() => setActiveTab('guide')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === 'guide'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              DOM Selectors & Logic
            </button>
          </nav>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              id="btn-copy-instant-snippet"
              onClick={handleCopySnippet}
              title="Copy instant console script for maps.google.com"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition"
            >
              {copiedSnippet ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Script Copied!</span>
                </>
              ) : (
                <>
                  <Code2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>DevTools Snippet</span>
                </>
              )}
            </button>

            <button
              id="btn-download-extension-zip"
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md shadow-blue-600/30 transition disabled:opacity-50"
            >
              <Download className={`w-3.5 h-3.5 ${downloading ? 'animate-bounce' : ''}`} />
              <span>{downloading ? 'Packing ZIP...' : 'Download Extension (.ZIP)'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1 border-t border-slate-800">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-2.5 py-1 text-xs font-medium rounded whitespace-nowrap ${
              activeTab === 'simulator' ? 'bg-blue-600 text-white' : 'text-slate-400'
            }`}
          >
            DOM Simulator ({leadsCount})
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-2.5 py-1 text-xs font-medium rounded whitespace-nowrap ${
              activeTab === 'code' ? 'bg-blue-600 text-white' : 'text-slate-400'
            }`}
          >
            Source Code
          </button>
          <button
            onClick={() => setActiveTab('install')}
            className={`px-2.5 py-1 text-xs font-medium rounded whitespace-nowrap ${
              activeTab === 'install' ? 'bg-blue-600 text-white' : 'text-slate-400'
            }`}
          >
            Installation Guide
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-2.5 py-1 text-xs font-medium rounded whitespace-nowrap ${
              activeTab === 'guide' ? 'bg-blue-600 text-white' : 'text-slate-400'
            }`}
          >
            DOM Selectors
          </button>
        </div>
      </div>
    </header>
  );
};
