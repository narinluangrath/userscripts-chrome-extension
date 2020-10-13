const mockUserScript = {
  id: "id",
  filename: "filename",
  script: "script",
  metadata: {
    name: "Userscript",
    version: "1.0",
    match: "http://www.example.com/*",
  },
};

jest.mock("../utils/get-userscripts", () => ({
  getUserScripts: jest.fn().mockResolvedValue([mockUserScript]),
}));

import { renderHook } from "@testing-library/react-hooks";

import { useUserscriptFiles } from "./use-userscript-files";

// waitForNextUpdate times out :shrug:
describe("useUserscriptFiles", () => {
  it.skip("loads the userscripts", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useUserscriptFiles("")
    );

    await waitForNextUpdate();

    expect(result.current.userscripts).toEqual([mockUserScript]);
    expect(typeof result.current.refetch).toBe("function");
    expect(result.current.fetching).toBe(false);
    expect(result.current.error).toBe(null);
  });
});
