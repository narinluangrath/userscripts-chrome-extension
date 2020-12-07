import React from "react";
import ReactDOM from "react-dom";
import { REPO_KEY } from "./constants";
import { Userscript } from "./types";
import {
  useChromeStorage,
  useUserscriptFiles,
  useUserscriptState,
} from "./hooks";
import { filterUserscripts } from "./utils";

const runUserscript = (us: Userscript, tabId: number): void => {
  const code = us.script;
  const runAt = us.metadata["run-at"] || "document_idle";
  chrome.tabs.executeScript(tabId, { code, runAt });
};

const Wrapper: React.FC = () => {
  const { state: repo } = useChromeStorage<string>(REPO_KEY);
  const { userscripts } = useUserscriptFiles(repo);
  const { isEnabled } = useUserscriptState();

  React.useEffect(() => {
    // https://stackoverflow.com/questions/36808309/chrome-extension-page-update-twice-then-removed-on-youtube/36818991#36818991
    const handleCompleted = (details) => {
      const { tabId, url } = details;
      if (!(tabId && url)) {
        return;
      }
      let filtered = filterUserscripts(userscripts, url) || [];
      filtered = filtered.filter(isEnabled);
      filtered.forEach((us) => runUserscript(us, tabId));
    };
    chrome.webNavigation.onCompleted.addListener(handleCompleted);
    return () =>
      chrome.webNavigation.onCompleted.removeListener(handleCompleted);
  }, [userscripts, isEnabled]);

  return null;
};

ReactDOM.render(<Wrapper />, document.getElementById("root"));
