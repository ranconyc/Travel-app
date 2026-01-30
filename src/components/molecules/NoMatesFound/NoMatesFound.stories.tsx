import type { Meta, StoryObj } from "@storybook/react";
import NoMatesFound from "./index";

const meta: Meta<typeof NoMatesFound> = {
  title: "Molecules/NoMatesFound",
  component: NoMatesFound,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const WithFilters: Story = {
  args: {
    onClearFilters: () => alert("Filters cleared!"),
    hasActiveFilters: true,
  },
};

export const NoFilters: Story = {
  args: {
    onClearFilters: () => {},
    hasActiveFilters: false,
  },
};
