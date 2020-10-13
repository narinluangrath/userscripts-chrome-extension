import { MatchPattern } from "./match-pattern";
import { Userscript } from "../types";

export const filterUserscripts = (
  userscripts: Userscript[],
  url: string
): Userscript[] => {
  if (!(userscripts && url)) {
    return null;
  }

  return userscripts.filter((userscript) => {
    const matchPatternStr = userscript.metadata.match;
    if (!matchPatternStr) {
      return false;
    }

    const matchPattern = new MatchPattern(matchPatternStr);
    return matchPattern.isMatch(url);
  });
};
