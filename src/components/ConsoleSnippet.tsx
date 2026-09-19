import React, { useState } from 'react';
import { CONSOLE_SCRIPT_JS } from '../extension-files';
import { Copy, Check, Terminal, ExternalLink, Zap, ShieldCheck } from 'lucide-react';

export const ConsoleSnippet: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(CONSOLE_SCRIPT_JS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
              <Terminal className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Zero-Install DevTools Console Script
            </h3>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Instant Run
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Don't want to install the extension right now? Paste this single snippet into your Chrome DevTools Console directly on Google Maps to scrape and auto-download CSV immediately!
          </p>
        </div>

        <button
          id="btn-copy-console-script"
          onClick={handleCopy}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-blue-400 hover:bg-blue-300 rounded-lg shadow-sm transition flex-shrink-0"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-slate-950" />
              <span>Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Full Script</span>
            </>
          )}
        </button>
      </div>

      {/* 3 Quick Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-slate-950/60 border-b border-slate-800 text-xs">
        <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
          <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0">
            1
          </span>
          <div>
            <span className="font-semibold text-slate-200">Open Google Maps</span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Go to <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="text-blue-400 underline">maps.google.com</a> and search for any niche (e.g. "plumbers in Miami").
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
          <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0">
            2
          </span>
          <div>
            <span className="font-semibold text-slate-200">Open Console</span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Press <kbd className="bg-slate-800 px-1 rounded text-slate-300">F12</kbd> (or Cmd+Opt+I on Mac) and switch to the <strong>Console</strong> tab.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
          <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0">
            3
          </span>
          <div>
            <span className="font-semibold text-slate-200">Paste & Press Enter</span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Paste the snippet below and press Enter. It scrolls the feed, filters no-website leads, and downloads CSV.
            </p>
          </div>
        </div>
      </div>

      {/* Code Snippet Box */}
      <div className="relative bg-slate-950 p-4 font-mono text-xs text-slate-300 max-h-[300px] overflow-y-auto">
        <pre className="text-[11px] leading-relaxed select-all">
          {CONSOLE_SCRIPT_JS}
        </pre>
      </div>
    </div>
  );
};
