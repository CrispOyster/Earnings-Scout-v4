
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Sparkles, ExternalLink } from 'lucide-react';

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
          h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-8 mb-4 text-zinc-900 tracking-tight" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-8 mb-4 text-zinc-900 border-b border-zinc-100 pb-2 tracking-tight" {...props} />,
          h3: ({node, ...props}) => (
            <h3 
              className="text-lg font-bold mt-10 mb-4 text-zinc-900 bg-zinc-50 p-4 rounded-xl border-l-4 border-indigo-500 shadow-sm" 
              {...props} 
            />
          ),
          p: ({node, ...props}) => <p className="mb-4 leading-relaxed text-zinc-600" {...props} />,
          li: ({node, ...props}) => <li className="mb-1 text-zinc-600" {...props} />,
          strong: ({node, ...props}) => <strong className="font-bold text-zinc-900" {...props} />,
          blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-zinc-200 pl-4 italic my-4 text-zinc-500" {...props} />,
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
                  className="inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold uppercase tracking-wide transition-colors align-middle"
                  title={`Analyze ${ticker}`}
                >
                  {ticker}
                </button>
              );
            }
            return (
              <a 
                className="text-indigo-600 hover:text-indigo-800 hover:underline inline-flex items-center gap-0.5" 
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
