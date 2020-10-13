import React from "react";
import { Meta, Story } from "@storybook/react/types-6-0";
import { action } from "@storybook/addon-actions";

import { getTestUserScript, getTestUserScripts } from "./utils";
import {
  Left,
  LeftProps,
  Center,
  CenterProps,
  Top,
  TopProps,
  Right,
  RightProps,
} from "./options";

export default {
  title: "Options",
} as Meta;

export const LeftDemo: Story<LeftProps> = (args) => <Left {...args} />;
LeftDemo.args = {
  userscripts: getTestUserScripts(),
  isUserscriptOpen: (us) => us.id === "1",
  onUserscriptClick: action("onUserscriptClick"),
};

export const CenterDemo: Story<CenterProps> = (args) => <Center {...args} />;
CenterDemo.args = {
  userscript: getTestUserScript(),
};

export const TopDemo: Story<TopProps> = (args) => <Top {...args} />;
TopDemo.args = {
  gitRepoUrl: "https://github.com/narinluangrath/userscripts-chrome-extension",
  onRefreshClick: action("onRefreshClick"),
  handleGitRepoUrlSubmit: action("handleGitRepoUrlSubmit"),
};

export const RightDemo: Story<RightProps> = (args) => <Right {...args} />;
RightDemo.args = {
  userscript: getTestUserScript(),
};
