import type { Meta, StoryObj } from "@storybook/react";
import ConnectivitySection from "./index";
import React from "react";

const meta: Meta<typeof ConnectivitySection> = {
  title: "Organisms/ConnectivitySection",
  component: ConnectivitySection,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    simNote:
      "Available at all airports. AIS and TrueMove are the best providers.",
    simePrice: "$15 for 30GB",
    wifiNote: "Free wifi is common in malls and cafes across the city.",
  },
};
