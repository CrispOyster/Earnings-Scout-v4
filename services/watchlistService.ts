
const WATCHLIST_KEY = 'earnings_scout_watchlist';

export const getWatchlist = (): string[] => {
  try {
    const stored = localStorage.getItem(WATCHLIST_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to parse watchlist", e);
    return [];
  }
};

export const addToWatchlist = (ticker: string): string[] => {
  const current = getWatchlist();
  const upperTicker = ticker.toUpperCase();
  if (!current.includes(upperTicker)) {
    const updated = [...current, upperTicker];
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
    return updated;
  }
  return current;
};

export const removeFromWatchlist = (ticker: string): string[] => {
  const current = getWatchlist();
  const upperTicker = ticker.toUpperCase();
  const updated = current.filter(t => t !== upperTicker);
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
  return updated;
};

export const toggleWatchlist = (ticker: string): string[] => {
  const current = getWatchlist();
  const upperTicker = ticker.toUpperCase();
  if (current.includes(upperTicker)) {
    return removeFromWatchlist(upperTicker);
  } else {
    return addToWatchlist(upperTicker);
  }
};

export const isInWatchlist = (ticker: string, list: string[]): boolean => {
  return list.includes(ticker.toUpperCase());
};
