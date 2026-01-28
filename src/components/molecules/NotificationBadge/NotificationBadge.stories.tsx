import type { Meta, StoryObj } from "@storybook/react";
import NotificationBadge from "./index";

const meta: Meta<typeof NotificationBadge> = {
  title: "Molecules/NotificationBadge",
  component: NotificationBadge,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    count: {
      control: { type: "range", min: 0, max: 150, step: 1 },
      description: "Number of notifications",
    },
    max: {
      control: { type: "range", min: 1, max: 999, step: 1 },
      description: "Maximum number to display before showing '+'",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  args: {
    count: 1,
  },
};

export const Multiple: Story = {
  args: {
    count: 5,
  },
};

export const HighCount: Story = {
  args: {
    count: 25,
  },
};

export const MaxedOut: Story = {
  args: {
    count: 150,
    max: 99,
  },
};

export const CustomMax: Story = {
  args: {
    count: 15,
    max: 9,
  },
};

export const Zero: Story = {
  args: {
    count: 0,
  },
};

export const OnButton: Story = {
  render: () => (
    <div className="relative inline-block">
      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
        Notifications
      </button>
      <NotificationBadge count={12} />
    </div>
  ),
};

export const OnIcon: Story = {
  render: () => (
    <div className="relative inline-block">
      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
        🔔
      </div>
      <NotificationBadge count={3} />
    </div>
  ),
};
