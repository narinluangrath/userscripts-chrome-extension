import { getUserscripts } from "./get-userscripts";

const mockFilename = "script.js";
const mockDir = [mockFilename];
const mockFile = `
// ==UserScript==
// @name Userscript
// @version 1.0
// @match http://www.example.com/*
// ==/UserScript==

() => {};
`;

jest.mock("./git-repo", () => ({
  GitRepo: jest.fn().mockImplementation(() => ({
    clone: jest.fn().mockResolvedValue(null),
    fetch: jest.fn().mockResolvedValue(null),
    pull: jest.fn().mockResolvedValue(null),
    readdir: jest.fn().mockResolvedValue(mockDir),
    readFile: jest.fn().mockResolvedValue(mockFile),
  })),
}));

const userscript = {
  id: mockFilename,
  filename: mockFilename,
  script: mockFile,
  metadata: {
    name: "Userscript",
    version: "1.0",
    match: "http://www.example.com/*",
  },
};

describe("useUserscriptFiles", () => {
  it("loads the userscripts", async () => {
    const result = await getUserscripts("");
    expect(result).toEqual([userscript]);
  });
});
