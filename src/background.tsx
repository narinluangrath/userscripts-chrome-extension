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

  if (us.filename.endsWith(".js")) {
    chrome.tabs.executeScript(tabId, { code, runAt });
  } else if (us.filename.endsWith(".css")) {
    chrome.tabs.insertCSS(tabId, { code, runAt });
  }
};

const Wrapper: React.FC = () => {
  const { state: repo } = useChromeStorage<string>(REPO_KEY);
  const { userscripts } = useUserscriptFiles(repo);
  const { isEnabled } = useUserscriptState();

  React.useEffect(() => {
    // https://stackoverflow.com/questions/36808309/chrome-extension-page-update-twice-then-removed-on-youtube/36818991#36818991
    const handleCompleted = (details) => {
      const { tabId, url, frameId } = details;
      // https://developer.chrome.com/extensions/webNavigation#frame_ids
      if (!(tabId && url && frameId === 0)) {
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
