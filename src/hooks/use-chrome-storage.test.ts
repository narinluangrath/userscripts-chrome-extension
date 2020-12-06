import { renderHook, act } from "@testing-library/react-hooks";

import { useChromeStorage } from "./use-chrome-storage";

const mockKey = "key";
const mockValue = "value";

const mockChr = {
  storage: {
    sync: {
      get: (key, cb) => void cb({ [mockKey]: mockValue }),
      set: (obj, cb) => void cb(),
    },
  },
  runtime: {
    lastError: {
      message: undefined,
    },
  },
} as typeof chrome;

describe("useChromeStorage", () => {
  it("gets the stored value", () => {
    const { result } = renderHook(() => useChromeStorage(mockKey, mockChr));
    expect(result.current.error).toBe(null);
    expect(result.current.fetching).toBe(false);
    expect(result.current.state).toBe(mockValue);
  });

  it("sets the stored value", () => {
    const newMockValue = "newMockValue";
    const { result } = renderHook(() => useChromeStorage(mockKey, mockChr));
    act(() => result.current.setState(newMockValue));
    expect(result.current.error).toBe(null);
    expect(result.current.fetching).toBe(false);
    expect(result.current.state).toBe(newMockValue);
  });

  it("sets the error flag and doesn't set state", () => {
    const error = "error";
    const copyMockChr = { ...mockChr };
    copyMockChr.runtime.lastError.message = error;
    const { result } = renderHook(() => useChromeStorage(mockKey, copyMockChr));
    expect(result.current.error).toBe(error);
    expect(result.current.fetching).toBe(false);
    expect(result.current.state).toBe(null);
  });
});
