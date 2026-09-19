import React, { useState } from 'react';
import { BusinessLead } from './types';
import { SAMPLE_NICHES } from './data/mock-maps-data';
import { Navbar } from './components/Navbar';
import { ExtensionDownloader } from './components/ExtensionDownloader';
import { LiveSimulator } from './components/LiveSimulator';
import { LeadsTable } from './components/LeadsTable';
import { ConsoleSnippet } from './components/ConsoleSnippet';
import { CodeViewer } from './components/CodeViewer';
import { InstallationGuide } from './components/InstallationGuide';
import { DomGuide } from './components/DomGuide';
import { downloadExtensionZip } from './utils/zip-generator';
import { Download, Sparkles, MapPin, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'code' | 'install' | 'guide'>('simulator');
  
  // Pre-seed with the no-website leads from Austin plumbers sample so user sees working data immediately
  const initialLeads = SAMPLE_NICHES[0].leads.filter(l => !l.hasWebsite);
  const [leads, setLeads] = useState<BusinessLead[]>(initialLeads);

  const handleClearLeads = () => {
    setLeads([]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        leadsCount={leads.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Top Hero Downloader Banner */}
        <ExtensionDownloader />

        {/* Tab 1: Simulator & Leads */}
        {activeTab === 'simulator' && (
          <div className="space-y-6">
            <LiveSimulator leads={leads} setLeads={setLeads} />
            <LeadsTable leads={leads} onClear={handleClearLeads} />
            <ConsoleSnippet />
          </div>
        )}

        {/* Tab 2: Full Source Code */}
        {activeTab === 'code' && (
          <div className="space-y-6">
            <CodeViewer />
            <ConsoleSnippet />
          </div>
        )}

        {/* Tab 3: Installation Guide */}
        {activeTab === 'install' && (
          <div className="space-y-6">
            <InstallationGuide />
            <ConsoleSnippet />
          </div>
        )}

        {/* Tab 4: DOM Architecture & Selectors */}
        {activeTab === 'guide' && (
          <div className="space-y-6">
            <DomGuide />
            <CodeViewer />
          </div>
        )}
      </main>

      {/* Clean Footer */}
      <footer className="mt-12 border-t border-slate-900 bg-slate-950 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">MapLead Scraper</span>
            <span>•</span>
            <span>Zero-API DOM Scraper & Lead Generator</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setActiveTab('simulator')}
              className="hover:text-slate-200 transition"
            >
              DOM Simulator
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className="hover:text-slate-200 transition"
            >
              Source Code
            </button>
            <button
              onClick={() => setActiveTab('install')}
              className="hover:text-slate-200 transition"
            >
              Installation (30s)
            </button>
            <button
              onClick={() => downloadExtensionZip()}
              className="text-blue-400 hover:text-blue-300 font-semibold transition"
            >
              Download ZIP
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
