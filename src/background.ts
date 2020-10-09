import { REPO_KEY } from "./constants";
import { UserScript } from "./types";
import { getUserScripts, filterUserScripts } from "./utils";

const runUserScript = (us: UserScript, tabId: number): void => {
  const code = us.script;
  const runAt = us.metadata["run-at"] || "document_idle";
  chrome.tabs.executeScript(tabId, { code, runAt });
};

chrome.tabs.onCreated.addListener((tab) => {
  const { id, url } = tab;
  if (!(id && url)) {
    return;
  }

  chrome.storage.sync.get([REPO_KEY], (result) => {
    const repo = result[REPO_KEY];
    if (!repo) {
      return;
    }

    getUserScripts(repo)
      .then((userScripts) => filterUserScripts(userScripts, url))
      .then((userScripts) =>
        userScripts.forEach((us) => runUserScript(us, id))
      );
  });
});
