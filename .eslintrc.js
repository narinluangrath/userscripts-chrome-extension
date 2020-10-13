module.exports = {
  env: {
    browser: true,
    es2020: true,
    webextensions: true,
  },
  extends: [
    "eslint-config-prettier",
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  plugins: ["react", "@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 5,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
      classes: true,
      defaultParams: true,
    },
  },
  rules: {
    indent: ["error", 2],
    "linebreak-style": ["error", "unix"],
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
