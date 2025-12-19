import React from 'react';
import { IncomeData } from '../types';
import { DollarSign, TrendingUp, Activity } from 'lucide-react';

interface Props {
  data: IncomeData;
}

const ProgressBar: React.FC<{ label: string; value: string; colorClass: string }> = ({ label, value, colorClass }) => {
  // Extract number from string like "45.3%" or "45%"
  const numericValue = parseFloat(value.replace(/[^0-9.-]/g, ''));
  const width = isNaN(numericValue) ? 0 : Math.min(Math.max(numericValue, 0), 100);

  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-400 font-medium">{label}</span>
        <span className="text-white font-bold">{value}</span>
      </div>
      <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
        <div 
          className={`h-2.5 rounded-full ${colorClass} transition-all duration-1000 ease-out`} 
          style={{ width: `${width}%` }}
        ></div>
      </div>
    </div>
  );
};

export const IncomeStatement: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 mb-8">
      <h3 className="text-lg font-bold text-white mb-6 flex items-center">
        <Activity className="w-5 h-5 text-emerald-450 mr-2" />
        Income Statement KPIs (TTM)
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Col: Profitability Margins */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Profitability Margins</h4>
          <ProgressBar 
            label="Gross Margin" 
            value={data.grossMargin} 
            colorClass="bg-emerald-400" 
          />
          <ProgressBar 
            label="Operating Margin" 
            value={data.operatingMargin} 
            colorClass="bg-emerald-500" 
          />
          <ProgressBar 
            label="Net Profit Margin" 
            value={data.netMargin} 
            colorClass="bg-emerald-600" 
          />
        </div>

        {/* Right Col: Key Figures */}
        <div>
           <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Performance Highlights</h4>
           <div className="grid grid-cols-2 gap-4">
              {/* Revenue Card */}
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                  <div className="flex items-center text-slate-400 mb-2">
                      <DollarSign className="w-4 h-4 mr-1" />
                      <span className="text-xs">Total Revenue</span>
                  </div>
                  <div className="text-xl font-bold text-white">{data.revenue}</div>
                  <div className="text-xs text-emerald-400 mt-1 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {data.revenueGrowth} YoY
                  </div>
              </div>

              {/* Net Income Card */}
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                  <div className="flex items-center text-slate-400 mb-2">
                      <DollarSign className="w-4 h-4 mr-1" />
                      <span className="text-xs">Net Income</span>
                  </div>
                  <div className="text-xl font-bold text-white">{data.netIncome}</div>
                  <div className="text-xs text-slate-400 mt-1">
                      Bottom Line
                  </div>
              </div>
           </div>
           
           {/* Insight Box */}
           <div className="mt-4 p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
              <p className="text-xs text-slate-400 italic">
                "Healthy margins indicate a strong competitive moat, while consistent revenue growth signals market demand."
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};