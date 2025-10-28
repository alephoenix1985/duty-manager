const BASE_URL = process.env.REACT_APP_API_URL || "/api";

const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const clearCache = () => {
  cache.clear();
  console.log("API cache cleared.");
};

export interface ApiClientOptions extends RequestInit {
  useCache?: boolean;
}

export const apiClient = async <T>(
  endpoint: string,
  options: ApiClientOptions = {},
): Promise<T> => {
  const { useCache = true, ...fetchOptions } = options;
  const method = fetchOptions.method?.toUpperCase() || "GET";
  const cacheKey = `${method}:${endpoint}:${JSON.stringify(fetchOptions.body || {})}`;

  try {
    if (method === "GET" && useCache) {
      const cached = cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log(`Serving from cache: ${cacheKey}`);
        return cached.data as T;
      }
    }
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers: {
        "Content-Type": "application/json",
        ...fetchOptions.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        errorText || `Server responded with status: ${response.status}`,
      );
    }

    if (response.status === 204) {
      clearCache();
      return null as T;
    }

    const result = await response.json();

    if (method === "GET" && useCache) {
      cache.set(cacheKey, { data: result, timestamp: Date.now() });
    }

    if (method !== "GET") {
      clearCache();
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "An unknown network error occurred.");
    }
    throw new Error("An unknown error occurred.");
  }
};
