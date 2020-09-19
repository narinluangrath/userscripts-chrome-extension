import React from "react";

import { GitRepo } from "./utils";
import {
  ICON_CLICK,
  GIT_REPO_URL_KEY,
  GIT_REPO_USER_SCRIPTS_PATH,
} from "./constants";

export function useIsPopupOpen() {
  const [isOpen, setIsOpen] = React.useState(true);
  React.useEffect(() => {
    const handleMessage = (request, sender) => {
      const isIconClick = !sender.tab && request.type === ICON_CLICK;
      isIconClick && setIsOpen((b) => !b);
    };
    chrome.runtime.onMessage.addListener(handleMessage);
  }, []);

  return isOpen;
}

export function useGitRepoUrl() {
  const [error, setError] = React.useState<object>(null);
  const [fetching, setFetching] = React.useState<boolean>(true);
  const [repoUrl, _setRepoUrl] = React.useState<string>(null);

  React.useEffect(() => {
    chrome.storage.local.get({ GIT_REPO_URL_KEY }, (res) => {
      const e = chrome.runtime.lastError;
      if (e) {
        setError(e);
      } else {
        _setRepoUrl(res.GIT_REPO_URL_KEY);
      }
      setFetching(false);
    });
  }, []);

  const setRepoUrl = React.useCallback((repoUrl: string) => {
    setFetching(true);
    chrome.storage.local.set({ GIT_REPO_URL_KEY }, () => {
      const e = chrome.runtime.lastError;
      if (e) {
        setError(e);
      } else {
        setRepoUrl(repoUrl);
      }
      setFetching(false);
    });
  }, []);

  return {
    error,
    fetching,
    repoUrl,
    setRepoUrl,
  };
}

export function useGitUserScripts() {
  const [fetching, setFetching] = React.useState<boolean>(true);
  const [error, setError] = React.useState<Error>(null);
  const [paths, setPaths] = React.useState<string[]>(null);
  const [scripts, setScripts] = React.useState<string[]>(null);
  const gitRepoUrl = useGitRepoUrl();
  const repo = new GitRepo(gitRepoUrl.repoUrl);

  React.useEffect(() => {
    setFetching(true);
    repo
      .clone()
      .then(() => repo.readdir(GIT_REPO_USER_SCRIPTS_PATH))
      .then((files) =>
        files.map((file) => `${GIT_REPO_USER_SCRIPTS_PATH}/${file}`)
      )
      .then((_paths) => {
        setPaths(_paths);
        return _paths;
      })
      .then((_paths) => Promise.all(_paths.map((p) => repo.readFile(p))))
      .then((_scripts) => setScripts(_scripts))
      .catch((e) => setError(e))
      .finally(() => setFetching(false));
  }, [repo]);

  return {
    fetching,
    error,
    paths,
    scripts,
  };
}
