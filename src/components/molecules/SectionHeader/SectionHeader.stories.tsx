import type { Meta, StoryObj } from "@storybook/react";
import SectionHeader from "./index";

const meta: Meta<typeof SectionHeader> = {
  title: "Molecules/SectionHeader",
  component: SectionHeader,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Popular Destinations",
  },
};

export const WithLink: Story = {
  args: {
    title: "Upcoming Trips",
    href: "/trips",
    linkText: "see all active",
  },
};
