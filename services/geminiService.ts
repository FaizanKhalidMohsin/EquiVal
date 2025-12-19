import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, Metric, GroundingSource, IncomeData } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ANALYSIS_PROMPT = (query: string) => `
Analyze the public company "${query}" (Ticker or Name).

Goal: Provide a comprehensive investment evaluation for a professional investor.

Structure your response strictly in the following format:

1.  **Executive Summary**: A concise 2-3 sentence overview of the company's current status and primary business model.
2.  **Financial Health**: detailed analysis of revenue growth, profitability (margins), and balance sheet strength.
3.  **SWOT Analysis**:
    *   **Strengths**: Internal strategic advantages.
    *   **Weaknesses**: Internal limitations.
    *   **Opportunities**: External growth vectors.
    *   **Threats**: External risks (competitors, regulation).
4.  **Recent Developments**: Summarize the most significant news from the last 3-6 months based on search results.
5.  **Investment Verdict**: A purely educational "Bull case" vs "Bear case" summary.

At the VERY END of your response, after all text, output TWO special blocks.

Block 1: General Metrics
---METRICS_START---
Price: [Current Stock Price with currency symbol]
Market Cap: [Current Market Cap]
P/E Ratio: [Current P/E or 'N/A']
YoY Growth: [Revenue Growth % or 'N/A']
Sentiment: [Bullish/Bearish/Neutral based on analysis]
---METRICS_END---

Block 2: Income Statement Snapshot (Use TTM or latest fiscal year data)
---INCOME_START---
Revenue: [e.g. $383.9B]
Revenue Growth: [e.g. +5.2%]
Gross Margin: [e.g. 45.3%]
Operating Margin: [e.g. 30.8%]
Net Income: [e.g. $97.0B]
Net Margin: [e.g. 25.3%]
---INCOME_END---
`;

export const analyzeCompany = async (query: string): Promise<AnalysisResult> => {
  try {
    const model = 'gemini-3-pro-preview'; // Using Pro for better reasoning and search integration
    
    const response = await ai.models.generateContent({
      model: model,
      contents: ANALYSIS_PROMPT(query),
      config: {
        tools: [{ googleSearch: {} }],
        // We cannot use JSON schema with search, so we rely on text parsing
      },
    });

    const text = response.text || "No analysis generated.";
    
    // Parse Grounding Metadata
    const sources: GroundingSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          sources.push({
            title: chunk.web.title,
            url: chunk.web.uri,
          });
        }
      });
    }

    let cleanMarkdown = text;

    // Helper to extract block content
    const extractBlock = (startTag: string, endTag: string): Record<string, string> => {
      const regex = new RegExp(`${startTag}([\\s\\S]*?)${endTag}`);
      const match = text.match(regex);
      const data: Record<string, string> = {};
      
      if (match && match[1]) {
        // Remove block from display text
        cleanMarkdown = cleanMarkdown.replace(match[0], '');
        
        const lines = match[1].trim().split('\n');
        lines.forEach(line => {
          const [key, val] = line.split(':').map(s => s.trim());
          if (key && val) {
            data[key] = val;
          }
        });
      }
      return data;
    };

    // Extract Metrics
    const rawMetrics = extractBlock('---METRICS_START---', '---METRICS_END---');
    const metrics: Metric[] = Object.entries(rawMetrics).map(([key, val]) => {
      let trend: 'up' | 'down' | 'neutral' | undefined = undefined;
      if (key === 'Sentiment') {
          if (val.toLowerCase().includes('bull')) trend = 'up';
          else if (val.toLowerCase().includes('bear')) trend = 'down';
          else trend = 'neutral';
      }
      return { label: key, value: val, trend };
    });

    // Extract Income Data
    const rawIncome = extractBlock('---INCOME_START---', '---INCOME_END---');
    let incomeData: IncomeData | undefined = undefined;
    
    // Basic validation to ensure we have enough data to form the object
    if (Object.keys(rawIncome).length >= 4) {
        incomeData = {
            revenue: rawIncome['Revenue'] || 'N/A',
            revenueGrowth: rawIncome['Revenue Growth'] || 'N/A',
            grossMargin: rawIncome['Gross Margin'] || '0%',
            operatingMargin: rawIncome['Operating Margin'] || '0%',
            netIncome: rawIncome['Net Income'] || 'N/A',
            netMargin: rawIncome['Net Margin'] || '0%',
        };
    }

    return {
      markdownContent: cleanMarkdown.trim(),
      metrics,
      incomeData,
      sources,
      companyName: query.toUpperCase(),
      ticker: query.toUpperCase(), // Simplification, ideally we'd extract the real ticker
    };

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze company. Please try again.");
  }
};