import { SearchResult, StoredReport } from '../types';

const DB_NAME = 'EarningsScoutDB';
const DB_VERSION = 1;
const STORE_NAME = 'reports';

// Initialize the Database
export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    // Check for support
    if (!('indexedDB' in window)) {
      reject(new Error("This browser doesn't support IndexedDB"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error("IndexedDB error:", request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        // Create indexes for searching/sorting
        store.createIndex('timestamp', 'timestamp', { unique: false });
        store.createIndex('ticker', 'ticker', { unique: false });
      }
    };
  });
};

// Save a report
export const saveReport = async (ticker: string, data: SearchResult): Promise<void> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const timestamp = Date.now();
      const report: StoredReport = {
        ...data,
        id: `${ticker.toUpperCase()}_${timestamp}`,
        ticker: ticker.toUpperCase(),
        timestamp,
      };

      const request = store.put(report);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Failed to save report to DB", error);
  }
};

// Get recent reports
export const getRecentReports = async (limit: number = 6): Promise<StoredReport[]> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('timestamp');
      // 'prev' direction gives us newest first
      const request = index.openCursor(null, 'prev');
      
      const results: StoredReport[] = [];

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result as IDBCursorWithValue;
        if (cursor && results.length < limit) {
          results.push(cursor.value);
          cursor.continue();
        } else {
          resolve(results);
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Failed to get reports from DB", error);
    return [];
  }
};

// Delete a report
export const deleteReport = async (id: string): Promise<void> => {
   try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
   } catch (error) {
     console.error("Failed to delete report", error);
   }
}
