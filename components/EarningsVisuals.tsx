import React from 'react';
import { HistoryPoint } from '../types';

interface MetricProps {
  label: string;
  est: number | null;
  act: number | null;
  history?: HistoryPoint[];
  formatValue?: (val: number) => string;
  displayEst?: string; // Optional pre-formatted strings
  displayAct?: string;
}

export const EarningsVisuals: React.FC<MetricProps> = ({ 
  label, 
  est, 
  act, 
  history,
  formatValue,
  displayEst,
  displayAct
}) => {
  const hasActual = act !== null;
  const isBeat = hasActual && est !== null && act! >= est!;
  
  // Calculate relative widths for main bars
  // We need a baseline max to render the bars proportionally within this component
  // Use either the current estimates/actuals or history to determine scale if history exists
  let maxVal = Math.max(Math.abs(est || 0), Math.abs(act || 0));
  
  if (history && history.length > 0) {
    history.forEach(h => {
        maxVal = Math.max(maxVal, Math.abs(h.estimate), Math.abs(h.actual));
    });
  }
  
  // Buffer for display
  const scaleMax = maxVal * 1.2 || 1; 
  
  const estWidth = est !== null ? Math.min((Math.abs(est) / scaleMax) * 100, 100) : 0;
  const actWidth = act !== null ? Math.min((Math.abs(act) / scaleMax) * 100, 100) : 0;

  return (
    <div className="w-full mb-4 last:mb-0">
      <div className="flex justify-between items-end text-xs mb-1">
        <span className="font-semibold text-slate-500">{label}</span>
        <div className="flex gap-3">
            <div className="text-right">
                <span className="text-slate-400 block text-[10px] uppercase">Est</span>
                <span className="font-medium text-slate-700">
                    {displayEst ? displayEst : est !== null && formatValue ? formatValue(est) : est}
                </span>
            </div>
            {hasActual && (
                <div className="text-right">
                    <span className="text-slate-400 block text-[10px] uppercase">Act</span>
                    <span className={`font-bold ${isBeat ? 'text-green-600' : 'text-red-600'}`}>
                        {displayAct ? displayAct : formatValue ? formatValue(act!) : act}
                    </span>
                </div>
            )}
        </div>
      </div>
      
      {/* Current Quarter Bar */}
      <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden w-full mb-2">
        {est !== null && (
            <div 
            className="absolute top-0 left-0 h-full bg-slate-300 rounded-full opacity-50"
            style={{ width: `${estWidth}%` }}
            />
        )}
        
        {hasActual && (
             <div 
             className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${isBeat ? 'bg-green-500' : 'bg-red-500'}`}
             style={{ width: `${actWidth}%` }}
           />
        )}
        
        {est !== null && hasActual && (
             <div 
             className="absolute top-0 bottom-0 w-0.5 bg-slate-800 z-10"
             style={{ left: `${estWidth}%` }}
           />
        )}
      </div>

      {/* Historical Trend Chart */}
      {history && history.length > 0 && (
          <div className="mt-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wide">Trend (Last {history.length})</span>
                  <div className="flex gap-2 text-[10px]">
                      <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>Beat</span>
                      <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>Miss</span>
                  </div>
              </div>
              <div className="h-16 w-full flex items-end justify-between gap-1">
                  {history.map((point, idx) => {
                      const hAct = point.actual;
                      const hEst = point.estimate;
                      const hIsBeat = hAct >= hEst;
                      const barHeight = (Math.abs(hAct) / scaleMax) * 100;
                      const estHeight = (Math.abs(hEst) / scaleMax) * 100; // For tick mark

                      return (
                          <div key={idx} className="flex-1 flex flex-col items-center group relative">
                              {/* Hover Tooltip */}
                              <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] p-1 rounded whitespace-nowrap z-20 pointer-events-none">
                                  {point.period}: Act {formatValue ? formatValue(hAct) : hAct} / Est {formatValue ? formatValue(hEst) : hEst}
                              </div>

                              <div className="relative w-full h-full flex items-end justify-center bg-slate-50 rounded-sm">
                                  {/* Actual Bar */}
                                  <div 
                                      className={`w-3/4 sm:w-4/5 rounded-t-sm transition-all ${hIsBeat ? 'bg-green-400 group-hover:bg-green-500' : 'bg-red-400 group-hover:bg-red-500'}`}
                                      style={{ height: `${Math.min(barHeight, 100)}%` }}
                                  ></div>
                                  
                                  {/* Estimate Tick */}
                                  <div 
                                      className="absolute w-full border-t-2 border-slate-900/60 z-10"
                                      style={{ bottom: `${Math.min(estHeight, 100)}%` }}
                                  ></div>
                              </div>
                              <span className="text-[9px] text-slate-400 mt-1 truncate max-w-full">{point.period}</span>
                          </div>
                      );
                  })}
              </div>
          </div>
      )}
    </div>
  );
};
