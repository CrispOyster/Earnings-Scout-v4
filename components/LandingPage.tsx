
import React, { useState } from 'react';
import { Search, TrendingUp, Shield, Zap, BarChart3, ArrowRight, Activity, Layout, Check, FileText, Globe, Cpu, Lock } from 'lucide-react';
import { Infographic } from './Infographic';
import { InfographicData } from '../types';

interface LandingPageProps {
  onSearch: (ticker: string) => void;
  onEnter: () => void;
}

const amdMockData: InfographicData = {
  title: "Advanced Micro Devices (AMD) Q3 Analysis",
  website: "amd.com",
  vibe: {
    score: 8,
    quote: "Our data center business is on a significant growth trajectory driven by MI300 demand.",
    analysis: "CEO Dr. Lisa Su projected extreme confidence in the AI roadmap, dismissing concerns about supply constraints."
  },
  redFlag: {
    title: "Gaming Segment Drag",
    description: "Gaming revenue collapsed 59% YoY. Management expects this weakness to persist into 2025."
  },
  greenFlag: {
    title: "Data Center Hypergrowth",
    description: "Data Center revenue hit a record $3.5B (up 122% YoY), validating the AI infrastructure thesis."
  },
  consensus: {
    rating: "Strong Buy",
    priceTarget: "$185.00"
  },
  dcf: {
    fairValue: 168.40,
    currentPrice: 142.50,
    verdict: "Undervalued"
  }
};

export const LandingPage: React.FC<LandingPageProps> = ({ onSearch, onEnter }) => {
  const [ticker, setTicker] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticker.trim()) {
      onSearch(ticker);
    } else {
      onEnter();
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={onEnter}>
            <div className="bg-zinc-900 p-2 rounded-lg text-white group-hover:bg-indigo-600 transition-colors">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900">Earnings<span className="text-indigo-600">Scout</span></span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={onEnter} className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition-colors">Log In</button>
            <button onClick={onEnter} className="bg-zinc-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-zinc-800 transition-all shadow-sm hover:shadow-md active:scale-95">
              Launch Terminal
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative z-10 animate-fade-in">
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-zinc-900 mb-8 leading-[1.05] animate-slide-up">
              Stop Trading on <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Wall Street Noise.</span>
            </h1>
            <p className="text-xl text-zinc-500 mb-10 leading-relaxed max-w-lg animate-slide-up" style={{animationDelay: '0.1s'}}>
              Institutional-grade earnings analysis in seconds. We parse 10-Qs, transcripts, and investor decks to give you the signal, not the noise.
            </p>

            <form onSubmit={handleSubmit} className="relative max-w-md shadow-2xl shadow-indigo-500/10 rounded-2xl animate-slide-up group" style={{animationDelay: '0.2s'}}>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input
                type="text"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                placeholder="Enter ticker (e.g., NVDA)..."
                className="block w-full pl-12 pr-40 py-5 bg-white border border-zinc-200 rounded-2xl text-lg font-medium placeholder:text-zinc-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
              <button
                type="submit"
                className="absolute inset-y-2 right-2 px-6 bg-zinc-900 text-white font-semibold rounded-xl hover:bg-zinc-800 transition-colors flex items-center gap-2"
              >
                Analyze
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-8 flex items-center gap-4 text-sm text-zinc-500 animate-slide-up" style={{animationDelay: '0.3s'}}>
              <span className="font-semibold text-zinc-400 uppercase tracking-wider text-xs">Trending Now:</span>
              <div className="flex gap-3">
                {['PLTR', 'TSLA', 'AMD', 'SOFI'].map(t => (
                  <button key={t} onClick={() => onSearch(t)} className="font-bold text-zinc-700 bg-zinc-100 hover:bg-indigo-50 hover:text-indigo-600 px-2 py-1 rounded transition-colors text-xs">
                    ${t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Abstract Visual / UI Mockup */}
          <div className="relative lg:h-[600px] flex items-center justify-center animate-fade-in" style={{animationDelay: '0.4s'}}>
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50 to-white rounded-full blur-3xl opacity-60"></div>
            <div className="relative w-full max-w-lg perspective-1000">
                {/* Floating Cards simulating the app UI */}
                <div className="absolute top-0 right-0 bg-white p-6 rounded-2xl shadow-xl border border-zinc-100 w-64 animate-slide-up hover:scale-105 transition-transform duration-300" style={{ animationDelay: '0.5s' }}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-xs text-zinc-500 uppercase font-bold">Vibe Score</div>
                            <div className="text-lg font-bold text-zinc-900">8.0/10</div>
                        </div>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[80%]"></div>
                    </div>
                </div>

                <div className="absolute bottom-12 left-0 bg-white p-6 rounded-2xl shadow-xl border border-zinc-100 w-72 animate-slide-up hover:scale-105 transition-transform duration-300" style={{ animationDelay: '0.7s' }}>
                     <div className="flex items-center gap-3 mb-3">
                         <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <BarChart3 className="w-5 h-5" />
                         </div>
                         <div className="font-bold text-zinc-900">Analyst Consensus</div>
                     </div>
                     <div className="flex justify-between items-end">
                         <div className="text-3xl font-bold text-zinc-900">BUY</div>
                         <div className="text-sm font-medium text-zinc-500 mb-1">Target: $185.00</div>
                     </div>
                </div>

                <div className="relative z-10 bg-zinc-900 text-white p-8 rounded-3xl shadow-2xl w-full mx-auto mt-12 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500 hover:scale-105 border border-zinc-800">
                    <div className="flex items-center justify-between mb-6 border-b border-zinc-800 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        </div>
                        <div className="text-xs font-mono text-zinc-500">TERMINAL_V4</div>
                    </div>
                    <div className="space-y-4 font-mono text-sm">
                        <div className="flex justify-between">
                            <span className="text-zinc-400">TICKER</span>
                            <span className="text-indigo-400 font-bold">AMD</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-zinc-400">REVENUE_ACT</span>
                            <span className="text-emerald-400 font-bold">$6.8B (BEAT)</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-zinc-400">GUIDANCE</span>
                            <span className="text-emerald-400 font-bold">RAISED</span>
                        </div>
                        <div className="p-3 bg-zinc-800 rounded border-l-2 border-indigo-500 text-zinc-300 text-xs leading-relaxed mt-4 italic">
                            "Data Center revenue more than doubled. We are just getting started with MI300."
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Example Report Section */}
      <section className="py-20 bg-zinc-50 border-y border-zinc-200">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-zinc-900 mb-3 tracking-tight">Instant Visual Intelligence</h2>
            <p className="text-zinc-500 text-lg">Every search generates a comprehensive visual breakdown like this.</p>
          </div>
          <div className="pointer-events-none select-none transform scale-95 md:scale-100 transition-transform origin-top shadow-xl rounded-2xl">
             <Infographic data={amdMockData} />
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl font-bold text-zinc-900 mb-4 tracking-tight">Why Retail Investors Love Us</h2>
                <p className="text-zinc-500 text-lg">We bridge the gap between retail traders and institutional data terminals.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    {
                        icon: Zap,
                        title: "Executive Vibe Check",
                        desc: "We analyze tone, hesitation, and sentiment in earnings calls to tell you how confident the CEO really is."
                    },
                    {
                        icon: Shield,
                        title: "Red Flag Detection",
                        desc: "Our models hunt for buried risks in 10-Q footnotes that management tries to hide from the presentation deck."
                    },
                    {
                        icon: TrendingUp,
                        title: "Strategic Trade Plans",
                        desc: "Get 3 actionable trade structures (Bull, Bear, Neutral) based on the post-earnings analysis."
                    }
                ].map((feature, i) => (
                    <div key={i} className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                            <feature.icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-900 mb-3">{feature.title}</h3>
                        <p className="text-zinc-600 leading-relaxed">
                            {feature.desc}
                        </p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* New Key Features Section */}
      <section className="py-24 bg-zinc-50 border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div className="order-2 lg:order-1">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-2xl border border-zinc-100 hover:border-indigo-200 transition-colors shadow-sm">
                        <div className="w-10 h-10 bg-zinc-50 rounded-lg border border-zinc-100 flex items-center justify-center mb-4 text-indigo-600">
                            <FileText className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-zinc-900 mb-1">10-Q Deep Dives</h4>
                        <p className="text-sm text-zinc-500">Instant parsing of SEC filings to find hidden liabilities.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-zinc-100 hover:border-indigo-200 transition-colors shadow-sm">
                        <div className="w-10 h-10 bg-zinc-50 rounded-lg border border-zinc-100 flex items-center justify-center mb-4 text-indigo-600">
                            <Globe className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-zinc-900 mb-1">Macro Context</h4>
                        <p className="text-sm text-zinc-500">Connects company results with global economic trends.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-zinc-100 hover:border-indigo-200 transition-colors shadow-sm">
                        <div className="w-10 h-10 bg-zinc-50 rounded-lg border border-zinc-100 flex items-center justify-center mb-4 text-indigo-600">
                            <Cpu className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-zinc-900 mb-1">AI Valuation</h4>
                        <p className="text-sm text-zinc-500">Automated DCF, P/E, and PEG ratio analysis models.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-zinc-100 hover:border-indigo-200 transition-colors shadow-sm">
                        <div className="w-10 h-10 bg-zinc-50 rounded-lg border border-zinc-100 flex items-center justify-center mb-4 text-indigo-600">
                            <Lock className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-zinc-900 mb-1">Insider Tracking</h4>
                        <p className="text-sm text-zinc-500">Monitor CEO and Congressional trading activity.</p>
                    </div>
                </div>
            </div>
            <div className="order-1 lg:order-2">
                <h2 className="text-3xl font-bold text-zinc-900 mb-6 tracking-tight">Everything you need to <br/> <span className="text-indigo-600">outperform the index.</span></h2>
                <p className="text-lg text-zinc-500 mb-8 leading-relaxed">
                    We don't just summarize news. We extract hard data points, cross-reference them with historical performance, and build professional-grade trade theses for every earnings event.
                </p>
                <ul className="space-y-4 mb-10">
                    {[
                        "Sentiment Analysis of Earnings Calls",
                        "Visual Financial Health Infographics"
                    ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                                <Check className="w-3 h-3" />
                            </div>
                            <span className="font-medium text-zinc-700">{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-zinc-200">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2 cursor-pointer" onClick={onEnter}>
                <div className="bg-zinc-900 p-1.5 rounded text-white">
                    <TrendingUp className="w-4 h-4" />
                </div>
                <span className="font-bold text-zinc-900">EarningsScout</span>
              </div>
              <div className="flex gap-8 text-sm font-medium text-zinc-500">
                 <button onClick={onEnter} className="hover:text-zinc-900">Markets</button>
                 <button onClick={onEnter} className="hover:text-zinc-900">Calendar</button>
                 <button onClick={onEnter} className="hover:text-zinc-900">Analysis</button>
              </div>
              <div className="text-sm text-zinc-400">
                  © 2025 Earnings Scout Financial Data.
              </div>
          </div>
      </footer>
    </div>
  );
};
