import React from "react";
import { Meta, Story } from "@storybook/react/types-6-0";
import { action } from "@storybook/addon-actions";

import { getTestUserscript, getTestUserscripts } from "./utils";
import {
  Left,
  LeftProps,
  Center,
  CenterProps,
  Top,
  TopProps,
  Right,
  RightProps,
  Options,
  OptionsProps,
} from "./options";

export default {
  title: "Options",
} as Meta;

export const left: Story<LeftProps> = (args) => <Left {...args} />;
left.args = {
  fetching: false,
  userscripts: getTestUserscripts(),
  openUserscript: getTestUserscripts()[0],
  onUserscriptClick: action("onUserscriptClick"),
};

export const center: Story<CenterProps> = (args) => <Center {...args} />;
center.args = {
  userscript: getTestUserscript(),
};

export const top: Story<TopProps> = (args) => <Top {...args} />;
top.args = {
  error: new Error("shit"),
  fetching: false,
  gitRepoUrl: "https://github.com/narinluangrath/userscripts-chrome-extension",
  onRefreshClick: action("onRefreshClick"),
  handleGitRepoUrlSubmit: action("handleGitRepoUrlSubmit"),
};

export const right: Story<RightProps> = (args) => <Right {...args} />;
right.args = {
  userscript: getTestUserscript(),
  isUserscriptEnabled: true,
  setUserscriptEnabled: action("setUserscriptEnabled"),
};

export const options: Story<OptionsProps> = (args) => <Options {...args} />;
options.args = {
  setRepoUrl: action("setRepoUrl"),
  repoUrl: "https://github.com/narinluangrath/userscripts-chrome-extension",
  repoUrlFetching: false,
  userscripts: getTestUserscripts(),
  userscriptsRefetch: action("userscriptsRefetch"),
  userscriptsFetching: false,
  userscriptsError: new Error("Userscripts Error"),
  openUserscript: getTestUserscripts()[0],
  onUserscriptClick: action("onUserscriptClick"),
  isOpenUserscriptEnabled: true,
  setIsOpenUserscriptEnabled: action("setIsOpenUserscriptEnabled"),
};
