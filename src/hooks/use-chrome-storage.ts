import React from "react";

interface GetStorageProps<T> {
  fetching: boolean;
  data: T | null;
}

export const useGetStorage = <T>(
  key: string,
  chr?: typeof chrome
): GetStorageProps<T> => {
  const [fetching, setFetching] = React.useState(true);
  const [data, setData] = React.useState<T>(null);

  React.useEffect(() => {
    chr = chr || chrome;
    chr.storage.sync.get([key], (result) => {
      setData(result[key]);
      setFetching(false);
    });
  }, [key, chr]);

  return { fetching, data };
};

interface SetStorageProps {
  fetching: boolean;
  setStorage: (key: string, value: any) => void;
}

export const useSetStorage = (chr?: typeof chrome): SetStorageProps => {
  const [fetching, setFetching] = React.useState(false);

  const setStorage = React.useCallback((key, value) => {
    chr = chr || chrome;
    setFetching(true);
    chr.storage.sync.set({ [key]: value }, () => {
      setFetching(false);
    });
  }, []);

  return { fetching, setStorage };
};
