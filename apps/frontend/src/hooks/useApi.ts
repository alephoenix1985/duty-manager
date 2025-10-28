import { useState, useCallback, useEffect } from "react";
import { App as AntApp } from "antd";

interface UseApiOptions {
  immediate?: boolean;
  errorNotification?: string;
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  request: (...args: any[]) => Promise<T | void>;
}

export const useApi = <T>(
  apiFunc: (...args: any[]) => Promise<T>,
  options: UseApiOptions = {},
): UseApiReturn<T> => {
  const { immediate = false, errorNotification } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<Error | null>(null);
  const { notification } = AntApp.useApp();

  const request = useCallback(
    async (...args: any[]): Promise<T | void> => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiFunc(...args);
        setData(result);
        return result;
      } catch (err) {
        const apiError =
          err instanceof Error ? err : new Error("An unknown error occurred");
        setError(apiError);
        notification.error({
          message: "API Error",
          description: errorNotification || apiError.message,
        });
        throw apiError;
      } finally {
        setLoading(false);
      }
    },
    [apiFunc, notification, errorNotification],
  );

  useEffect(() => {
    if (immediate) {
      request();
    }
  }, [request, immediate]);

  return { data, loading, error, request };
};
