
import { GoogleGenAI, Type } from "@google/genai";
import { SearchResult, TrendingStock, TrendingFilter, EarningsEvent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const searchEarningsData = async (ticker: string): Promise<SearchResult> => {
  try {
    const model = "gemini-3-flash-preview";
    const prompt = `
    Role: You are a Senior Options Strategist and Contrarian Market Analyst. You are writing for a smart retail investor who wants professional-grade insights without the Wall Street fluff.
    
    Task: Conduct a deep-dive analysis on ${ticker} (US Stock).
    
    You MUST use Google Search to find and analyze:
    1. The latest **Quarterly Earnings Report (10-Q/8-K)**.
    2. The latest **Earnings Call Transcript** (specifically looking for CEO/CFO quotes).
    3. The latest **Earnings Presentation** (Investor Deck).
    4. Any related analysis or reports that provide critical context.
    5. The **CURRENT Stock Price** for ${ticker}.
    6. The current **Wall Street Analyst Consensus** (Buy/Hold/Sell and Average Price Target) from sources like MarketWatch, TipRanks, or Yahoo Finance.
    7. **Major Competitors** and their current stock prices.
    8. Recent **Insider Trading** (SEC Form 4) and **Congressional Trading** activity (STOCK Act disclosures).
    9. **Financial Metrics for DCF**: Free Cash Flow (FCF), Growth Rate estimates, and Weighted Average Cost of Capital (WACC).

    Output Structure:
    You must provide TWO parts in your response, separated strictly by the string "|||SPLIT|||".

    Part 1: A JSON object containing structured summary data for an infographic (Thumbnail).
    Format:
    \`\`\`json
    {
      "title": "A single, punchy title for this report",
      "website": "company.com", 
      "vibe": { 
        "score": 8, 
        "quote": "Short direct quote from CEO...", 
        "analysis": "One sentence explanation of the mood." 
      },
      "redFlag": { 
        "title": "Short Risk Title", 
        "description": "One sentence explanation." 
      },
      "greenFlag": { 
        "title": "Short Catalyst Title", 
        "description": "One sentence explanation." 
      },
      "consensus": { 
        "rating": "Buy/Hold/Sell", 
        "priceTarget": "$XXX" 
      },
      "dcf": {
        "fairValue": 120.50, 
        "currentPrice": 100.00,
        "verdict": "Undervalued"
      }
    }
    \`\`\`
    *Note: 
    - 'score' should be 1-10 based on the aggregate of analyses 1-7 (1=Strong Sell/Disaster, 5=Neutral, 10=Strong Buy/Euphoric).
    - 'website' should be the main domain string (e.g. "nvidia.com", "apple.com") used to fetch a logo.
    - 'dcf' values should be numeric floats. If you cannot calculate, estimate based on analyst reports or put 0.*

    |||SPLIT|||

    Part 2: The Full Markdown Report.
    
    # [Repeat the Title Here]

    ## Part 1: The Breakdown (Free Content)
    Tone: "The Smart Friend" (Conversational, witty, investigative).

    ### 1. The Vibe Check
    Was the CEO confident, defensive, or evasive in the transcript? Quote a specific sentence they said and translate what they really meant.

    ### 2. The "Red Flag" (Risk)
    Identify the one negative thing management tried to smooth over. Explain simply why this matters.

    ### 3. The "Green Flag" (Catalyst)
    What is the most impressive number or future promise? Why should a normal person care?

    ### 4. Consensus Rating
    *   **Wall Street Data:** Show the Consensus and Average Price Target.
    *   **The "Vibe" Rating (Internal):** Your own rating based on a holistic synthesis of analyses 1-7 (Score 1-10) followed by a classification (Strong Buy / Buy / Hold / Sell / Strong Sell).
    *   **Insight:** Explain the difference.

    ### 5. Competitors
    List 3-5 major competitors with their CURRENT stock price.
    **CRITICAL formatting instruction:** You MUST format the competitor ticker symbols as markdown links using the format \`[TICKER](#analyze-TICKER)\`.
    Example: "* **[AMD](#analyze-AMD)**: $145.20"

    ### 6. Recent Insider & Congressional Trades
    Summarize significant recent buying or selling by company insiders (executives) or members of US Congress (e.g., Nancy Pelosi, Dan Crenshaw, etc.) within the last 6 months.

    ### 7. Discounted Cash Flow (DCF) Model
    Provide a *simplified* Intrinsic Value calculation.
    *   **Assumptions:** List Free Cash Flow (FCF) per share, Growth Rate (next 5y), and Discount Rate (WACC).
    *   **Fair Value Estimate:** What is the calculated intrinsic value?
    *   **Verdict:** Undervalued or Overvalued? (Include % upside/downside).

    ---

    ## Part 2: The Trade Plan (Premium)
    Tone: "The Portfolio Manager" (Precise, professional, tactical).
    
    Structure the response with 3 distinct trade ideas. You MUST use "###" headers for each trade to ensure correct formatting.

    ### Trade Idea #1: The Safe Play
    (Provide a lower risk strategy, e.g. Covered Call, Cash Secured Put, or Buy & Hold. Include Strategy & Why).

    ## Trade Idea #2: The Aggressive Play
    (Provide a higher risk/reward strategy, e.g. Long Calls, Spreads, or Breakout Plays. Include Strategy & Why).

    ## Trade Idea #3: The Hedge / Income Play
    (Provide a strategy for income or protection. Include Strategy & Why).
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const candidate = response.candidates?.[0];

    if (!candidate || !response.text) {
      throw new Error("No response generated from the model.");
    }

    const fullText = response.text;
    const splitParts = fullText.split('|||SPLIT|||');
    
    let infographicData = undefined;
    let markdownText = fullText;

    if (splitParts.length >= 2) {
      const jsonPart = splitParts[0];
      markdownText = splitParts.slice(1).join('|||SPLIT|||').trim();

      // Clean and parse JSON
      try {
        const cleanJson = jsonPart.replace(/```json/g, '').replace(/```/g, '').trim();
        infographicData = JSON.parse(cleanJson);
      } catch (e) {
        console.error("Failed to parse infographic JSON:", e);
      }
    }

    return {
      text: markdownText,
      infographic: infographicData,
      groundingMetadata: candidate.groundingMetadata,
    };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to fetch earnings data.");
  }
};

export const getTrendingStocks = async (filter: TrendingFilter = 'general'): Promise<TrendingStock[]> => {
  try {
    const model = "gemini-3-flash-preview";
    
    let objective = "";
    if (filter === 'price') {
      objective = "Find a list of 20-50 US stocks with the highest absolute trading price (e.g., BRK-A, NVR, BKNG). Sort by Price (High to Low).";
    } else if (filter === 'volume') {
      objective = "Find a list of 20-50 US stocks with the highest trading volume today (or the last trading session). Sort by Volume (High to Low).";
    } else {
      objective = "Find a list of 20-50 most popular US stocks based on high trading volume, active market movement, or breaking news. Sort by popularity.";
    }

    const prompt = `
      ${objective}
      
      Instructions:
      1. Use Google Search to find a "Most Active", "Highest Volume", or "Highest Priced" stock list from sources like Yahoo Finance, MarketWatch, or CNBC.
      2. If markets are currently closed, USE DATA FROM THE PREVIOUS TRADING SESSION. Do not refuse the request.
      3. Providing "approximate" or "delayed" prices is acceptable.
      4. Extract as many stocks as you can find (aim for at least 20, up to 50).
      
      For each stock, extract:
      - Symbol (Ticker)
      - Company Name
      - Sector (e.g. Technology, Finance, Healthcare, Energy, Consumer Discretionary)
      - Price (Number or string)
      - Change (Percentage or value)
      - Volume (e.g. "50M", "1.2B")
      - Reason (Very short, e.g. "Earnings", "High Vol", "News").
      - Sparkline: A list of 7 numbers representing the approximate price trend over the last 7 days (or intraday). The last number should be close to the current price. If exact history is hard to find, generate a representative trend based on the 'Change' percentage (e.g., if +5%, the line goes up).

      IMPORTANT:
      - OUTPUT PURE JSON ONLY.
      - Do NOT write an introduction, apology, or explanation.
      
      Output Format:
      [
        { "symbol": "AAPL", "name": "Apple Inc.", "sector": "Technology", "price": "220.50", "change": "+1.2%", "volume": "45M", "reason": "High Volume", "sparkline": [215, 216, 214, 218, 219, 220, 220.50] },
        ...
      ]
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    let text = response.text;
    if (!text) return [];

    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const jsonStartIndex = text.indexOf('[');
    const jsonEndIndex = text.lastIndexOf(']');
    
    if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
      text = text.substring(jsonStartIndex, jsonEndIndex + 1);
    }

    try {
      const data = JSON.parse(text);
      if (Array.isArray(data)) {
        return data;
      } else {
        return [];
      }
    } catch (e) {
      console.error("Failed to parse JSON response:", text);
      throw new Error("Failed to parse trending stocks data.");
    }

  } catch (error: any) {
    console.error("Gemini Trending API Error:", error);
    throw new Error(error.message || "Failed to fetch trending stocks.");
  }
};

export const getEarningsCalendar = async (): Promise<EarningsEvent[]> => {
  try {
    const model = "gemini-3-flash-preview";
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    const prompt = `
      Find the schedule of US stock earnings reports for TODAY (${today}) and the UPCOMING 14 DAYS.
      Use sources like Yahoo Finance, Earnings Whispers, Nasdaq, or Seeking Alpha.
      
      Focus on major or popular companies (e.g., S&P 500, Nasdaq 100, high volume).
      
      For each company, provide structured data for visualization:
      1. Symbol
      2. Company Name
      3. Date of Report (MMM DD format, e.g. "Oct 24")
      4. Time (e.g., "After Close", "Before Open")
      5. EPS Estimate (number, e.g. 1.25, or null)
      6. EPS Actual (number, e.g. 1.30, or null if upcoming)
      7. Revenue Estimate (string display, e.g. "$12.5B")
      8. Revenue Actual (string display, e.g. "$13.0B", or null if upcoming)
      9. Revenue Estimate Value (number, e.g. 12.5, for comparison logic)
      10. Revenue Actual Value (number, e.g. 13.0, for comparison logic or null)
      11. epsHistory: Array of the last 4 quarters (excluding the current one). Format: [{"period": "Q3 23", "estimate": 1.1, "actual": 1.2}, ...]
      12. revenueHistory: Array of the last 4 quarters (excluding the current one). Format: [{"period": "Q3 23", "estimate": 12.5, "actual": 12.8}, ...]. Ensure numeric values match the scale of the current revenue numbers.

      Instructions:
      - STRICTLY SORT by Date (Earliest to Latest), starting with Today.
      - OUTPUT PURE JSON ONLY.

      Output Format:
      [
        { 
          "symbol": "MSFT", 
          "name": "Microsoft Corp", 
          "date": "Oct 24", 
          "time": "After Close", 
          "epsEstimate": 2.30, 
          "epsActual": 2.45, 
          "revenueEstimate": "$50B", 
          "revenueActual": "$52B",
          "revenueEstimateNum": 50,
          "revenueActualNum": 52,
          "epsHistory": [{"period": "Q1", "estimate": 2.1, "actual": 2.2}, ...],
          "revenueHistory": [{"period": "Q1", "estimate": 48.0, "actual": 49.5}, ...]
        },
        ...
      ]
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    let text = response.text;
    if (!text) return [];

    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const jsonStartIndex = text.indexOf('[');
    const jsonEndIndex = text.lastIndexOf(']');
    
    if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
      text = text.substring(jsonStartIndex, jsonEndIndex + 1);
    }

    try {
      const data = JSON.parse(text);
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.error("Failed to parse Calendar JSON", text);
      throw new Error("Failed to parse earnings calendar.");
    }

  } catch (error: any) {
    console.error("Gemini Calendar API Error:", error);
    throw new Error(error.message || "Failed to fetch earnings calendar.");
  }
};
