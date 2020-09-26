/// <reference types="cypress" />

import { GitRepo } from "../../src/utils";

const repoURL =
  "https://github.com/narinluangrath/userscripts-chrome-extension.git";

describe("GitRepo", () => {
  it("can clone git repo", async () => {
    const gr = new GitRepo(repoURL);
    await gr.clone();
    const head = await gr.getHead();
    expect(head).to.be.a("string");
    expect(true).to.equal(true);
  });
});
