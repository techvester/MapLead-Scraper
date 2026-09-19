import React from 'react';
import { GOOGLE_MAPS_DOM_SELECTORS_EXPLAINED } from '../data/mock-maps-data';
import { Layers, Terminal, Sparkles, CheckCircle2, ShieldCheck, Code } from 'lucide-react';

export const DomGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
          <Layers className="w-5 h-5 text-blue-400" />
          <div>
            <h3 className="text-base font-bold text-white">Google Maps DOM Selector Architecture</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              How the zero-API DOM scraper parses Google Maps search results in real time
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {GOOGLE_MAPS_DOM_SELECTORS_EXPLAINED.map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-white">{item.target}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                    DOM Target
                  </span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-emerald-400 break-all mb-2.5">
                  {item.selector}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.purpose}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Website Absence Detection Deep Dive */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">
            How The Absence Of A Website Is Reliably Determined
          </h4>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Google Maps places an explicit action button or external link on cards for businesses that provided a website URL. When a business has not provided a website during registration or Google Business Profile verification:
        </p>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
            <span className="font-semibold text-emerald-400">1. Action Button Absent</span>
            <p className="text-slate-400 mt-1">
              Google Maps does not render the <code className="text-slate-200">&lt;a data-value="Website"&gt;</code> button in the card actions bar.
            </p>
          </div>
          <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
            <span className="font-semibold text-emerald-400">2. No External Link Tag</span>
            <p className="text-slate-400 mt-1">
              No anchor element points to any non-Google domain (excluding <code className="text-slate-200">*.google.com</code> and <code className="text-slate-200">*.gstatic.com</code>).
            </p>
          </div>
          <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
            <span className="font-semibold text-emerald-400">3. Verified Fallback</span>
            <p className="text-slate-400 mt-1">
              In deep panel view, the authoritative URL container (<code className="text-slate-200">[data-item-id="authority"]</code>) remains unpopulated.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
