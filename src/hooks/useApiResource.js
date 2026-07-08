import { useCallback, useEffect, useMemo, useState } from "react";
import { getListItems } from "../api/client";

export function useApiQuery(fetcher, { initialData = null, immediate = true } = {}) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(Boolean(immediate));
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetcher(...args);
      setData(response);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    if (!immediate) return undefined;

    let active = true;
    queueMicrotask(() => {
      if (!active) return;

      setLoading(true);
      setError(null);

      fetcher()
        .then((response) => {
          if (active) setData(response);
        })
        .catch((err) => {
          if (active) setError(err);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    });

    return () => {
      active = false;
    };
  }, [fetcher, immediate]);

  return { data, loading, error, refetch: execute, setData };
}

export function useApiMutation(mutator) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const response = await mutator(...args);
      setData(response);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [mutator]);

  return { mutate, data, loading, error, reset: () => setError(null) };
}

export function useResourceList(listFetcher, params = {}, options = {}) {
  const stableParams = useMemo(() => params, [params]);
  const query = useApiQuery(
    useCallback(() => listFetcher(stableParams), [listFetcher, stableParams]),
    { initialData: [], ...options },
  );

  return {
    ...query,
    items: getListItems(query.data),
    pagination: query.data?.pagination || null,
  };
}
