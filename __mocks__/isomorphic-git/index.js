const mockCommitObject = {
  message: "message",
  tree: "tree",
  parent: ["parent"],
  author: {
    name: "name",
    email: "email",
    timestamp: 1,
    timezoneOffset: 1,
  },
  committer: {
    name: "name",
    email: "email",
    timestamp: 1,
    timezoneOffset: 1,
  },
  gpgsig: "gpgsig",
};

const mockReadCommitResult = {
  oid: "oid",
  commit: mockCommitObject,
  payload: "payload",
};

exports.mockCommitObject = mockCommitObject;
exports.mockReadCommitResult = mockReadCommitResult;
exports.clone = jest.fn().mockResolvedValue(null);
exports.log = jest.fn().mockResolvedValue([mockReadCommitResult]);
exports.fetch = jest.fn().mockResolvedValue(null);
