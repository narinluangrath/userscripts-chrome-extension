import React from "react";

import { getUserScripts } from "../utils";
import { UserScript } from "../types";

interface UserScriptFiles {
  userScripts: UserScript[];
  refetch: () => void;
  fetching: boolean;
  error: Error | null;
}

export const useUserScriptFiles = (repo: string): UserScriptFiles => {
  const [userScripts, setUserScripts] = React.useState<UserScript[]>([]);
  const [error, setError] = React.useState<Error>(null);
  const [fetching, setFetching] = React.useState(true);

  const refetch = React.useCallback(() => {
    if (!repo) {
      return;
    }
    setFetching(true);
    getUserScripts(repo)
      .then(setUserScripts)
      .catch(setError)
      .finally(() => setFetching(false));
  }, [repo]);
  React.useEffect(refetch, [refetch]);

  return { userScripts, refetch, fetching, error };
};
