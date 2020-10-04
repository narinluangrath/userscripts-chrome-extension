import React from "react";
import { Meta, Story } from "@storybook/react/types-6-0";
import { action } from "@storybook/addon-actions";

import { getTestUserScript, getTestUserScripts } from "./utils";
import {
  LeftRail,
  LeftRailProps,
  Main,
  MainProps,
  Top,
  TopProps,
  RightRail,
  RightRailProps,
} from "./options";

export default {
  title: "Options",
} as Meta;

export const LeftRailDemo: Story<LeftRailProps> = (args) => (
  <LeftRail {...args} />
);
LeftRailDemo.args = {
  userScripts: getTestUserScripts(),
  isUserScriptOpen: (us) => us.id === "1",
  onUserScriptClick: action("onUserScriptClick"),
};

export const MainDemo: Story<MainProps> = (args) => <Main {...args} />;
MainDemo.args = {
  userScript: getTestUserScript(),
};

export const TopDemo: Story<TopProps> = (args) => <Top {...args} />;
TopDemo.args = {
  gitRepoUrl: "https://github.com/narinluangrath/userscripts-chrome-extension",
  onRefreshClick: action("onRefreshClick"),
  handleGitRepoUrlSubmit: action("handleGitRepoUrlSubmit"),
};

export const RightRailDemo: Story<RightRailProps> = (args) => (
  <RightRail {...args} />
);
RightRailDemo.args = {
  userScript: getTestUserScript(),
  isDisabledGlobally: true,
  toggleDisabledGlobally: action("toggleDisabledGlobally"),
  disabledDomains: [
    "https://google.com/",
    "http://example.org/foo/bar.html",
    "http://127.0.0.1/",
  ],
  removeDisabledDomain: action("removeDisabledDomain"),
};
