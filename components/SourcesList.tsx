import React from 'react';
import { ExternalLink, Globe } from 'lucide-react';
import { GroundingMetadata } from '../types';

interface SourcesListProps {
  metadata?: GroundingMetadata;
  variant?: 'grid' | 'list';
}

export const SourcesList: React.FC<SourcesListProps> = ({ metadata, variant = 'grid' }) => {
  if (!metadata?.groundingChunks || metadata.groundingChunks.length === 0) {
    return null;
  }

  // Filter out duplicates based on URI
  const uniqueSources = metadata.groundingChunks.reduce((acc, current) => {
    // Only add if it has a valid URI and is not duplicate
    if (current.web?.uri && !acc.find((item) => item.web?.uri === current.web?.uri)) {
      acc.push(current);
    }
    return acc;
  }, [] as typeof metadata.groundingChunks);

  if (uniqueSources.length === 0 && !metadata.searchEntryPoint?.renderedContent) {
    return null;
  }

  if (variant === 'list') {
    return (
      <div className="mt-8 pt-6 border-t border-slate-300 break-inside-avoid">
        <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-2">
          <Globe className="w-4 h-4" />
          Sources & Citations
        </h3>
        <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
          {uniqueSources.map((chunk, index) => {
            if (!chunk.web?.uri) return null;
            return (
              <li key={index} className="break-inside-avoid">
                <a 
                  href={chunk.web.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:underline"
                >
                  {chunk.web.title || chunk.web.uri}
                </a>
                <span className="text-slate-500 ml-2 text-xs">
                  ({new URL(chunk.web.uri).hostname})
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  // Default Grid Variant (Web)
  return (
    <div className="mt-8 pt-6 border-t border-slate-200">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
        <Globe className="w-4 h-4" />
        Verified Sources
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {uniqueSources.map((chunk, index) => {
            if (!chunk.web?.uri) return null;
            
            return (
              <a
                key={index}
                href={chunk.web.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 p-3 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 transition-all duration-200"
              >
                <div className="mt-1 min-w-[16px]">
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 group-hover:text-blue-700 truncate">
                    {chunk.web.title || "Web Source"}
                  </p>
                  <p className="text-xs text-slate-500 truncate group-hover:text-blue-400">
                    {new URL(chunk.web.uri).hostname}
                  </p>
                </div>
              </a>
            );
        })}
      </div>
      {metadata.searchEntryPoint?.renderedContent && (
          <div 
            className="mt-4 text-xs text-slate-400"
            dangerouslySetInnerHTML={{ __html: metadata.searchEntryPoint.renderedContent }}
          />
      )}
    </div>
  );
};