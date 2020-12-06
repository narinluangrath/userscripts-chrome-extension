import React from "react";
import ReactDOM from "react-dom";

import { REPO_KEY } from "./constants";
import { filterUserscripts } from "./utils";
import { useUserscriptFiles, useTabUrl, useChromeStorage } from "./hooks";
import { Popup } from "./popup";

const Wrapper: React.FC = () => {
  const tabUrl = useTabUrl();
  const repoUrl = useChromeStorage<string>(REPO_KEY);
  const userscriptFiles = useUserscriptFiles(repoUrl.state);
  const filtered = filterUserscripts(userscriptFiles.userscripts, tabUrl.url);
  const fetching =
    tabUrl.fetching || repoUrl.fetching || userscriptFiles.fetching;

  return (
    <Popup
      // @TODO
      fetching={fetching}
      isUserscriptEnabled={() => false}
      toggleUserscript={() => {}}
      onSettingsClick={() => {}}
      userscripts={filtered}
    />
  );
};

ReactDOM.render(<Wrapper />, document.getElementById("root"));
