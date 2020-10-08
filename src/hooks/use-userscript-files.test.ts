import { renderHook, act } from "@testing-library/react-hooks";

import { useUserScriptFiles } from "./use-userscript-files";

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

jest.mock("../utils/git-repo", () => ({
  GitRepo: jest.fn().mockImplementation(() => ({
    clone: jest.fn().mockResolvedValue(null),
    fetch: jest.fn().mockResolvedValue(null),
    readdir: jest.fn().mockResolvedValue(mockDir),
    readFile: jest.fn().mockResolvedValue(mockFile),
  })),
}));

const userScript = {
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
    const { result, waitForNextUpdate } = renderHook(() =>
      useUserScriptFiles("")
    );

    await waitForNextUpdate();

    expect(result.current.userScripts).toEqual([userScript]);
    expect(typeof result.current.refetch).toBe("function");
    expect(result.current.fetching).toBe(false);
    expect(result.current.error).toBe(null);
  });
});
