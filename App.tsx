
import React, { useState, useEffect, useMemo } from 'react';
import { Search, TrendingUp, AlertCircle, Loader2, Sparkles, Calendar as CalendarIcon, Star, Bookmark, LayoutDashboard, ArrowRight, BarChart3, Clock } from 'lucide-react';
import { searchEarningsData, getTrendingStocks, getEarningsCalendar } from './services/geminiService';
import { getWatchlist, toggleWatchlist, isInWatchlist } from './services/watchlistService';
import { SearchState, TrendingState, TrendingFilter, CalendarState, TrendingStock, EarningsEvent } from './types';
import { SourcesList } from './components/SourcesList';
import { MarkdownRenderer } from './components/MarkdownRenderer';
import { Sparkline } from './components/Sparkline';
import { Infographic } from './components/Infographic';
import { LandingPage } from './components/LandingPage';

type Tab = 'scout' | 'trending' | 'calendar' | 'watchlist';
type View = 'landing' | 'app';

const App: React.FC = () => {
  const [view, setView] = useState<View>('landing');
  const [activeTab, setActiveTab] = useState<Tab>('scout');
  const [query, setQuery] = useState('');
  
  // Scout State
  const [searchState, setSearchState] = useState<SearchState>({
    isLoading: false,
    data: null,
    error: null,
  });

  // Watchlist State
  const [watchlist, setWatchlist] = useState<string[]>([]);

  // Trending State
  const [trendingState, setTrendingState] = useState<TrendingState>({
    isLoading: false,
    data: null,
    error: null,
  });
  
  const [trendingFilter, setTrendingFilter] = useState<TrendingFilter>('general');

  // Calendar State
  const [calendarState, setCalendarState] = useState<CalendarState>({
    isLoading: false,
    data: null,
    error: null,
  });

  // Load data when tabs are switched or on mount
  useEffect(() => {
    setWatchlist(getWatchlist());

    if (view === 'app') {
      if (activeTab === 'trending' && !trendingState.data && !trendingState.isLoading) {
        fetchTrending();
      }
      if (activeTab === 'calendar' && !calendarState.data && !calendarState.isLoading) {
        fetchCalendar();
      }
    }
  }, [activeTab, view]);

  const enterApp = (ticker?: string) => {
    setView('app');
    if (ticker) {
      handleStockClick(ticker);
    }
  };

  const handleWatchlistToggle = (e: React.MouseEvent | null, ticker: string) => {
    if (e) e.stopPropagation();
    const updatedList = toggleWatchlist(ticker);
    setWatchlist(updatedList);
  };

  const fetchTrending = async (overrideFilter?: TrendingFilter) => {
    const filterToUse = overrideFilter || trendingFilter;
    setTrendingState({ isLoading: true, data: null, error: null });
    try {
      const data = await getTrendingStocks(filterToUse);
      setTrendingState({ isLoading: false, data, error: null });
    } catch (err: any) {
      setTrendingState({ isLoading: false, data: null, error: err.message });
    }
  };

  const fetchCalendar = async () => {
    setCalendarState({ isLoading: true, data: null, error: null });
    try {
      const data = await getEarningsCalendar();
      setCalendarState({ isLoading: false, data, error: null });
    } catch (err: any) {
      setCalendarState({ isLoading: false, data: null, error: err.message });
    }
  };

  const handleFilterChange = (newFilter: TrendingFilter) => {
    if (newFilter === trendingFilter) return;
    setTrendingFilter(newFilter);
    fetchTrending(newFilter);
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setSearchState({ isLoading: true, data: null, error: null });
    setActiveTab('scout');

    try {
      const result = await searchEarningsData(query);
      
      setSearchState({
        isLoading: false,
        data: result,
        error: null,
      });
    } catch (err: any) {
      setSearchState({
        isLoading: false,
        data: null,
        error: err.message || 'An unexpected error occurred',
      });
    }
  };

  const handleStockClick = (ticker: string) => {
    setQuery(ticker);
    setActiveTab('scout');
    setSearchState({ isLoading: true, data: null, error: null });
    
    searchEarningsData(ticker)
      .then((result) => {
        setSearchState({ isLoading: false, data: result, error: null });
      })
      .catch(err => {
        setSearchState({ isLoading: false, data: null, error: err.message || 'Error' });
      });
  };

  // Group trending stocks by sector
  const groupedTrendingStocks = useMemo<Record<string, TrendingStock[]>>(() => {
    if (!trendingState.data) return {};
    
    return trendingState.data.reduce((acc, stock) => {
      const sector = stock.sector || 'Uncategorized';
      if (!acc[sector]) {
        acc[sector] = [];
      }
      acc[sector].push(stock);
      return acc;
    }, {} as Record<string, TrendingStock[]>);
  }, [trendingState.data]);

  // Split content logic for Web View
  const getReportContent = () => {
    if (!searchState.data) return { part1: '', part2: '' };
    const fullText = searchState.data.text || '';
    const splitIndex = fullText.indexOf('## Part 2');
    if (splitIndex !== -1) {
      return {
        part1: fullText.substring(0, splitIndex),
        part2: fullText.substring(splitIndex)
      };
    }
    return { part1: fullText, part2: '' };
  };

  const { part1, part2 } = getReportContent();

  const NavButton = ({ id, label, icon: Icon }: { id: Tab, label: string, icon: any }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
        activeTab === id 
          ? 'bg-zinc-800 text-white' 
          : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );

  if (view === 'landing') {
    return (
      <LandingPage 
        onSearch={(ticker) => enterApp(ticker)} 
        onEnter={() => enterApp()} 
      />
    );
  }

  return (
    <div className="relative min-h-screen bg-zinc-100 text-zinc-900 font-sans">
      
      {/* Top Navigation Bar - Dark Terminal Style */}
      <header className="sticky top-0 z-50 bg-zinc-950 border-b border-zinc-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => { setActiveTab('scout'); setSearchState({isLoading: false, data: null, error: null}); setQuery(''); }}>
              <div className="bg-indigo-600 p-1.5 rounded text-white group-hover:bg-indigo-500 transition-colors">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h1 className="text-lg font-bold text-white tracking-tight">
                Earnings<span className="text-indigo-400">Scout</span>
              </h1>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              <NavButton id="scout" label="Research" icon={Search} />
              <NavButton id="trending" label="Markets" icon={BarChart3} />
              <NavButton id="calendar" label="Calendar" icon={CalendarIcon} />
              <NavButton id="watchlist" label="Watchlist" icon={Star} />
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="text-xs text-zinc-500 font-mono hidden sm:block">
               MARKET_STATUS: <span className="text-emerald-500">ACTIVE</span>
             </div>
             {/* Return to home/logout placeholder */}
             <button onClick={() => setView('landing')} className="text-zinc-500 hover:text-white transition-colors">
                <LayoutDashboard className="w-5 h-5" />
             </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* SCOUT TAB */}
        {activeTab === 'scout' && (
          <div className="animate-fade-in">
            {/* Command Center (Search) */}
            <div className={`transition-all duration-500 ease-in-out ${searchState.data ? 'mb-8' : 'min-h-[60vh] flex flex-col justify-center'}`}>
              
              <div className={`max-w-2xl mx-auto w-full ${!searchState.data ? 'text-center' : ''}`}>
                {!searchState.data && (
                  <div className="mb-8">
                    <h2 className="text-4xl font-extrabold text-zinc-900 mb-3 tracking-tight">
                      Institutional-Grade <br/> Earnings Intelligence.
                    </h2>
                    <p className="text-zinc-500 text-lg">
                      Deep-dive analysis of transcripts, 10-Qs, and investor decks.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSearch} className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className={`w-5 h-5 ${searchState.isLoading ? 'text-indigo-500' : 'text-zinc-400'}`} />
                  </div>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search ticker (e.g., NVDA, MSFT)"
                    className="block w-full pl-12 pr-4 py-4 bg-white border border-zinc-200 rounded-xl text-lg shadow-sm placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none font-medium disabled:opacity-50"
                    disabled={searchState.isLoading}
                  />
                  <button
                    type="submit"
                    disabled={searchState.isLoading || !query.trim()}
                    className="absolute inset-y-2 right-2 px-6 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-300 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                  >
                    {searchState.isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )}
                  </button>
                </form>

                {searchState.isLoading ? (
                  <div className="mt-10 max-w-md mx-auto text-center animate-fade-in">
                    <div className="flex items-center justify-between text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                      <span>Analyzing {query}</span>
                      <span className="text-indigo-500 animate-pulse">Running Models</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden relative shadow-inner">
                       <div className="absolute inset-y-0 left-0 bg-indigo-600 w-1/3 rounded-full animate-[shimmer_2s_infinite_linear]"></div>
                    </div>
                    <div className="mt-6 flex justify-center gap-8 text-xs text-zinc-400 font-medium">
                       <span className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div> 
                         Reading 10-Q
                       </span>
                       <span className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse delay-75"></div> 
                         Parsing Transcript
                       </span>
                       <span className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse delay-150"></div> 
                         Calculating Valuation
                       </span>
                    </div>
                  </div>
                ) : !searchState.data && (
                  <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 animate-slide-up">
                    {['NVDA', 'TSLA', 'PLTR', 'AMD'].map(t => (
                      <button 
                        key={t}
                        onClick={() => handleStockClick(t)}
                        className="px-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-semibold text-zinc-600 hover:border-indigo-300 hover:text-indigo-600 transition-all"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Error State */}
            {searchState.error && (
              <div className="max-w-2xl mx-auto p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-700 mb-8 animate-fade-in">
                <AlertCircle className="w-5 h-5 mt-0.5" />
                <div>
                  <h3 className="font-semibold">Analysis Failed</h3>
                  <p className="text-sm opacity-90">{searchState.error}</p>
                </div>
              </div>
            )}

            {/* Results View */}
            {searchState.data && !searchState.isLoading && (
              <div className="animate-slide-up">
                {/* Watchlist Action Bar */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <span className="text-zinc-400">Analysis:</span> {query.toUpperCase()}
                  </h2>
                  <button
                    onClick={(e) => handleWatchlistToggle(e, query)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition-all ${
                      isInWatchlist(query, watchlist)
                        ? 'bg-amber-50 text-amber-700 border-amber-200' 
                        : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${isInWatchlist(query, watchlist) ? 'fill-amber-500 text-amber-500' : ''}`} />
                    {isInWatchlist(query, watchlist) ? 'Watching' : 'Watch'}
                  </button>
                </div>

                {/* Infographic Card */}
                {searchState.data.infographic && (
                  <Infographic data={searchState.data.infographic} />
                )}

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
                  {/* Left Main Content */}
                  <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white p-8 rounded-xl border border-zinc-200 shadow-sm">
                      <div className="flex items-center gap-2 mb-6 border-b border-zinc-100 pb-4">
                        <LayoutDashboard className="w-5 h-5 text-indigo-600" />
                        <h3 className="text-lg font-bold text-zinc-900">Executive Analysis</h3>
                      </div>
                      <MarkdownRenderer content={part1} onSymbolClick={handleStockClick} />
                    </div>

                    <div className="bg-white p-8 rounded-xl border border-zinc-200 shadow-sm">
                       <div className="flex items-center gap-2 mb-6 border-b border-zinc-100 pb-4">
                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                        <h3 className="text-lg font-bold text-zinc-900">Strategic Trade Plan</h3>
                      </div>
                      <MarkdownRenderer content={part2} onSymbolClick={handleStockClick} />
                      
                      <div className="mt-8 pt-6 border-t border-zinc-100 text-center">
                        <p className="text-xs text-zinc-400 italic">
                          This report is generated by AI for informational purposes only. It is not financial advice. Verify all data before trading.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Sidebar (Sources & Meta) */}
                  <div className="lg:col-span-4 space-y-6">
                     <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm sticky top-24">
                        <SourcesList metadata={searchState.data.groundingMetadata} variant="list" />
                     </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TRENDING TAB */}
        {activeTab === 'trending' && (
          <div className="animate-fade-in">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                   <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Market Movers</h2>
                   <p className="text-zinc-500">Real-time sector performance and high-volume tickers.</p>
                </div>
                <div className="flex bg-white p-1 rounded-lg border border-zinc-200">
                  {(['general', 'volume', 'price'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => handleFilterChange(f)}
                      className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all capitalize ${
                        trendingFilter === f ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-900'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
             </div>
             
             {trendingState.isLoading ? (
               <div className="py-32 flex flex-col items-center justify-center text-zinc-400">
                 <Loader2 className="w-8 h-8 animate-spin mb-4 text-indigo-500" />
                 <p className="text-sm font-medium">Scanning market data...</p>
               </div>
             ) : trendingState.data ? (
               <div className="space-y-12">
                 {Object.entries(groupedTrendingStocks).sort().map(([sector, stocksData]) => {
                   const stocks = stocksData as TrendingStock[];
                   return (
                   <div key={sector}>
                      <div className="flex items-center gap-3 mb-4 border-b border-zinc-200 pb-2">
                         <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500">{sector}</h3>
                         <span className="bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded text-xs font-bold">{stocks.length}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {stocks.map((stock, i) => (
                            <div 
                              key={`${stock.symbol}-${i}`} 
                              className="group bg-white p-5 rounded-xl border border-zinc-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer relative overflow-hidden" 
                              onClick={() => handleStockClick(stock.symbol)}
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <div className="font-bold text-lg text-zinc-900 group-hover:text-indigo-600 transition-colors">{stock.symbol}</div>
                                  <div className="text-xs text-zinc-500 truncate max-w-[140px]" title={stock.name}>{stock.name}</div>
                                </div>
                                <div className="text-right">
                                  <div className="font-mono font-medium text-zinc-900">{stock.price}</div>
                                  <div className={`text-xs font-bold ${stock.change.includes('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {stock.change}
                                  </div>
                                </div>
                              </div>
                              <div className="h-12 -mx-2">
                                <Sparkline data={stock.sparkline} width={220} height={48} isPositive={stock.change.includes('+')} />
                              </div>
                              <div className="mt-3 pt-3 border-t border-zinc-50 flex justify-between items-center">
                                <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wide">Vol: {stock.volume}</span>
                                <span className="text-[10px] px-1.5 py-0.5 bg-zinc-100 text-zinc-600 rounded font-medium">{stock.reason}</span>
                              </div>
                            </div>
                          ))}
                      </div>
                   </div>
                 );
                 })}
               </div>
             ) : null}
          </div>
        )}

        {/* CALENDAR TAB */}
        {activeTab === 'calendar' && (
           <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-8">
                <div>
                   <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Earnings Calendar</h2>
                   <p className="text-zinc-500">Upcoming reports scheduled for the next 14 days.</p>
                </div>
              </div>

               {calendarState.isLoading ? (
               <div className="py-32 flex flex-col items-center justify-center text-zinc-400">
                 <Loader2 className="w-8 h-8 animate-spin mb-4 text-indigo-500" />
                 <p className="text-sm font-medium">Fetching schedule...</p>
               </div>
             ) : calendarState.data ? (
               <div className="space-y-8">
                  {/* Group by date logic inside render */}
                  {(() => {
                    const data = calendarState.data || [];
                    const grouped = data.reduce((acc, event) => {
                      const date = event.date;
                      if (!acc[date]) acc[date] = [];
                      acc[date].push(event);
                      return acc;
                    }, {} as Record<string, EarningsEvent[]>);

                    return (Object.entries(grouped) as [string, EarningsEvent[]][]).map(([date, events]) => (
                      <div key={date} className="animate-slide-up">
                        <div className="flex items-center gap-3 mb-3">
                           <div className="h-px bg-zinc-200 flex-1"></div>
                           <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider bg-zinc-100 px-3 py-1 rounded-full">{date}</h3>
                           <div className="h-px bg-zinc-200 flex-1"></div>
                        </div>
                        
                        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
                          <div className="grid grid-cols-1 divide-y divide-zinc-100">
                            {events.map((event, i) => (
                              <div 
                                key={i} 
                                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-zinc-50 transition-colors cursor-pointer group" 
                                onClick={() => handleStockClick(event.symbol)}
                              >
                                <div className="flex items-center gap-4 mb-3 sm:mb-0">
                                   <div className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center font-bold border ${event.time.includes('After') ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-amber-50 border-amber-100 text-amber-600'}`}>
                                      {/* Icon based on time? Sun/Moon */}
                                      {event.time.toLowerCase().includes('after') || event.time.toLowerCase().includes('close') ? (
                                        <div className="text-[10px] uppercase">PM</div>
                                      ) : (
                                        <div className="text-[10px] uppercase">AM</div>
                                      )}
                                      <Clock className="w-4 h-4" />
                                   </div>
                                   <div>
                                      <div className="font-bold text-lg text-zinc-900 group-hover:text-indigo-600 transition-colors">{event.symbol}</div>
                                      <div className="text-sm text-zinc-500">{event.name}</div>
                                   </div>
                                </div>

                                <div className="flex items-center gap-6 sm:gap-12">
                                   <div className="min-w-[80px]">
                                      <div className="text-[10px] uppercase font-bold text-zinc-400 mb-1">Time</div>
                                      <div className="text-sm font-medium text-zinc-700">
                                        {event.time}
                                      </div>
                                   </div>
                                   <div className="min-w-[80px]">
                                      <div className="text-[10px] uppercase font-bold text-zinc-400 mb-1">EPS Est</div>
                                      <div className="text-sm font-mono font-medium text-zinc-900">{event.epsEstimate || '-'}</div>
                                   </div>
                                   <div className="min-w-[80px]">
                                      <div className="text-[10px] uppercase font-bold text-zinc-400 mb-1">Rev Est</div>
                                      <div className="text-sm font-mono font-medium text-zinc-900">{event.revenueEstimate}</div>
                                   </div>
                                   <div className="hidden sm:block text-zinc-300">
                                      <ArrowRight className="w-5 h-5 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                                   </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ));
                  })()}
               </div>
             ) : null}
           </div>
        )}

        {/* WATCHLIST TAB */}
        {activeTab === 'watchlist' && (
           <div className="animate-fade-in">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 mb-2">My Watchlist</h2>
              <p className="text-zinc-500 mb-8">Tracked assets for quick analysis.</p>

              {watchlist.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-xl border border-dashed border-zinc-300">
                  <Bookmark className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
                  <p className="text-zinc-500 font-medium">No stocks saved yet.</p>
                  <p className="text-sm text-zinc-400 mt-1">Search for a ticker and click 'Watch' to add it here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {watchlist.map(t => (
                    <div 
                      key={t} 
                      className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all flex flex-col items-center text-center group" 
                      onClick={() => handleStockClick(t)}
                    >
                      <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold mb-3 group-hover:scale-110 transition-transform">
                        {t[0]}
                      </div>
                      <div className="font-bold text-lg text-zinc-900">{t}</div>
                      <div className="text-xs text-zinc-400 mt-1 font-medium">Click to Analyze</div>
                    </div>
                  ))}
                </div>
              )}
           </div>
        )}
      </main>
    </div>
  );
};

export default App;
