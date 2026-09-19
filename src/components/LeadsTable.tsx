import React, { useState } from 'react';
import { BusinessLead } from '../types';
import { FileSpreadsheet, Copy, Check, ExternalLink, Phone, Search, Trash2, Globe, Sparkles } from 'lucide-react';
import { downloadLeadsCsv, copyLeadsToClipboard } from '../utils/csv-exporter';

interface LeadsTableProps {
  leads: BusinessLead[];
  onClear: () => void;
}

export const LeadsTable: React.FC<LeadsTableProps> = ({ leads, onClear }) => {
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const filtered = leads.filter(l => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      l.name.toLowerCase().includes(q) ||
      (l.category && l.category.toLowerCase().includes(q)) ||
      (l.phone && l.phone.toLowerCase().includes(q)) ||
      (l.address && l.address.toLowerCase().includes(q))
    );
  });

  const handleCopyPhone = (id: string, phone?: string) => {
    if (!phone || phone === 'Not listed') return;
    navigator.clipboard.writeText(phone);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleCopyAll = async () => {
    const ok = await copyLeadsToClipboard(filtered);
    if (ok) {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-950/40">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white tracking-tight">Scraped Business Leads</h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {leads.length} Collected
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified listings with contact details extracted from Google Maps search results
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search bar */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="input-search-leads"
              type="text"
              placeholder="Search leads..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            id="btn-table-copy-csv"
            onClick={handleCopyAll}
            disabled={filtered.length === 0}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition disabled:opacity-50 flex items-center gap-1.5"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAll ? 'Copied' : 'Copy CSV'}</span>
          </button>

          <button
            id="btn-table-download-csv"
            onClick={() => downloadLeadsCsv(filtered)}
            disabled={filtered.length === 0}
            className="px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm transition disabled:opacity-50 flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          {leads.length > 0 && (
            <button
              id="btn-table-clear"
              onClick={onClear}
              title="Clear all leads"
              className="p-2 text-slate-400 hover:text-rose-400 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold text-[10px]">
              <th className="py-3 px-4">Business Name</th>
              <th className="py-3 px-4">Website Status</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Phone Number</th>
              <th className="py-3 px-4">Rating & Reviews</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4 text-right">Maps Link</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  <div className="max-w-xs mx-auto space-y-2">
                    <Sparkles className="w-6 h-6 text-slate-500 mx-auto" />
                    <div className="font-semibold text-slate-300">No leads to display yet</div>
                    <div className="text-[11px] text-slate-400">
                      Use the simulator above or install the extension to extract businesses without websites from Google Maps.
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-slate-800/40 transition group text-slate-200"
                >
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-100">{lead.name}</div>
                    <div className="text-[10px] text-slate-400">Scraped: {lead.scrapedAt}</div>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    {lead.hasWebsite ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
                        Has Website
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        <Sparkles className="w-2.5 h-2.5" />
                        NO WEBSITE (Prime Lead)
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap text-slate-300 font-medium">
                    {lead.category || 'Local Business'}
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    {lead.phone && lead.phone !== 'Not listed' ? (
                      <button
                        onClick={() => handleCopyPhone(lead.id, lead.phone)}
                        className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-mono bg-blue-500/10 hover:bg-blue-500/20 px-2 py-1 rounded transition text-[11px]"
                        title="Click to copy phone number"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{lead.phone}</span>
                        {copiedId === lead.id ? (
                          <Check className="w-3 h-3 text-emerald-400 ml-1" />
                        ) : (
                          <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition ml-1" />
                        )}
                      </button>
                    ) : (
                      <span className="text-slate-500 italic">Not listed</span>
                    )}
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    {lead.rating ? (
                      <div className="flex items-center gap-1 text-slate-200">
                        <span className="font-semibold text-amber-300">★ {lead.rating}</span>
                        <span className="text-slate-400 text-[11px]">({lead.reviewsCount || 0} reviews)</span>
                      </div>
                    ) : (
                      <span className="text-slate-500 text-[11px]">No reviews</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-slate-300 max-w-[200px] truncate" title={lead.address}>
                    {lead.address || 'Local area'}
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <a
                      href={lead.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-slate-400 hover:text-blue-400 font-medium transition"
                    >
                      <span>Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
