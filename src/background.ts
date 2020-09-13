/**
 * Runs when:
 * - The extension is installed/updated
 * - An event is dispatched
 * - A content script sends a message
 * - Popup calls runtime.getBackgroundPage
 *
 * https://developer.chrome.com/extensions/background_pages
 */

import { GitRepo } from "./git-repo";

const repo = new GitRepo("https://github.com/narinluangrath/victory-gui");

repo
  .clone()
  .then(() => repo.readFile("/dist/main.js"))
  .then(console.log)
  .catch(console.error);
