import React from 'react';
import { PriceTarget } from '../types';
import { TrendingUp } from 'lucide-react';

interface PriceTargetChartProps {
  data: PriceTarget[];
}

export const PriceTargetChart: React.FC<PriceTargetChartProps> = ({ data }) => {
  if (!data || data.length < 2) return null;

  // Configuration
  const width = 600;
  const height = 180;
  const padding = { top: 30, right: 40, bottom: 30, left: 40 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  // Calculate scales
  const prices = data.map(d => d.target);
  const minPrice = Math.min(...prices) * 0.95; // 5% buffer bottom
  const maxPrice = Math.max(...prices) * 1.05; // 5% buffer top
  const priceRange = maxPrice - minPrice || 1;

  // Generate Path
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * graphWidth + padding.left;
    const y = height - padding.bottom - ((d.target - minPrice) / priceRange) * graphHeight;
    return { x, y, value: d.target, label: d.period };
  });

  const pathD = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
  
  // Area Path (for gradient fill)
  const areaPathD = `${pathD} L ${points[points.length-1].x},${height - padding.bottom} L ${points[0].x},${height - padding.bottom} Z`;

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
         <div className="bg-green-100 p-1.5 rounded-md">
            <TrendingUp className="w-4 h-4 text-green-700" />
         </div>
         <h3 className="font-semibold text-slate-800 text-sm">Analyst Price Target Trend</h3>
      </div>
      
      <div className="w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-h-[200px]">
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines (Simple horizontal) */}
          <line x1={padding.left} y1={padding.top} x2={width - padding.right} y2={padding.top} stroke="#f1f5f9" strokeDasharray="4" />
          <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} stroke="#f1f5f9" />

          {/* Area Fill */}
          <path d={areaPathD} fill="url(#priceGradient)" />

          {/* Line Path */}
          <path d={pathD} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Points and Labels */}
          {points.map((p, i) => (
            <g key={i}>
              {/* Vertical guideline for last point */}
              {i === points.length - 1 && (
                  <line x1={p.x} y1={p.y} x2={p.x} y2={height - padding.bottom} stroke="#2563eb" strokeDasharray="2" opacity="0.3" />
              )}
              
              {/* Dot */}
              <circle cx={p.x} cy={p.y} r="4" fill="white" stroke="#2563eb" strokeWidth="2" />

              {/* Price Label (Above dot) */}
              <text 
                x={p.x} 
                y={p.y - 12} 
                textAnchor="middle" 
                className="text-[12px] font-bold fill-slate-700"
              >
                ${p.value}
              </text>

              {/* Period Label (X Axis) */}
              <text 
                x={p.x} 
                y={height - padding.bottom + 18} 
                textAnchor="middle" 
                className="text-[10px] uppercase font-medium fill-slate-500"
              >
                {p.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};
