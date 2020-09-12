/**
 * Implements Match Pattners (URL matching)
 *
 * https://developer.chrome.com/extensions/match_patterns
 */

interface MatchPatternParts {
  scheme: string;
  /** If the scheme is file, there is no host part */
  host?: string;
  path: string;
}

export class MatchPattern {
  allUrls: boolean | null;
  scheme: string | null;
  host: string | null;
  path: string | null;

  static parseParts(matchPatternStr: string): MatchPatternParts {
    /**
     * When using the contructor function (e.g. new RegExp("foo"))
     * instead of the literal notation (e.g. /foo/) use two slashes 
     * to escape a character instead of one.
     * https://stackoverflow.com/a/17863171
     */
    const scheme = "(?<scheme>\\*|http|https|file|ftp)";
    /** File URLs do not have hosts */
    const isFile = matchPatternStr.startsWith("file");
    const host = isFile ? "" : "(?<host>\\*|\\*\\.[^\\/\\*]+|[^\\/\\*]+)";
    const path = "(?<path>\\/.*)";
    const urlPattern = new RegExp(`^${scheme}:\\/\\/${host}${path}$`);
    const match = matchPatternStr.match(urlPattern);

    if (!match) {
      throw Error("Invalid match pattern string");
    }

    /** TS can't parse capture groups apparently */
    return match.groups as unknown as MatchPatternParts;
  }

  constructor(matchPatternStr: string) {
    if (matchPatternStr === "<all_urls>") {
      this.allUrls = true;
    } else {
      const { scheme, host, path } = MatchPattern.parseParts(matchPatternStr);
      this.scheme = scheme;
      this.host = host;
      this.path = path;
    }
  }

  /**
   * Returns true if the given `url` matches our match pattern
   */
  isMatch(url) {
    if (this.allUrls) {
      return true;
    }

    const { protocol, host, pathname } = new URL(url);

    /** Check protocol, host, pathname */
    if (this.scheme !== "*" && `${this.scheme}:` !== protocol) {
      return false;
    }
    const hostAsRegExp = this.host && new RegExp(this.host.replace("*", ".*"));
    if (hostAsRegExp && !hostAsRegExp.test(host)) {
      return false;
    }
    const pathAsRegExp = new RegExp(this.path.replace("*", ".*"));
    if (!pathAsRegExp.test(pathname)) {
      return false;
    }

    return true;
  }
}
