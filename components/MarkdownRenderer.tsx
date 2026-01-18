
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Sparkles, ExternalLink, Info, Check, AlertCircle } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  onSymbolClick?: (symbol: string) => void;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className, onSymbolClick }) => {
  return (
    <div className={`prose prose-zinc max-w-none ${className || ''}`}>
      <ReactMarkdown
        components={{
          h1: ({node, ...props}) => (
            <h1 className="text-3xl font-extrabold mt-8 mb-6 text-zinc-900 tracking-tight leading-tight" {...props} />
          ),
          h2: ({node, ...props}) => {
            const text = props.children?.toString() || '';
            const isTLDR = text.toLowerCase().includes('tl;dr');
            return (
              <div className={`mt-10 mb-5 pb-3 border-b ${isTLDR ? 'border-indigo-200' : 'border-zinc-200'}`}>
                <h2 className={`text-xl font-bold tracking-tight flex items-center gap-2 ${isTLDR ? 'text-indigo-700' : 'text-zinc-900'}`} {...props} />
              </div>
            );
          },
          h3: ({node, ...props}) => (
            <h3 
              className="text-lg font-bold mt-8 mb-4 text-zinc-800 bg-zinc-50/80 px-4 py-3 rounded-lg border-l-4 border-indigo-500 shadow-sm flex items-center gap-2" 
              {...props} 
            />
          ),
          p: ({node, ...props}) => <p className="mb-4 leading-relaxed text-zinc-600 text-[15px]" {...props} />,
          ul: ({node, ...props}) => <ul className="mb-6 space-y-2" {...props} />,
          ol: ({node, ...props}) => <ol className="mb-6 space-y-2 list-decimal pl-5 text-zinc-600" {...props} />,
          li: ({node, ...props}) => (
            <li className="flex gap-3 text-zinc-700 text-[15px] leading-relaxed">
              <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
              <span>{props.children}</span>
            </li>
          ),
          strong: ({node, ...props}) => <strong className="font-bold text-zinc-900 bg-indigo-50/50 px-1 rounded" {...props} />,
          blockquote: ({node, ...props}) => (
            <blockquote className="relative my-6 p-4 pl-12 bg-indigo-50/30 rounded-r-xl border-l-4 border-indigo-200 text-zinc-600 italic">
               <span className="absolute left-4 top-4 text-indigo-200 text-4xl leading-none">"</span>
               {props.children}
            </blockquote>
          ),
          a: ({node, ...props}) => {
            const href = props.href || '';
            // Check for our custom internal link format: #analyze-TICKER
            if (href.startsWith('#analyze-') && onSymbolClick) {
              const ticker = href.replace('#analyze-', '');
              return (
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    onSymbolClick(ticker);
                  }}
                  className="inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded-md bg-zinc-100 text-zinc-700 hover:bg-indigo-50 hover:text-indigo-600 text-xs font-bold uppercase tracking-wide transition-colors align-middle border border-zinc-200 hover:border-indigo-200"
                  title={`Analyze ${ticker}`}
                >
                  {ticker}
                </button>
              );
            }
            return (
              <a 
                className="text-indigo-600 hover:text-indigo-800 hover:underline inline-flex items-center gap-0.5 font-medium" 
                target="_blank" 
                rel="noopener noreferrer" 
                {...props} 
              >
                {props.children}
                <ExternalLink className="w-3 h-3 opacity-50" />
              </a>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
