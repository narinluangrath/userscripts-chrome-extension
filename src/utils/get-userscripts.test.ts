import { getUserscripts } from "./get-userscripts";

const mockPull = jest.fn().mockResolvedValue(null);
const mockIsCloned = jest.fn().mockResolvedValue(false);
const mockClone = jest.fn().mockResolvedValue(null);
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
    pull: mockPull,
    isCloned: mockIsCloned,
    clone: mockClone,
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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads the userscripts", async () => {
    const result = await getUserscripts("");
    expect(result).toEqual([userscript]);
  });

  it("calls clone() only if necessary", async () => {
    mockIsCloned.mockResolvedValue(false);
    await getUserscripts("");
    expect(mockClone).toHaveBeenCalled();

    mockClone.mockClear();
    mockIsCloned.mockResolvedValue(true);
    await getUserscripts("");
    expect(mockClone).not.toHaveBeenCalled();
  });

  it("calls pull() only if necessary", async () => {
    await getUserscripts("", false);
    expect(mockPull).not.toHaveBeenCalled();

    await getUserscripts("", true);
    expect(mockPull).toHaveBeenCalled();
  });
});
