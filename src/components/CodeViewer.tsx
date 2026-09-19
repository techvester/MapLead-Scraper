import React, { useState } from 'react';
import { EXTENSION_FILES } from '../extension-files';
import { Copy, Check, FileCode, Download, FolderArchive } from 'lucide-react';
import { downloadExtensionZip } from '../utils/zip-generator';

export const CodeViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState(EXTENSION_FILES[0].name);
  const [copied, setCopied] = useState(false);

  const current = EXTENSION_FILES.find(f => f.name === selectedFile) || EXTENSION_FILES[0];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(current.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* Top Bar with File Tabs & Download */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FolderArchive className="w-5 h-5 text-blue-400" />
          <div>
            <h3 className="text-sm font-bold text-white">Extension Source Files</h3>
            <p className="text-[11px] text-slate-400">{current.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : `Copy ${current.name}`}</span>
          </button>

          <button
            onClick={() => downloadExtensionZip()}
            className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download All in .ZIP</span>
          </button>
        </div>
      </div>

      {/* File Tab Selector */}
      <div className="flex overflow-x-auto bg-slate-950 px-2 pt-2 border-b border-slate-800 gap-1">
        {EXTENSION_FILES.map(file => (
          <button
            key={file.name}
            id={`file-tab-${file.name}`}
            onClick={() => setSelectedFile(file.name)}
            className={`px-3 py-2 text-xs font-mono font-medium rounded-t-lg transition flex items-center gap-2 border-t border-x ${
              selectedFile === file.name
                ? 'bg-slate-900 text-blue-400 border-slate-800 border-b-transparent shadow-sm'
                : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>{file.name}</span>
          </button>
        ))}
      </div>

      {/* Code Display */}
      <div className="bg-slate-950 p-4 font-mono text-xs text-slate-300 max-h-[500px] overflow-y-auto">
        <pre className="text-[11px] leading-relaxed select-all">
          {current.content}
        </pre>
      </div>

      {/* File footer info */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span>File: <code className="text-slate-200">{current.path}</code> ({current.language})</span>
        <span>Lines: {current.content.split('\n').length}</span>
      </div>
    </div>
  );
};
