import React from "react";

interface GetStorage<T> {
  fetching: boolean;
  data: T | null;
  refetch: () => void;
}

export const useGetStorage = <T>(
  key: string,
  chr?: typeof chrome
): GetStorage<T> => {
  const [fetching, setFetching] = React.useState(true);
  const [data, setData] = React.useState<T>(null);

  const refetch = React.useCallback(() => {
    chr = chr || chrome;
    chr.storage.sync.get([key], (result) => {
      setData(result[key]);
      setFetching(false);
    });
  }, [key, chr]);
  React.useEffect(refetch, [refetch]);

  return { fetching, data, refetch };
};

interface SetStorage {
  fetching: boolean;
  setStorage: (key: string, value: any) => void;
}

export const useSetStorage = (chr?: typeof chrome): SetStorage => {
  const [fetching, setFetching] = React.useState(false);

  const setStorage = React.useCallback(
    (key, value) => {
      chr = chr || chrome;
      setFetching(true);
      chr.storage.sync.set({ [key]: value }, () => {
        setFetching(false);
      });
    },
    [chr]
  );

  return { fetching, setStorage };
};
