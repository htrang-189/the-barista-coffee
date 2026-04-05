/**
 * localStorage utilities with expiry support
 */
export const cache = {
  set: (key: string, value: any, expiryDays: number = 7) => {
    try {
      const now = Date.now();
      const expiryTime = now + expiryDays * 24 * 60 * 60 * 1000;
      localStorage.setItem(key, JSON.stringify({ value, expiryTime }));
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  },

  get: (key: string) => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const { value, expiryTime } = JSON.parse(item);
      if (Date.now() > expiryTime) {
        localStorage.removeItem(key);
        return null;
      }

      return value;
    } catch (error) {
      console.error('Error getting cache:', error);
      return null;
    }
  },

  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing cache:', error);
    }
  },

  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  },
};

/**
 * IndexedDB utilities for larger data storage
 */
export const openDB = async (dbName: string, version: number = 1): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, version);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (e) => {
      // Upgrade handler if needed
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('data')) {
        db.createObjectStore('data', { keyPath: 'id' });
      }
    };
  });
};

export const getFromIndexedDB = async (dbName: string, key: string) => {
  try {
    const db = await openDB(dbName);
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['data'], 'readonly');
      const store = transaction.objectStore('data');
      const request = store.get(key);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result?.value || null);
    });
  } catch (error) {
    console.error('Error getting from IndexedDB:', error);
    return null;
  }
};

export const saveToIndexedDB = async (dbName: string, key: string, value: any) => {
  try {
    const db = await openDB(dbName);
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['data'], 'readwrite');
      const store = transaction.objectStore('data');
      const request = store.put({ id: key, value });
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(true);
    });
  } catch (error) {
    console.error('Error saving to IndexedDB:', error);
    return false;
  }
};
