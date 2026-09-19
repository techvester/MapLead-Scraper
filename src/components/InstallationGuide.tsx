import React from 'react';
import { Download, CheckCircle, Chrome, ShieldAlert, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import { downloadExtensionZip } from '../utils/zip-generator';

export const InstallationGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Step by step installation */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
                <Chrome className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-bold text-white">How to Install in 30 Seconds</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Works seamlessly on Google Chrome, Brave, Microsoft Edge, and Opera (Chromium browsers).
            </p>
          </div>

          <button
            onClick={() => downloadExtensionZip()}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow transition flex-shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .ZIP Now</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          {/* Step 1 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                1
              </div>
              <h4 className="text-sm font-semibold text-white">Download & Unzip</h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Click the download button to get <code className="text-slate-200">google-maps-no-website-scraper.zip</code>. Unzip the folder on your computer.
              </p>
            </div>
            <div className="mt-4 text-[11px] text-blue-400 font-mono">
              Includes manifest.json & scripts
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                2
              </div>
              <h4 className="text-sm font-semibold text-white">Open Extensions</h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                In your browser URL bar, navigate to:
              </p>
              <div className="mt-2 p-1.5 bg-slate-900 rounded font-mono text-[11px] text-emerald-400 border border-slate-800">
                chrome://extensions
              </div>
            </div>
            <div className="mt-4 text-[11px] text-slate-400">
              Or Brave / Edge extensions page
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                3
              </div>
              <h4 className="text-sm font-semibold text-white">Enable Developer Mode</h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                In the top-right corner of the Extensions tab, toggle <strong className="text-white">Developer mode</strong> ON.
              </p>
            </div>
            <div className="mt-4 text-[11px] text-amber-400 font-semibold">
              Top right toggle switch
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                4
              </div>
              <h4 className="text-sm font-semibold text-white">Click "Load Unpacked"</h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Click <strong className="text-white">Load unpacked</strong> (top-left) and select the unzipped directory. The extension is now active!
              </p>
            </div>
            <div className="mt-4 text-[11px] text-emerald-400 font-semibold">
              Ready for immediate scraping!
            </div>
          </div>
        </div>
      </div>

      {/* Practical Lead Generation Strategy */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-6">
        <h4 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Why "No Website" Google Maps Leads Are So Valuable</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs text-slate-300 leading-relaxed">
          <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
            <div className="font-semibold text-emerald-400 mb-1">Highest Conversion Rates</div>
            These businesses clearly have revenue (they have real customers leaving reviews), but lack even a simple landing page. They are the ideal prospects for web design and local SEO pitches.
          </div>
          <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
            <div className="font-semibold text-blue-400 mb-1">Direct Phone Contact</div>
            Because they rely heavily on Google Maps calls, their phone numbers are active, direct lines to business owners or dispatchers rather than gated corporate switchboards.
          </div>
          <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
            <div className="font-semibold text-amber-400 mb-1">$0 Scraping Overhead</div>
            Instead of paying $17-$32 per 1,000 queries on Google Places API, this tool directly inspects the HTML DOM rendered in your browser with zero billing overhead.
          </div>
        </div>
      </div>

      {/* FAQ / Troubleshooting */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h4 className="text-base font-bold text-white flex items-center gap-2 mb-4">
          <HelpCircle className="w-4 h-4 text-blue-400" />
          <span>Frequently Asked Questions</span>
        </h4>
        <div className="space-y-3 text-xs">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80">
            <div className="font-semibold text-white">Why does the popup say "Not on Maps"?</div>
            <div className="text-slate-400 mt-1">
              The scraper only runs on <code className="text-blue-300">maps.google.com</code>. Open Google Maps in an active tab, run your search query, then click the extension icon.
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80">
            <div className="font-semibold text-white">How does it know a business has NO website?</div>
            <div className="text-slate-400 mt-1">
              Google Maps adds a specific action button (<code className="text-slate-300">&lt;a data-value="Website"&gt;</code>) or external link on cards for businesses with a website. If this anchor tag is absent from the card's DOM, the scraper flags it as having no website.
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80">
            <div className="font-semibold text-white">Is it safe from rate-limiting?</div>
            <div className="text-slate-400 mt-1">
              Yes. The extension scrolls smoothly at human-like reading speeds (customizable from 500ms to 1600ms), simulating standard browser viewing without triggering bot protections.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
