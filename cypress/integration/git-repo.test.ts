/// <reference types="cypress" />

import { GitRepo } from "../../src/utils";

const repoURL =
  "https://github.com/narinluangrath/userscripts-chrome-extension";

// @ts-ignore
describe("GitRepo", { timeout: 10000 }, () => {
  it(".isCloned() returns true after cloning", async () => {
    const gr = new GitRepo(repoURL, { wipe: true });
    const before = await gr.isCloned();
    expect(before).to.be.false;
    await gr.clone();
    const after = await gr.isCloned();
    expect(after).to.be.true;
  });

  it("can clone git repo", async () => {
    const gr = new GitRepo(repoURL, { wipe: true });
    await gr.clone();
    const head = await gr.getHead();
    expect(head.oid).to.be.a("string");
  });

  it("can read the git log", async () => {
    const gr = new GitRepo(repoURL, { wipe: true });
    await gr.clone();
    const log = await gr.log();
    expect(log.length).to.be.above(0);
  });

  it("can read the cloned directories", async () => {
    const gr = new GitRepo(repoURL, { wipe: true });
    await gr.clone();
    const dir = await gr.readdir("/");
    expect(dir.length).to.be.above(0);
  });

  it("can read the cloned files", async () => {
    const gr = new GitRepo(repoURL, { wipe: true });
    await gr.clone();
    const file = await gr.readFile("/package.json");
    expect(file).to.be.a("string");
  });

  it(".fetch() sets .lastFetched", async () => {
    const gr = new GitRepo(repoURL, { wipe: true });
    expect(gr.lastFetched).to.be.null;
    await gr.clone();
    await gr.fetch();
    expect(gr.lastFetched).to.be.instanceof(Date);
  });
});
