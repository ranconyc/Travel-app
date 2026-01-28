import type { Meta, StoryObj } from "@storybook/react";
import StatusIndicator from "./index";

const meta: Meta<typeof StatusIndicator> = {
  title: "Atoms/StatusIndicator",
  component: StatusIndicator,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    isOnline: {
      control: "boolean",
      description: "Whether the status is online (green) or offline (red)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Online: Story = {
  args: {
    isOnline: true,
  },
};

export const Offline: Story = {
  args: {
    isOnline: false,
  },
};

export const MultipleIndicators: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <StatusIndicator isOnline={true} />
        <span className="text-sm">Online</span>
      </div>
      <div className="flex items-center gap-2">
        <StatusIndicator isOnline={false} />
        <span className="text-sm">Offline</span>
      </div>
    </div>
  ),
};

export const InCard: Story = {
  render: () => (
    <div className="p-4 border rounded-lg bg-gray-50">
      <div className="flex items-center justify-between">
        <span className="font-medium">User Status</span>
        <StatusIndicator isOnline={true} />
      </div>
    </div>
  ),
};
