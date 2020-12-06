import React from "react";
import ReactDOM from "react-dom";

import { useChromeStorage, useUserscriptFiles } from "./hooks";
import { REPO_KEY } from "./constants";
import { Userscript } from "./types";
import { Options, OptionsProps } from "./Options";

const useOptionsState = (): OptionsProps => {
  const {
    state: repoUrl,
    setState: setRepoUrl,
    fetching: repoUrlFetching,
  } = useChromeStorage<string>(REPO_KEY);
  const {
    userscripts,
    refetch: userscriptsRefetch,
    fetching: userscriptsFetching,
    error: userscriptsError,
  } = useUserscriptFiles(repoUrl);
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
    isOpenUserscriptEnabled: true, // @TODO
    setIsOpenUserscriptEnabled: () => null, // @TODO
  };
};

const Wrapper = () => {
  const props = useOptionsState();
  return <Options {...props} />;
};

ReactDOM.render(<Wrapper />, document.getElementById("root"));
