import React from "react";

import { DISABLED_KEY } from "../constants";
import { Userscript } from "../types";
import { useChromeStorage } from "./use-chrome-storage";

interface UserscriptState {
  setEnabled(us: Userscript, enabled: boolean): void;
  toggleEnabled(us: Userscript): void;
  isEnabled(us: Userscript): boolean;
  fetching: boolean;
  error: string | null;
}

export const useUserscriptState = (): UserscriptState => {
  const { state, setState: setDisabledIds, fetching, error } = useChromeStorage<
    string[]
  >(DISABLED_KEY);
  const disabledIds = state || [];

  const isEnabled = React.useCallback(
    (us) => {
      const id = us?.id;
      // Assume scripts are enabled by default
      if (!disabledIds.length) {
        return true;
      }
      return !disabledIds.includes(id);
    },
    [disabledIds]
  );

  const setEnabled = React.useCallback(
    (us, enabled) => {
      const id = us?.id;
      if (enabled && !isEnabled(us)) {
        setDisabledIds(disabledIds.filter((_id) => _id !== id));
      } else if (!enabled && isEnabled(us)) {
        setDisabledIds([...disabledIds, id]);
      }
    },
    [disabledIds, isEnabled, setDisabledIds]
  );

  const toggleEnabled = React.useCallback(
    (us) => setEnabled(us, !isEnabled(us)),
    [setEnabled, isEnabled]
  );

  return {
    isEnabled,
    setEnabled,
    toggleEnabled,
    fetching,
    error,
  };
};
