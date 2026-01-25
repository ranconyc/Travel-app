import type { Meta, StoryObj } from "@storybook/react";
import FilterChips from "./index";

const meta: Meta<typeof FilterChips> = {
  title: "Molecules/FilterChips",
  component: FilterChips,
  tags: ["autodocs"],
  args: {
    minAge: 18,
    maxAge: 60,
    maxDistance: 100,
  },
  argTypes: {
    onClearAll: { action: "cleared all" },
    onClearAge: { action: "cleared age" },
    onClearDistance: { action: "cleared distance" },
  },
};

export default meta;
type Story = StoryObj<typeof FilterChips>;

export const Default: Story = {
  args: {
    minAge: 18,
    maxAge: 60,
    maxDistance: 100,
  },
};

export const ActiveAge: Story = {
  args: {
    minAge: 25,
    maxAge: 35,
    maxDistance: 100,
  },
};

export const ActiveDistance: Story = {
  args: {
    minAge: 18,
    maxAge: 60,
    maxDistance: 500,
  },
};

export const AllActive: Story = {
  args: {
    minAge: 21,
    maxAge: 40,
    maxDistance: 250,
  },
};
