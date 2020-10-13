// https://isomorphic-git.org/docs/en/log
export type CommitObject = {
  message: string;
  tree: string;
  parent: Array<string>;
  author: {
    name: string;
    email: string;
    timestamp: number;
    timezoneOffset: number;
  };
  committer: {
    name: string;
    email: string;
    timestamp: number;
    timezoneOffset: number;
  };
  gpgsig?: string;
};

export type ReadCommitResult = {
  oid: string;
  commit: CommitObject;
  payload: string;
};

// https://wiki.greasespot.net/Metadata_Block
export type SupportedMetadata = {
  description?: string;
  match?: string;
  name?: string;
  "run-at"?: "document-end" | "document-start" | "document-idle";
  version?: string;
};

export type Metadata = SupportedMetadata & {
  exclude?: string | RegExp;
  grant?: string;
  icon?: string;
  include?: string | RegExp;
  namespace?: string;
  noframes?: boolean;
  require?: string;
  resource?: string;
};

export type Userscript = {
  id: string;
  filename: string;
  script: string;
  metadata: SupportedMetadata;
};
