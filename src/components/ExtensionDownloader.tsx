import React, { useState } from 'react';
import { Download, CheckCircle2, Shield, Zap, FileSpreadsheet, Layers, Sparkles } from 'lucide-react';
import { downloadExtensionZip } from '../utils/zip-generator';
import { EXTENSION_FILES } from '../extension-files';

export const ExtensionDownloader: React.FC = () => {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadExtensionZip();
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      <div className="absolute -right-12 -top-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Ready to Install • Manifest V3
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              $0 / Month • Zero API Keys
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Google Maps No-Website Lead Scraper Extension
          </h2>
          <p className="mt-1.5 text-sm text-slate-300 leading-relaxed">
            Directly extracts Google Maps business listings that have <span className="text-emerald-400 font-semibold">no website registered</span> straight from the browser DOM. Complete with auto-scrolling, contact phone number extraction, and instant CSV export.
          </p>

          {/* Value props */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Direct DOM (No API cost)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>1-Click CSV Export</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span>Auto-scrolls search feed</span>
            </div>
          </div>
        </div>

        {/* Action Button & Files Badge */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto flex-shrink-0">
          <button
            id="btn-main-download-zip"
            onClick={handleDownload}
            disabled={downloading}
            className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {downloaded ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Downloaded! Check Downloads Folder</span>
              </>
            ) : (
              <>
                <Download className={`w-4 h-4 ${downloading ? 'animate-bounce' : ''}`} />
                <span>{downloading ? 'Generating ZIP package...' : 'Download Chrome Extension (.ZIP)'}</span>
              </>
            )}
          </button>

          <div className="text-center text-[11px] text-slate-400">
            Contains all {EXTENSION_FILES.length} files + icons. Ready for <code className="text-slate-300 bg-slate-800 px-1 py-0.5 rounded">chrome://extensions</code>
          </div>
        </div>
      </div>
    </div>
  );
};
