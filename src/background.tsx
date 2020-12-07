import React from "react";
import ReactDOM from "react-dom";
import { REPO_KEY, DISABLED_KEY } from "./constants";
import { Userscript } from "./types";
import { useChromeStorage, useUserscriptFiles } from "./hooks";
import { filterUserscripts } from "./utils";

const runUserscript = (us: Userscript, tabId: number): void => {
  const code = us.script;
  const runAt = us.metadata["run-at"] || "document_idle";
  chrome.tabs.executeScript(tabId, { code, runAt });
};

const Wrapper: React.FC = () => {
  const { state: repo } = useChromeStorage(REPO_KEY);
  const { userscripts } = useUserscriptFiles(repo);

  React.useEffect(() => {
    // https://stackoverflow.com/questions/36808309/chrome-extension-page-update-twice-then-removed-on-youtube/36818991#36818991
    const handleCompleted = (details) => {
      const { tabId, url } = details;
      if (!(tabId && url)) {
        return;
      }
      const filtered = filterUserscripts(userscripts, url) || [];
      filtered.forEach((us) => runUserscript(us, tabId));
    };
    chrome.webNavigation.onCompleted.addListener(handleCompleted);
    () => chrome.webNavigation.onCompleted.removeListener(handleCompleted);
  }, [userscripts]);

  return null;
};

ReactDOM.render(<Wrapper />, document.getElementById("root"));