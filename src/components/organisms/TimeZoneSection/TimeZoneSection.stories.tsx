import type { Meta, StoryObj } from "@storybook/react";
import TimeZoneSection from "./index";

const meta: Meta<typeof TimeZoneSection> = {
  title: "Sections/TimeZone",
  component: TimeZoneSection,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    timeZone: "Indochina Time (ICT)",
  },
};

export const EST: Story = {
  args: {
    timeZone: "Eastern Standard Time (EST)",
  },
};
