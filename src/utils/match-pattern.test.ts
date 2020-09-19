import { MatchPattern } from "./match-pattern";

const patterns = [
  ["http://*/*", "http://www.google.com/", true],
  ["http://*/foo*", "http://example.com/foo/bar.html", true],
  ["https://*.google.com/foo*bar", "https://www.google.com/foo/baz/bar", true],
  ["http://example.org/foo/bar.html", "http://example.org/foo/bar.html", true],
  ["file:///foo*", "file:///foo/bar.html", true],
  ["http://127.0.0.1/*", "http://127.0.0.1/", true],
  ["*://mail.google.com/*", "http://mail.google.com/foo/baz/bar", true],
  ["<all_urls>", "http://example.org/foo/bar.html", true],
  ["http://*/*", "https://www.google.com/", false],
  ["http://*/foo*", "http://example.com/bar/bar.html", false],
  ["https://*.google.com/foo*bar", "https://www.foo.com/foo/baz/bar", false],
  ["http://example.org/foo/bar.html", "http://example.org/foo/bar.xml", false],
  ["file:///foo*", "file:///bar/bar.html", false],
  ["http://127.0.0.1/*", "http://127.0.0.2/", false],
  ["*://mail.google.com/*", "http://mail.google.co.uk/foo/baz/bar", false],
];

const badPatterns = [
  "http://www.google.com",
  "http://*foo/bar",
  "http://foo.*.bar/baz",
  "http:/bar",
  "foo://*",
];

describe("MatchPattern", () => {
  it.each(patterns)("%s: isMatch(%s) is %s", (pattern, url, isMatch) => {
    const matchPattern = new MatchPattern(pattern as string);
    expect(matchPattern.isMatch(url as string)).toBe(isMatch as boolean);
  });
  it.each(badPatterns)("Throws on bad pattern %s", (pattern) => {
    expect(() => new MatchPattern(pattern as string)).toThrow();
  });
});
