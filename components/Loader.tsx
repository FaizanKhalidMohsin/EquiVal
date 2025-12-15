import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const LOADING_STEPS = [
  "Connecting to market data streams...",
  "Retrieving latest financial filings...",
  "Analyzing quarterly earnings reports...",
  "Scanning recent news and sentiment...",
  "Compiling SWOT analysis...",
  "Finalizing investment verdict..."
];

export const Loader: React.FC = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-6">
      <div className="relative">
        <div className="absolute inset-0 bg-emerald-450 blur-xl opacity-20 rounded-full"></div>
        <Loader2 className="w-16 h-16 text-emerald-450 animate-spin relative z-10" />
      </div>
      <div className="text-slate-400 font-mono text-sm animate-pulse">
        {LOADING_STEPS[step]}
      </div>
    </div>
  );
};