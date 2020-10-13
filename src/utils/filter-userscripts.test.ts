import { UserScript } from "../types";
import { filterUserScripts } from "./filter-userscripts";

const getUserScript = (id: string, match: string): UserScript => ({
  id,
  filename: "filename.js",
  script: "() => {}",
  metadata: {
    match,
    name: "name",
    description: "description",
    version: "1.0.0",
    "run-at": "document-end",
  },
});

describe("filterUserScripts", () => {
  it("returns the userscripts that match the url", () => {
    const url = "https://www.google.com/foo/baz/bar";
    const us0 = getUserScript("0", "http://*/foo*"); // wrong scheme
    const us1 = getUserScript("1", "https://*.google.com/foo*bar");
    const us2 = getUserScript("2", "*://mail.google.com/*"); // wrong host
    expect(filterUserScripts([us0, us1, us2], url)).toEqual([us1]);
  });
});
