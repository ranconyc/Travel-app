import type { Meta, StoryObj } from "@storybook/react";
import CategoryRow from "./index";

const meta: Meta<typeof CategoryRow> = {
  title: "Molecules/CategoryRow",
  component: CategoryRow,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Category title",
    },
    selectedCount: {
      control: { type: "range", min: 0, max: 20, step: 1 },
      description: "Number of selected items",
    },
    variant: {
      control: "select",
      options: ["default", "compact"],
      description: "Display variant",
    },
    onClick: { action: "clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Interests",
    selectedCount: 3,
    onClick: () => {},
  },
};

export const Compact: Story = {
  args: {
    title: "Travel Style",
    selectedCount: 2,
    variant: "compact",
    onClick: () => {},
  },
};

export const NoSelection: Story = {
  args: {
    title: "Budget",
    selectedCount: 0,
    onClick: () => {},
  },
};

export const ManySelected: Story = {
  args: {
    title: "Destinations",
    selectedCount: 15,
    onClick: () => {},
  },
};

export const LongTitle: Story = {
  args: {
    title: "Adventure Activities & Sports",
    selectedCount: 5,
    onClick: () => {},
  },
};
