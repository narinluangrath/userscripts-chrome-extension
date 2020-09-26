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

import { ReadCommitResult } from "../types";

function toDirectoryName(s: string): string {
  const invalidChars = /[^a-zA-Z0-9]/g;
  return s.replace(invalidChars, "_");
}

export class GitRepo {
  url: string;
  fs: FS;
  lastFetched: Date | null;
  private _dir: string;
  private _remote: string;
  private _corsProxy: string;

  constructor(url: string) {
    this.url = url;
    this.fs = new FS(url);
    this.lastFetched = null;
    this._dir = toDirectoryName(url);
    this._remote = "origin";
    this._corsProxy = "https://cors.isomorphic-git.org";
  }

  get _getDefaultParams() {
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

  isCloned(): Promise<boolean> {
    return this.readdir(this._dir).then((arr) => !!(arr && arr.length));
  }

  clone(opts?: object): Promise<void> {
    return _clone({ ...this._getDefaultParams, ...opts }).then(() => {
      this.lastFetched = new Date();
    });
  }

  fetch(opts?: object): Promise<void> {
    return _fetch({
      ...this._getDefaultParams,
      ...opts,
    }).then(() => {
      this.lastFetched = new Date();
    });
  }

  log(opts?: object): Promise<Array<ReadCommitResult>> {
    const { fs, dir } = this._getDefaultParams;
    return _log({
      fs,
      dir,
      ...opts,
    });
  }

  getHead(): Promise<ReadCommitResult> {
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
