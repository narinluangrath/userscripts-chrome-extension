import { Userscript } from "../types";
import { filterUserscripts } from "./filter-userscripts";

const getUserscript = (id: string, match: string): Userscript => ({
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

describe("filterUserscripts", () => {
  it("returns the userscripts that match the url", () => {
    const url = "https://www.google.com/foo/baz/bar";
    const us0 = getUserscript("0", "http://*/foo*"); // wrong scheme
    const us1 = getUserscript("1", "https://*.google.com/foo*bar");
    const us2 = getUserscript("2", "*://mail.google.com/*"); // wrong host
    expect(filterUserscripts([us0, us1, us2], url)).toEqual([us1]);
  });
});
