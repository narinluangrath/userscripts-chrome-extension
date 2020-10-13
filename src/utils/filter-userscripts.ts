import { MatchPattern } from "./match-pattern";
import { UserScript } from "../types";

export const filterUserScripts = (
  userScripts: UserScript[],
  url: string
): UserScript[] => {
  if (!(userScripts && url)) {
    return null;
  }

  return userScripts.filter((userScript) => {
    const matchPatternStr = userScript.metadata.match;
    if (!matchPatternStr) {
      return false;
    }

    const matchPattern = new MatchPattern(matchPatternStr);
    return matchPattern.isMatch(url);
  });
};
