export interface Metric {
  label: string;
  value: string;
  trend?: 'up' | 'down' | 'neutral';
}

export interface GroundingSource {
  title: string;
  url: string;
}

export interface AnalysisResult {
  markdownContent: string;
  metrics: Metric[];
  sources: GroundingSource[];
  companyName: string;
  ticker: string;
}

export enum AnalysisState {
  IDLE,
  LOADING,
  COMPLETE,
  ERROR
}

export interface SearchParams {
  query: string;
}