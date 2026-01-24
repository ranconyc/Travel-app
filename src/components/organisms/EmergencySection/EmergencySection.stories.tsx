import type { Meta, StoryObj } from "@storybook/react";
import EmergencySection from "./index";
import React from "react";

const meta: Meta<typeof EmergencySection> = {
  title: "Sections/Emergency",
  component: EmergencySection,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    touristPolice: "1155",
    emergency: "191",
    ambulance: "1554",
    fire: "199",
  },
};
