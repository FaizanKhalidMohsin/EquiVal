import React from 'react';
import { GroundingSource } from '../types';
import { ExternalLink } from 'lucide-react';

interface Props {
  sources: GroundingSource[];
}

export const GroundingSources: React.FC<Props> = ({ sources }) => {
  if (!sources || sources.length === 0) return null;

  // Deduplicate sources by URL
  const uniqueSources = Array.from(
    new Map(sources.map((item) => [item.url, item] as [string, GroundingSource])).values()
  );

  return (
    <div className="mt-8 pt-6 border-t border-slate-800">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
        Sources & Grounding Data
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {uniqueSources.map((source, idx) => (
          <a
            key={idx}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/50 transition-all duration-200"
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs text-emerald-450/80 mb-0.5 truncate">
                Source {idx + 1}
              </p>
              <p className="text-sm text-slate-300 font-medium truncate group-hover:text-white">
                {source.title}
              </p>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-emerald-450 ml-3 flex-shrink-0" />
          </a>
        ))}
      </div>
    </div>
  );
};
