import type { Meta, StoryObj } from "@storybook/react";
import ResidentOrVisitorBadge from "./index";

const meta: Meta<typeof ResidentOrVisitorBadge> = {
  title: "Components/ResidentOrVisitorBadge",
  component: ResidentOrVisitorBadge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Resident: Story = {
  args: {
    isResident: true,
  },
};

export const Visitor: Story = {
  args: {
    isResident: false,
  },
};
