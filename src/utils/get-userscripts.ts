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

export const getUserscripts = async (
  repo: string,
  refetch?: boolean
): Promise<Userscript[]> => {
  const gitRepo = new GitRepo(repo);
  const isCloned = await gitRepo.isCloned();

  if (!isCloned) {
    await gitRepo.clone();
  }

  if (refetch) {
    await gitRepo.pull();
  }

  const filenames = await gitRepo.readdir(SCRIPTS_PATH);
  const fullPaths = filenames.map((f) => `${SCRIPTS_PATH}/${f}`);
  const files = await Promise.all(fullPaths.map((p) => gitRepo.readFile(p)));
  return files.map((f, i) => parseFile(f, filenames[i]));
};
