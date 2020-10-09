import userscriptMeta from "userscript-meta";

import { SCRIPTS_PATH } from "../constants";
import { GitRepo } from "../utils";
import { UserScript } from "../types";

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

export const getUserScripts = (repo: string): Promise<UserScript[]> => {
  let filenames; // Temp variable to store filenames
  const gitRepo = new GitRepo(repo);
  return gitRepo
    .clone()
    .then(() => gitRepo.fetch())
    .then(() => gitRepo.readdir(SCRIPTS_PATH))
    .then((fls) => {
      filenames = fls;
      const fullPaths = fls.map((p) => `${SCRIPTS_PATH}/${p}`);
      return Promise.all(fullPaths.map(gitRepo.readFile));
    })
    .then((files) => files.map((f, i) => parseFile(f, filenames[i])));
};
