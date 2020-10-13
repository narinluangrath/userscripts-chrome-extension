/**
 * A browser implementation of a file system + git repo
 *
 * Relevent docs:
 * - https://isomorphic-git.org/docs/en/clone
 * - https://github.com/isomorphic-git/lightning-fs/blob/main/README.md
 */

import {
  clone as _clone,
  log as _log,
  fetch as _fetch,
  fastForward as _fastForward,
} from "isomorphic-git";
import http from "isomorphic-git/http/web";
import FS from "@isomorphic-git/lightning-fs";

import { ReadCommitResult } from "../types";

interface DefaultParams {
  http: typeof http;
  url: string;
  dir: string;
  fs: FS;
  remote: string;
  corsProxy: string;
}

export class GitRepo {
  url: string;
  fs: FS;
  lastFetched: Date | null;
  private _dir: string;
  private _remote: string;
  private _corsProxy: string;

  constructor(url: string, fsOps?: Record<string, unknown>) {
    this.url = url;
    this.fs = new FS(url, fsOps);
    this.lastFetched = null;
    this._dir = "/";
    this._remote = "origin";
    this._corsProxy = "https://cors.isomorphic-git.org";
  }

  get _getDefaultParams(): DefaultParams {
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

  clone(opts?: Record<string, unknown>): Promise<void> {
    return _clone({ ...this._getDefaultParams, ...opts }).then(() => {
      this.lastFetched = new Date();
    });
  }

  fetch(opts?: Record<string, unknown>): Promise<void> {
    return _fetch({
      ...this._getDefaultParams,
      ...opts,
    }).then(() => {
      this.lastFetched = new Date();
    });
  }

  pull(opts?: Record<string, unknown>): Promise<void> {
    return _fastForward({
      ...this._getDefaultParams,
      ...opts,
    });
  }

  log(opts?: Record<string, unknown>): Promise<Array<ReadCommitResult>> {
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
  readdir(dir: string, opts?: Record<string, unknown>): Promise<string[]> {
    return this.fs.promises.readdir(dir, opts);
  }

  /**
   * Returns a promise that resolves to a string.
   */
  readFile(file: string, opts?: Record<string, unknown>): Promise<string> {
    return this.fs.promises.readFile(file, { encoding: "utf8", ...opts });
  }
}
