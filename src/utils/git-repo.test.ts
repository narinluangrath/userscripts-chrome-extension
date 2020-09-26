import {
  clone,
  fetch,
  mockReadCommitResult,
} from "../../__mocks__/isomorphic-git";

import { GitRepo } from "./git-repo";

const URL = "https://github.com/narinluangrath/victory-gui";

describe("GitRepo", () => {
  describe(".clone()", () => {
    it("calls git clone", async () => {
      const repo = new GitRepo(URL);
      await repo.clone();
      expect(repo.lastFetched).toBeInstanceOf(Date);
      expect(clone).toHaveBeenCalledTimes(1);
    });
    it("sets .lastFetched", async () => {
      const repo = new GitRepo(URL);
      expect(repo.lastFetched).toBe(null);
      await repo.clone();
      expect(repo.lastFetched).toBeInstanceOf(Date);
    });
  });

  describe(".fetch()", () => {
    it("calls git fetch", async () => {
      const repo = new GitRepo(URL);
      await repo.fetch();
      expect(repo.lastFetched).toBeInstanceOf(Date);
      expect(fetch).toHaveBeenCalledTimes(1);
    });
    it("sets .lastFetched", async () => {
      const repo = new GitRepo(URL);
      expect(repo.lastFetched).toBe(null);
      await repo.fetch();
      expect(repo.lastFetched).toBeInstanceOf(Date);
    });
  });

  describe(".getHead()", () => {
    // https://jestjs.io/docs/en/asynchronous#asyncawait
    it("rejects if .clone() was not called", async () => {
      const repo = new GitRepo(URL);
      try {
        await repo.getHead();
      } catch (e) {
        expect(e).toBeTruthy();
      }
    });
    it("gets the head of the log", async () => {
      const repo = new GitRepo(URL);
      await repo.clone();
      const head = await repo.getHead();
      expect(head).toEqual(mockReadCommitResult);
    });
  });
});
