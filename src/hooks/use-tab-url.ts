import React from "react";

interface TabUrlState {
  url?: string;
  fetching: boolean;
  error?: string;
}

export const useTabUrl = (chr?: typeof chrome): TabUrlState => {
  const [url, setUrl] = React.useState<string>();
  const [error, setError] = React.useState<string>();
  const [fetching, setFetching] = React.useState(true);

  React.useEffect(() => {
    setFetching(true);
    chr = chr || chrome;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const error = chr?.runtime?.lastError?.message;
      if (error) {
        setError(error);
      } else {
        const tab = tabs[0];
        const { url } = tab;
        setUrl(url);
        setFetching(false);
      }
    });
  }, [chr]);

  return {
    url,
    fetching,
    error,
  };
};
