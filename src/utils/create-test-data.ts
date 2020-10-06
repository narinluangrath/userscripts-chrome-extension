import { UserScript } from "../types";

export const getTestUserScript = (id = 1): UserScript => ({
  id: id.toString(),
  filename: "filename.js",
  script: "() => {}",
  metadata: {
    name: `script-${id}`,
    description: "description",
    match: "https://*.google.com/foo*bar",
    version: "1.0.0",
    "run-at": "document-end",
  },
});

export const getTestUserScripts = (n = 10): UserScript[] =>
  Array(n)
    .fill(null)
    .map((_, i) => getTestUserScript(i));
