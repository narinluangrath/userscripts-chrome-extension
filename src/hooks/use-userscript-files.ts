import React from "react";

import { getUserscripts } from "../utils";
import { Userscript } from "../types";

interface UserscriptFiles {
  userscripts: Userscript[] | null;
  refetch: () => void;
  fetching: boolean;
  error: Error | null;
}

export const useUserscriptFiles = (repo?: string): UserscriptFiles => {
  const [userscripts, setUserscripts] = React.useState<Userscript[]>(null);
  const [error, setError] = React.useState<Error>(null);
  const [fetching, setFetching] = React.useState(true);

  const refetch = React.useCallback(
    (refetch = true) => {
      if (!repo) {
        return;
      }
      setFetching(true);
      getUserscripts(repo, refetch)
        .then(setUserscripts)
        .catch(setError)
        .finally(() => setFetching(false));
    },
    [repo]
  );

  React.useEffect(() => void refetch(false), [refetch]);

  return { userscripts, refetch, fetching, error };
};
