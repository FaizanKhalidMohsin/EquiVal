import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Simple custom renderer to avoid heavy dependencies for this demo.
  // In a production app, use 'react-markdown'.
  
  const processText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
        // Headers
        if (line.startsWith('### ')) return <h3 key={index} className="text-lg font-bold text-white mt-6 mb-3">{line.replace('### ', '')}</h3>;
        if (line.startsWith('## ')) return <h2 key={index} className="text-xl font-bold text-emerald-450 mt-8 mb-4 border-b border-slate-800 pb-2">{line.replace('## ', '')}</h2>;
        if (line.startsWith('# ')) return <h1 key={index} className="text-2xl font-bold text-white mt-4 mb-4">{line.replace('# ', '')}</h1>;
        
        // List items
        if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
            const content = line.trim().substring(2);
            // Handle bolding within list items
            const parts = content.split('**');
            return (
                <li key={index} className="ml-4 pl-2 text-slate-300 mb-2 border-l-2 border-slate-700">
                     {parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="text-slate-100">{part}</strong> : part)}
                </li>
            );
        }

        // Bold text logic for paragraphs
        if (line.includes('**')) {
            const parts = line.split('**');
            return (
                <p key={index} className="mb-4 text-slate-300 leading-relaxed">
                    {parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="text-white font-semibold">{part}</strong> : part)}
                </p>
            );
        }
        
        if (line.trim() === '') return <div key={index} className="h-2"></div>;

        return <p key={index} className="mb-4 text-slate-300 leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="prose prose-invert max-w-none">
      {processText(content)}
    </div>
  );
};