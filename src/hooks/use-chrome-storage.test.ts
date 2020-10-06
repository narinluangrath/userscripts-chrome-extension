import { renderHook, act } from "@testing-library/react-hooks";

import { useGetStorage, useSetStorage } from "./use-chrome-storage";

const key = "key";
const value = "value";

const chr = {
  storage: {
    sync: {
      get: (key, cb) => cb({ [key]: value }),
      set: (obj, cb) => cb(),
    },
  },
} as typeof chrome;

describe("useGetStorage", () => {
  it("gets the stored value", () => {
    const { result } = renderHook(() => useGetStorage(key, chr));
    expect(result.current.fetching).toBe(false);
    expect(result.current.data).toBe(value);
  });
});

describe("useSetStorage", () => {
  it("sets the stored value", () => {
    const { result } = renderHook(() => useSetStorage(chr));
    act(() => result.current.setStorage(key, value));
  });
});
