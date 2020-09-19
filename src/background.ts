import { ICON_CLICK } from "./constants";

/**
 * The main script for the chrome extension
 * Attaches event handlers
 *
 * Relevent links:
 * https://developer.chrome.com/extensions/background_pages
 * https://developer.chrome.com/extensions/tabs#method-executeScript
 * https://developer.chrome.com/extensions/browserAction#event-onClicked
 * https://developer.mozilla.org/en-US/docs/Web/API/Document/readyState
 */

/** Run `popup.tsx` when user clicks extension icon */
chrome.browserAction.onClicked.addListener((tab) => {
  const { id } = tab;
  /**
   * Tab IDs are unique within a browser session.
   * Under some circumstances a tab may not be assigned an ID;
   * for example, when querying foreign tabs using the sessions API,
   * in which case a session ID may be present.
   */
  if (id) {
    chrome.tabs.executeScript(id, { file: "/popup.js", runAt: "document_end" });
    chrome.tabs.sendMessage(id, { type: ICON_CLICK });
  }
});
