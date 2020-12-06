import React from "react";

interface ChromeStorageState<T> {
  fetching: boolean;
  error: string | null;
  state: T | null;
  setState(value: T): void;
}

export const useChromeStorage = <T>(
  key: string,
  chr?: typeof chrome
): ChromeStorageState<T> => {
  const [fetching, setFetching] = React.useState(true);
  const [state, _setState] = React.useState<T>(null);
  const [error, setError] = React.useState<string>(null);

  const refetch = React.useCallback(() => {
    setFetching(true);
    chr = chr || chrome;
    chr.storage.sync.get([key], (result) => {
      const error = chr?.runtime?.lastError?.message;
      if (error) {
        setError(error);
      } else {
        _setState(result[key]);
      }
      setFetching(false);
    });
  }, [key, chr]);

  const setState = React.useCallback(
    (value: T) => {
      setFetching(true);
      chr = chr || chrome;
      chr.storage.sync.set({ [key]: value }, () => {
        const error = chr?.runtime?.lastError?.message;
        if (error) {
          setError(error);
        } else {
          _setState(value);
        }
        setFetching(false);
      });
    },
    [key, chr]
  );

  React.useEffect(refetch, [refetch]);

  return {
    fetching,
    error,
    state,
    setState,
  };
};
