import type { Meta, StoryObj } from "@storybook/react";
import ProfileCompletionBadge from "./index";

const meta: Meta<typeof ProfileCompletionBadge> = {
  title: "Molecules/ProfileCompletionBadge",
  component: ProfileCompletionBadge,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["compact", "full"],
      description: "Display variant of the badge",
    },
    onClick: { action: "clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Compact: Story = {
  args: {
    variant: "compact",
    onClick: () => {},
  },
};

export const Full: Story = {
  args: {
    variant: "full",
    onClick: () => {},
  },
};

export const CustomClick: Story = {
  args: {
    variant: "compact",
    onClick: () => alert("Navigate to profile completion"),
  },
};
