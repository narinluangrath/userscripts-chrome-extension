module.exports = jest.fn().mockImplementation(() => ({
  promises: {
    readdir: jest.fn().mockResolvedValue(),
    readFile: jest.fn().mockResolvedValue(),
  },
}));
