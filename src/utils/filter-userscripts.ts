import { MatchPattern } from "./match-pattern";
import { UserScript } from "../types";
import { match } from "assert";

export const filterUserScripts = (
  userScripts: UserScript[],
  url: string
): UserScript[] => {
  return userScripts.filter((userScript) => {
    const matchPatternStr = userScript.metadata.match;
    if (!matchPatternStr) {
      return false;
    }

    const matchPattern = new MatchPattern(matchPatternStr);
    return matchPattern.isMatch(url);
  });
};
