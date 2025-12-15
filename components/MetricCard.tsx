import React from 'react';
import { Metric } from '../types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  metric: Metric;
}

export const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  let Icon = Minus;
  let colorClass = 'text-slate-400';

  if (metric.trend === 'up') {
    Icon = TrendingUp;
    colorClass = 'text-emerald-450';
  } else if (metric.trend === 'down') {
    Icon = TrendingDown;
    colorClass = 'text-red-400';
  }

  // Special styling for Sentiment
  if (metric.label === 'Sentiment') {
     if (metric.value.toLowerCase().includes('bull')) colorClass = 'text-emerald-450';
     if (metric.value.toLowerCase().includes('bear')) colorClass = 'text-red-400';
  }

  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-sm hover:border-slate-700 transition-colors">
      <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
        {metric.label}
      </div>
      <div className="flex items-center justify-between">
        <span className={`text-xl font-bold ${metric.label === 'Sentiment' ? colorClass : 'text-white'}`}>
          {metric.value}
        </span>
        {metric.trend && <Icon className={`w-5 h-5 ${colorClass}`} />}
      </div>
    </div>
  );
};