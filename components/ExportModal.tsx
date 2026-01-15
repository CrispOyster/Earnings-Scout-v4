import React, { useState } from 'react';
import { FileText, FileSpreadsheet, Download, X, Check, EyeOff, Eye } from 'lucide-react';

interface ExportOptions {
  format: 'pdf' | 'csv';
  includeInfographic: boolean;
  includeAnalysis: boolean;
  includeTradePlan: boolean;
  includeSources: boolean;
}

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: ExportOptions) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, onExport }) => {
  const [format, setFormat] = useState<'pdf' | 'csv'>('pdf');
  const [sections, setSections] = useState({
    infographic: true,
    analysis: true,
    tradePlan: true,
    sources: true,
  });

  if (!isOpen) return null;

  const handleExport = () => {
    onExport({
      format,
      includeInfographic: sections.infographic,
      includeAnalysis: sections.analysis,
      includeTradePlan: sections.tradePlan,
      includeSources: sections.sources,
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h3 className="font-bold text-lg text-slate-800">Export Report</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Format</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setFormat('pdf')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  format === 'pdf'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span className="font-medium">PDF Document</span>
              </button>
              <button
                onClick={() => setFormat('csv')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  format === 'csv'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <FileSpreadsheet className="w-5 h-5" />
                <span className="font-medium">CSV Data</span>
              </button>
            </div>
          </div>

          {/* PDF Customization Options */}
          {format === 'pdf' && (
            <div className="animate-in slide-in-from-top-2">
              <label className="block text-sm font-semibold text-slate-700 mb-3">Content Options</label>
              <div className="space-y-2">
                {[
                  { id: 'infographic', label: 'Visual Summary (Infographic)' },
                  { id: 'analysis', label: 'Analysis Breakdown (Part 1)' },
                  { id: 'tradePlan', label: 'Trade Blueprints (Part 2)' },
                  { id: 'sources', label: 'Sources & Citations' },
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSections({ ...sections, [item.id]: !sections[item.id as keyof typeof sections] })}
                    className="flex items-center justify-between p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                        sections[item.id as keyof typeof sections] ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {sections[item.id as keyof typeof sections] && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-sm font-medium text-slate-700">{item.label}</span>
                    </div>
                    {sections[item.id as keyof typeof sections] ? (
                      <Eye className="w-4 h-4 text-slate-400" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-slate-300" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

           {format === 'csv' && (
            <div className="animate-in slide-in-from-top-2 p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-600">
               <p>Downloads raw data tables including Vibe Scores, Consensus Ratings, Price Targets, and Red/Green flag analysis.</p>
            </div>
          )}
        </div>

        <div className="p-6 pt-0">
          <button
            onClick={handleExport}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download {format.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
};
