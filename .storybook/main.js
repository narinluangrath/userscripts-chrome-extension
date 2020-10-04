module.exports = {
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-actions",
    "@storybook/preset-scss",
  ],
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx)"],
};
