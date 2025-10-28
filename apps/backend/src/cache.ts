interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<any>>();
const DEFAULT_TTL = 60 * 1000;

export const getFromCache = <T>(key: string): T | null => {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < DEFAULT_TTL) {
    console.log(`Serving from backend cache: ${key}`);
    return entry.data as T;
  }
  if (entry) {
    cache.delete(key);
  }
  return null;
};

export const setInCache = <T>(key: string, data: T): void => {
  cache.set(key, { data, timestamp: Date.now() });
};

export const invalidateCache = (key?: string): void => {
  if (key) {
    cache.delete(key);
    console.log(`Backend cache invalidated for key: ${key}`);
  } else {
    cache.clear();
    console.log("Backend cache cleared.");
  }
};
