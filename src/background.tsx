import React from "react";
import ReactDOM from "react-dom";
import { REPO_KEY, DISABLED_KEY } from "./constants";
import { Userscript } from "./types";
import { getUserscripts, filterUserscripts } from "./utils";

const runUserscript = (us: Userscript, tabId: number): void => {
  const code = us.script;
  const runAt = us.metadata["run-at"] || "document_idle";
  chrome.tabs.executeScript(tabId, { code, runAt });
};

const Wrapper: React.FC = () => {
  React.useEffect(() => {
    // https://stackoverflow.com/questions/36808309/chrome-extension-page-update-twice-then-removed-on-youtube/36818991#36818991
    chrome.webNavigation.onCompleted.addListener((details) => {
      const { tabId, url } = details;
      if (!(tabId && url)) {
        return;
      }

      chrome.storage.sync.get([REPO_KEY], (result) => {
        const repo = result[REPO_KEY];
        if (!repo) {
          return;
        }

        getUserscripts(repo)
          .then((userscripts) => filterUserscripts(userscripts, url))
          .then((userscripts) =>
            userscripts.forEach((us) => runUserscript(us, tabId))
          );
      });
    });
  }, []);

  return null;
};

ReactDOM.render(<Wrapper />, document.getElementById("root"));
