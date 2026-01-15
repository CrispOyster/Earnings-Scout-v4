
export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}

export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
  groundingSupports?: any[]; // We primarily care about chunks for the links
  searchEntryPoint?: {
    renderedContent?: string;
  };
}

export interface InfographicData {
  title: string;
  website?: string; // For logo fetching (e.g., "apple.com")
  vibe: {
    score: number; // 1-10
    quote: string;
    analysis: string;
  };
  redFlag: {
    title: string;
    description: string;
  };
  greenFlag: {
    title: string;
    description: string;
  };
  consensus: {
    rating: string;
    priceTarget: string;
  };
  dcf?: {
    fairValue: number;
    currentPrice: number;
    verdict: string; // "Undervalued" or "Overvalued"
  };
}

export interface SearchResult {
  text: string;
  infographic?: InfographicData;
  groundingMetadata?: GroundingMetadata;
}

export interface StoredReport extends SearchResult {
  id: string; // ticker_timestamp
  ticker: string;
  timestamp: number;
}

export interface SearchState {
  isLoading: boolean;
  data: SearchResult | null;
  error: string | null;
}

export interface TrendingStock {
  symbol: string;
  name: string;
  sector: string; // Added sector for grouping
  price: string;
  change: string;
  reason: string;
  volume: string;
  sparkline: number[];
}

export type TrendingFilter = 'general' | 'price' | 'volume';

export interface TrendingState {
  isLoading: boolean;
  data: TrendingStock[] | null;
  error: string | null;
}

export interface HistoryPoint {
  period: string;
  estimate: number;
  actual: number;
}

export interface EarningsEvent {
  symbol: string;
  name: string;
  date: string;
  time: string;
  epsEstimate: number | null;
  epsActual: number | null;
  revenueEstimate: string;     // Display string e.g. "$5.2B"
  revenueActual: string | null;
  revenueEstimateNum: number | null; // For comparison logic
  revenueActualNum: number | null;
  epsHistory?: HistoryPoint[];
  revenueHistory?: HistoryPoint[];
}

export interface CalendarState {
  isLoading: boolean;
  data: EarningsEvent[] | null;
  error: string | null;
}

export interface PriceTarget {
  target: number;
  period: string;
}