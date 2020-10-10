import React from "react";
import ReactDOM from "react-dom";

import { REPO_KEY } from "./constants";
import { filterUserScripts } from "./utils";
import { UserScript } from "./types";
import { useUserScriptFiles, useGetStorage } from "./hooks";
import { Popup } from "./popup";

const Wrapper: React.FC = () => {
  const [userScripts, setUserScript] = React.useState<UserScript[]>([]);
  const { data: repo, fetching: repoFetching } = useGetStorage(REPO_KEY);
  const { userScripts: allUserScripts, fetching, error } = useUserScriptFiles(
    repo
  );

  React.useEffect(() => {
    if (fetching || error) {
      return;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      const { url } = tab;
      const filtered = filterUserScripts(allUserScripts, url);
      setUserScript(filtered);
    });
  }, [allUserScripts, fetching, error]);

  if (error) {
    return <p>{JSON.stringify(error, null, 2)}</p>;
  }

  if (repoFetching || fetching) {
    return <p>Fetching...</p>;
  }

  return <Popup userScripts={userScripts} />;
};

ReactDOM.render(<Wrapper />, document.getElementById("root"));
