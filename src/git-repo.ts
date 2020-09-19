/**
 * A browser implementation of a file system + git repo
 *
 * Relevent docs:
 * - https://isomorphic-git.org/docs/en/clone
 * - https://github.com/isomorphic-git/lightning-fs/blob/main/README.md
 */

import { clone as _clone, log as _log, fetch as _fetch } from "isomorphic-git";
import http from "isomorphic-git/http/web";
import FS from "@isomorphic-git/lightning-fs";

import { ReadCommitResult } from "./types";

export class GitRepo {
  url: string;
  fs: FS;
  isCloned: boolean;
  lastFetched: Date | null;
  private _dir: string;
  private _remote: string;
  private _corsProxy: string;

  constructor(url: string) {
    this.url = url;
    this.fs = new FS(url);
    this.isCloned = false;
    this.lastFetched = null;
    this._dir = "/";
    this._remote = "script-runner";
    this._corsProxy = "https://cors.isomorphic-git.org";
  }

  _getDefaultParams() {
    return {
      http,
      /** isomorphic-git doesn't like .git suffix */
      url: this.url.replace(/\.git$/, ""),
      dir: this._dir,
      fs: this.fs,
      remote: this._remote,
      corsProxy: this._corsProxy,
    };
  }

  clone(opts?: object): Promise<void> {
    return _clone({ ...this._getDefaultParams(), ...opts }).then(() => {
      this.isCloned = true;
      this.lastFetched = new Date();
    });
  }

  log(opts?: object): Promise<Array<ReadCommitResult>> {
    const { fs, dir } = this._getDefaultParams();
    return _log({
      fs,
      dir,
      ...opts,
    });
  }

  fetch(opts?: object): Promise<void> {
    return _fetch({
      ...this._getDefaultParams(),
      ...opts,
    }).then(() => {
      this.lastFetched = new Date();
    });
  }

  getHead(): Promise<ReadCommitResult> {
    if (!this.isCloned) {
      // https://www.youtube.com/watch?v=ap3hwt-BcyM
      return Promise.reject("Must execute .clone() first");
    }
    return this.log({ depth: 1 }).then((res) => res[0]);
  }

  /**
   * Returns a promise that resolves to a sting array
   */
  readdir(dir: string, opts?): Promise<string[]> {
    return this.fs.promises.readdir(dir, opts);
  }

  /**
   * Returns a promise that resolves to a string.
   */
  readFile(file: string, opts?): Promise<string> {
    return this.fs.promises.readFile(file, { encoding: "utf8", ...opts });
  }
}
