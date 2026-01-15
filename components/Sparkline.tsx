
import React from 'react';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  isPositive?: boolean;
}

export const Sparkline: React.FC<SparklineProps> = ({ 
  data, 
  width = 120, 
  height = 40, 
  isPositive = true
}) => {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1; 
  
  const padding = 4;
  const renderHeight = height - padding * 2;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const normalizedVal = (val - min) / range;
    const y = height - padding - (normalizedVal * renderHeight);
    return `${x},${y}`;
  }).join(' ');

  const strokeColor = isPositive ? '#10b981' : '#f43f5e'; // Emerald-500 or Rose-500

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible block">
      <defs>
        <linearGradient id={`grad-${isPositive ? 'pos' : 'neg'}`} x1="0" y1="0" x2="0" y2="1">
           <stop offset="0%" stopColor={strokeColor} stopOpacity="0.1"/>
           <stop offset="100%" stopColor={strokeColor} stopOpacity="0"/>
        </linearGradient>
      </defs>
      
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      
      <circle 
        cx={(data.length - 1) / (data.length - 1) * width} 
        cy={height - padding - ((data[data.length-1] - min) / range * renderHeight)} 
        r="2" 
        fill={strokeColor} 
      />
    </svg>
  );
};
