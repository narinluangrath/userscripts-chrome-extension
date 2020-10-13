import { Userscript } from "../types";

export const getTestUserscript = (id = 1): Userscript => ({
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

export const getTestUserscripts = (n = 10): Userscript[] =>
  Array(n)
    .fill(null)
    .map((_, i) => getTestUserscript(i));
