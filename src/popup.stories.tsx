import React from "react";
import { Meta, Story } from "@storybook/react/types-6-0";

import { Popup } from "./popup";

export default {
  title: "Popup",
} as Meta;

const Template: Story = (args) => <Popup {...args} />;

export const Demo = Template.bind({});
