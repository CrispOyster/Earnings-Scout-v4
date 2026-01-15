
import React, { useState } from 'react';
import { InfographicData } from '../types';
import { Target, TrendingUp, AlertTriangle, Zap, Quote, DollarSign, Scale, ArrowRight, Gauge, Activity } from 'lucide-react';

interface InfographicProps {
  data: InfographicData;
  variant?: 'default' | 'print';
}

export const Infographic: React.FC<InfographicProps> = ({ data, variant = 'default' }) => {
  const [logoError, setLogoError] = useState(false);
  
  if (!data) return null;

  const isPrint = variant === 'print';

  // Styles based on variant
  const cardClass = isPrint 
    ? "border border-zinc-300 p-4 mb-8" 
    : "bg-white rounded-2xl border border-zinc-200 shadow-lg mb-8 overflow-hidden";

  const renderVibeMeter = () => {
    const score = data.vibe.score;
    const color = score >= 7 ? 'bg-emerald-500' : score <= 4 ? 'bg-rose-500' : 'bg-amber-500';
    const textColor = score >= 7 ? 'text-emerald-700' : score <= 4 ? 'text-rose-700' : 'text-amber-700';
    const textBg = score >= 7 ? 'bg-emerald-50' : score <= 4 ? 'bg-rose-50' : 'bg-amber-50';

    return (
      <div className="flex flex-col h-full justify-between">
        <div className="flex justify-between items-start mb-4">
           <div>
             <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
               <Zap className="w-3.5 h-3.5" /> Internal Vibe
             </h4>
             <div className="text-3xl font-bold text-zinc-900">{score}<span className="text-lg text-zinc-300 font-medium">/10</span></div>
           </div>
           <div className={`px-2.5 py-1 rounded-md text-xs font-bold ${textBg} ${textColor}`}>
              {score >= 7 ? 'Bullish' : score <= 4 ? 'Bearish' : 'Neutral'}
           </div>
        </div>
        
        <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden mb-3">
          <div className={`h-full ${color} transition-all duration-700 ease-out`} style={{ width: `${score * 10}%` }}></div>
        </div>
        
        <p className="text-sm text-zinc-600 leading-snug font-medium mb-3">
          {data.vibe.analysis}
        </p>
        
        {!isPrint && (
           <div className="mt-auto pt-3 border-t border-zinc-50">
             <div className="flex gap-2">
               <Quote className="w-4 h-4 text-zinc-300 shrink-0" />
               <p className="text-xs text-zinc-500 italic line-clamp-2">"{data.vibe.quote}"</p>
             </div>
           </div>
        )}
      </div>
    );
  };

  const renderDCF = () => {
    if (!data.dcf || !data.dcf.currentPrice || !data.dcf.fairValue) return null;
    const { currentPrice, fairValue, verdict } = data.dcf;
    const isUndervalued = fairValue > currentPrice;
    const upside = ((fairValue - currentPrice) / currentPrice) * 100;
    
    // Calculate simple relative positions
    const maxVal = Math.max(currentPrice, fairValue) * 1.1;
    const currPct = (currentPrice / maxVal) * 100;
    const fairPct = (fairValue / maxVal) * 100;

    return (
      <div className="flex flex-col h-full">
         <div className="flex justify-between items-start mb-4">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
               <Scale className="w-3.5 h-3.5" /> Valuation
            </h4>
            <div className={`px-2 py-0.5 rounded text-xs font-bold ${isUndervalued ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
               {isUndervalued ? 'Under' : 'Over'}valued
            </div>
         </div>

         <div className="mt-2 space-y-4">
            {/* Current Price */}
            <div className="relative">
              <div className="flex justify-between text-xs mb-1">
                 <span className="font-semibold text-zinc-500">Current</span>
                 <span className="font-mono font-bold">${currentPrice.toFixed(2)}</span>
              </div>
              <div className="w-full bg-zinc-100 h-2 rounded-full">
                 <div className="h-full bg-zinc-800 rounded-full" style={{ width: `${currPct}%` }}></div>
              </div>
            </div>

            {/* Fair Value */}
            <div className="relative">
              <div className="flex justify-between text-xs mb-1">
                 <span className="font-semibold text-zinc-500">Fair Value</span>
                 <span className={`font-mono font-bold ${isUndervalued ? 'text-emerald-600' : 'text-rose-600'}`}>${fairValue.toFixed(2)}</span>
              </div>
               <div className="w-full bg-zinc-100 h-2 rounded-full">
                 <div className={`h-full rounded-full ${isUndervalued ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${fairPct}%` }}></div>
              </div>
            </div>
         </div>
         
         <div className="mt-auto pt-4 text-center">
            <span className={`text-lg font-bold ${isUndervalued ? 'text-emerald-600' : 'text-rose-600'}`}>
               {upside > 0 ? '+' : ''}{upside.toFixed(1)}%
            </span>
            <span className="text-xs text-zinc-400 ml-1">upside potential</span>
         </div>
      </div>
    );
  };

  return (
    <div className={cardClass}>
      {/* Header Section */}
      <div className="p-6 md:p-8 border-b border-zinc-100 bg-zinc-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {data.website && !logoError && (
            <div className="w-16 h-16 rounded-xl bg-white border border-zinc-200 p-2 shadow-sm flex items-center justify-center shrink-0">
               <img 
                 src={`https://logo.clearbit.com/${data.website}`} 
                 alt="Logo" 
                 className="w-full h-full object-contain"
                 onError={() => setLogoError(true)}
                 crossOrigin="anonymous" 
               />
            </div>
          )}
          <div>
            <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight leading-none mb-1">{data.title}</h2>
            <a href={`https://${data.website}`} target="_blank" rel="noreferrer" className="text-sm text-zinc-400 hover:text-indigo-500 transition-colors font-medium">
               {data.website || 'Company Analysis'}
            </a>
          </div>
        </div>
        
        {/* Consensus Badge */}
        <div className="flex items-center gap-6 bg-white px-5 py-3 rounded-xl border border-zinc-200 shadow-sm">
           <div className="text-center border-r border-zinc-100 pr-6">
              <div className="text-[10px] uppercase font-bold text-zinc-400 mb-0.5">Street Rating</div>
              <div className={`text-xl font-bold ${
                 data.consensus.rating.toLowerCase().includes('buy') ? 'text-emerald-600' :
                 data.consensus.rating.toLowerCase().includes('sell') ? 'text-rose-600' : 'text-zinc-700'
              }`}>
                 {data.consensus.rating}
              </div>
           </div>
           <div className="text-center">
              <div className="text-[10px] uppercase font-bold text-zinc-400 mb-0.5">Target</div>
              <div className="text-xl font-bold text-zinc-900 font-mono">
                 {data.consensus.priceTarget}
              </div>
           </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-zinc-100">
         
         {/* 1. Vibe */}
         <div className="p-6 md:p-8">
            {renderVibeMeter()}
         </div>

         {/* 2. DCF */}
         <div className="p-6 md:p-8">
            {renderDCF()}
         </div>

         {/* 3. Catalyst */}
         <div className="p-6 md:p-8 flex flex-col">
            <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5 mb-3">
               <TrendingUp className="w-3.5 h-3.5" /> Bull Case
            </h4>
            <div className="font-bold text-zinc-900 mb-2 leading-tight">{data.greenFlag.title}</div>
            <p className="text-sm text-zinc-600 leading-relaxed">
               {data.greenFlag.description}
            </p>
         </div>

         {/* 4. Risk */}
         <div className="p-6 md:p-8 flex flex-col">
            <h4 className="text-xs font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1.5 mb-3">
               <AlertTriangle className="w-3.5 h-3.5" /> Bear Risk
            </h4>
            <div className="font-bold text-zinc-900 mb-2 leading-tight">{data.redFlag.title}</div>
            <p className="text-sm text-zinc-600 leading-relaxed">
               {data.redFlag.description}
            </p>
         </div>

      </div>
    </div>
  );
};
