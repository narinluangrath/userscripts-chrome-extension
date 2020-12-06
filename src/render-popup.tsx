import React from "react";
import ReactDOM from "react-dom";

import { REPO_KEY } from "./constants";
import { filterUserscripts } from "./utils";
import { Userscript } from "./types";
import { useUserscriptFiles, useChromeStorage } from "./hooks";
import { Popup } from "./popup";

const Wrapper: React.FC = () => {
  const [userscripts, setUserscript] = React.useState<Userscript[]>([]);
  const { state: repo, fetching: repoFetching } = useChromeStorage<string>(
    REPO_KEY
  );
  const { userscripts: allUserscripts, fetching, error } = useUserscriptFiles(
    repo
  );

  React.useEffect(() => {
    if (fetching || error) {
      return;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      const { url } = tab;
      const filtered = filterUserscripts(allUserscripts, url);
      setUserscript(filtered);
    });
  }, [allUserscripts, fetching, error]);

  if (error) {
    return <p>{JSON.stringify(error, null, 2)}</p>;
  }

  if (repoFetching || fetching) {
    return <p>Fetching...</p>;
  }

  return (
    <Popup
      // @TODO
      fetching={false}
      isUserscriptEnabled={() => false}
      toggleUserscript={() => {}}
      onSettingsClick={() => {}}
      userscripts={userscripts}
    />
  );
};

ReactDOM.render(<Wrapper />, document.getElementById("root"));
