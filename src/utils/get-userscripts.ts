import userscriptMeta from "userscript-meta";

import { SCRIPTS_PATH } from "../constants";
import { GitRepo } from "../utils";
import { Userscript, SupportedMetadata } from "../types";

const getMetadata = (file: string): SupportedMetadata => {
  const regexp = /==UserScript==.*==\/UserScript==/gs;
  const match = file.match(regexp) && file.match(regexp)[0];
  if (!match) {
    throw Error("No metadata found in file");
  }
  return userscriptMeta.parse(match);
};

const parseFile = (file: string, filename: string): Userscript => ({
  filename,
  id: filename,
  script: file,
  metadata: getMetadata(file),
});

export const getUserscripts = (repo: string): Promise<Userscript[]> => {
  let filenames; // Temp variable to store filenames
  const gitRepo = new GitRepo(repo);
  return gitRepo
    .clone()
    .then(() => gitRepo.fetch())
    .then(() => gitRepo.pull())
    .then(() => gitRepo.readdir(SCRIPTS_PATH))
    .then((fls) => {
      filenames = fls;
      const fullPaths = fls.map((p) => `${SCRIPTS_PATH}/${p}`);
      return Promise.all(fullPaths.map((p) => gitRepo.readFile(p)));
    })
    .then((files) => files.map((f, i) => parseFile(f, filenames[i])));
};
