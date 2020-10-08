import React from "react";
import userscriptMeta from "userscript-meta";

import { GitRepo } from "../utils";
import { UserScript } from "../types";
import { SCRIPTS_PATH } from "../constants";

const getMetadata = (file: string): string | null => {
  const regexp = /==UserScript==.*==\/UserScript==/gs;
  const match = file.match(regexp);
  return match && match[0];
};

const parseFile = (file: string, filename: string): UserScript => ({
  filename,
  id: filename,
  script: file,
  metadata: userscriptMeta.parse(getMetadata(file)),
});

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
    let filenames; // Temp variable to store filenames
    setFetching(true);
    const gitRepo = new GitRepo(repo);
    gitRepo
      .clone()
      .then(() => gitRepo.fetch())
      .then(() => gitRepo.readdir(SCRIPTS_PATH))
      .then((fls) => {
        filenames = fls;
        const fullPaths = fls.map((p) => `${SCRIPTS_PATH}/${p}`);
        return Promise.all(fullPaths.map(gitRepo.readFile));
      })
      .then((files) => files.map((f, i) => parseFile(f, filenames[i])))
      .then(setUserScripts)
      .catch(setError)
      .finally(() => setFetching(false));
  }, [repo, setUserScripts]);
  React.useEffect(refetch, [refetch]);

  return { userScripts, refetch, fetching, error };
};
