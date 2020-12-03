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
  userscripts: [
    {
      id: "1",
      filename: "",
      script: "",
      metadata: {
        name: "Awesome Script 1",
        version: "v1.2.3",
      },
    },
    {
      id: "2",
      filename: "",
      script: "",
      metadata: {
        name: "Okay Script 3",
        version: "v2.3.4",
      },
    },
    {
      id: "3",
      filename: "",
      script: "",
      metadata: {
        name: "Shitty Script 4",
        version: "v3.4.5",
      },
    },
  ],
  isUserscriptEnabled: (us) => us.id !== "3",
  toggleUserscript: action("toggleUserscript"),
  onSettingsClick: action("onSettingsclick"),
};
