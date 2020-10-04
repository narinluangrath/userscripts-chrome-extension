import React from "react";
import { Meta, Story } from "@storybook/react/types-6-0";
import { action } from "@storybook/addon-actions";

import { Popup, PopupProps } from "./popup";

export default {
  title: "Popup",
  component: Popup,
} as Meta;

const Template: Story<PopupProps> = (args) => <Popup {...args} />;

export const Demo = Template.bind({});
Demo.args = {
  userScripts: [
    {
      id: "1",
      filename: "",
      script: "",
      metadata: {
        name: "script-1",
      },
    },
    {
      id: "2",
      filename: "",
      script: "",
      metadata: {
        name: "script-2",
      },
    },
    {
      id: "3",
      filename: "",
      script: "",
      metadata: {
        name: "script-3",
      },
    },
  ],
  isUserScriptEnabled: (us) => us.id !== "3",
  toggleUserScript: action("toggleUserScript"),
  onSettingsClick: action("onSettingsclick"),
};
