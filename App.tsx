import React, { useState } from 'react';
import { analyzeCompany } from './services/geminiService';
import { AnalysisResult, AnalysisState } from './types';
import { MetricCard } from './components/MetricCard';
import { MarkdownRenderer } from './components/MarkdownRenderer';
import { Loader } from './components/Loader';
import { GroundingSources } from './components/GroundingSources';
import { Search, BarChart3, PieChart, LineChart, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [state, setState] = useState<AnalysisState>(AnalysisState.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setState(AnalysisState.LOADING);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeCompany(query);
      setResult(data);
      setState(AnalysisState.COMPLETE);
    } catch (err) {
      setError("Failed to analyze ticker. Please check the symbol and try again.");
      setState(AnalysisState.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 group cursor-pointer" onClick={() => window.location.reload()}>
            <div className="bg-emerald-500/10 p-2 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
              <BarChart3 className="w-6 h-6 text-emerald-450" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">Equi<span className="text-emerald-450">Val</span></span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-400">
            <span className="hover:text-white cursor-pointer transition-colors">Markets</span>
            <span className="hover:text-white cursor-pointer transition-colors">Watchlist</span>
            <span className="hover:text-white cursor-pointer transition-colors">Portfolio</span>
            <div className="w-px h-4 bg-slate-800"></div>
            <span className="text-emerald-450">Pro v1.0</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Search Hero */}
        <div className={`transition-all duration-500 ease-in-out ${state === AnalysisState.IDLE ? 'mt-20 scale-100' : 'mt-0 scale-95 origin-top'}`}>
          <div className="max-w-3xl mx-auto text-center mb-10">
            {state === AnalysisState.IDLE && (
              <>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                  Evaluate any public company <br />
                  <span className="text-emerald-450">in seconds.</span>
                </h1>
                <p className="text-slate-400 text-lg mb-8">
                  AI-powered fundamental analysis, SWOT reports, and real-time market data retrieval.
                </p>
              </>
            )}
            
            <form onSubmit={handleSearch} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative flex items-center bg-slate-900 rounded-xl border border-slate-800 shadow-2xl overflow-hidden group-focus-within:border-emerald-500/50 transition-colors">
                <Search className="w-6 h-6 text-slate-500 ml-4" />
                <input
                  type="text"
                  className="w-full bg-transparent border-none py-4 px-4 text-white placeholder-slate-500 focus:ring-0 text-lg"
                  placeholder="Enter ticker (e.g., AAPL, NVDA) or company name..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  disabled={state === AnalysisState.LOADING}
                />
                <button
                  type="submit"
                  disabled={state === AnalysisState.LOADING}
                  className="mr-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Analyze
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-5xl mx-auto">
          {state === AnalysisState.LOADING && <Loader />}
          
          {state === AnalysisState.ERROR && (
            <div className="flex items-center justify-center p-8 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200">
              <AlertCircle className="w-6 h-6 mr-3" />
              {error}
            </div>
          )}

          {state === AnalysisState.COMPLETE && result && (
            <div className="animate-fade-in space-y-8">
              
              {/* Header Info */}
              <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-800 pb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{result.companyName}</h2>
                  <div className="flex items-center space-x-3 text-slate-400">
                    <span className="bg-slate-800 px-2 py-1 rounded text-xs font-mono text-slate-300">NASDAQ: {result.ticker}</span>
                    <span className="text-sm">•</span>
                    <span className="text-sm">Real-time Analysis</span>
                    <span className="text-sm">•</span>
                    <span className="text-sm text-emerald-450">Live Connected</span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex space-x-2">
                    <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white" title="Export PDF">
                        <PieChart className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white" title="Price History">
                        <LineChart className="w-5 h-5" />
                    </button>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {result.metrics.map((metric, idx) => (
                  <MetricCard key={idx} metric={metric} />
                ))}
              </div>

              {/* Main Analysis Report */}
              <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-8 shadow-xl">
                <MarkdownRenderer content={result.markdownContent} />
              </div>

              {/* Sources */}
              <GroundingSources sources={result.sources} />
              
              {/* Disclaimer */}
              <div className="text-center text-xs text-slate-600 pt-8 pb-4">
                <p>
                  Data provided for informational purposes only. Not financial advice. 
                  Powered by Google Gemini 3 Pro with Grounding.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;