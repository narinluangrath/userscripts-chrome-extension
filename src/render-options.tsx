import React from "react";
import ReactDOM from "react-dom";

import {
  useChromeStorage,
  useUserscriptFiles,
  useUserscriptState,
} from "./hooks";
import { REPO_KEY } from "./constants";
import { Userscript } from "./types";
import { Options, OptionsProps } from "./Options";

const useOptionsState = (): OptionsProps => {
  const {
    state: repoUrl,
    setState: setRepoUrl,
    fetching: repoUrlFetching,
    error: repoUrlError,
  } = useChromeStorage<string>(REPO_KEY);
  const {
    userscripts,
    refetch: userscriptsRefetch,
    fetching: userscriptsFetching,
    error: userscriptsError,
  } = useUserscriptFiles(repoUrl);
  const { isEnabled, toggleEnabled, fetching, error } = useUserscriptState();
  const [openUserscript, setOpenUserscript] = React.useState<Userscript>();

  return {
    setRepoUrl,
    repoUrl,
    repoUrlFetching,
    userscripts,
    userscriptsRefetch,
    userscriptsFetching,
    userscriptsError,
    openUserscript,
    onUserscriptClick: setOpenUserscript,
    isOpenUserscriptEnabled: isEnabled(openUserscript),
    toggleOpenUserscriptEnabled: () => toggleEnabled(openUserscript),
  };
};

const Wrapper = () => {
  const props = useOptionsState();
  return <Options {...props} />;
};

ReactDOM.render(<Wrapper />, document.getElementById("root"));
