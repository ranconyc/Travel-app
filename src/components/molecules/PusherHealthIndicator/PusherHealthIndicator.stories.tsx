import type { Meta, StoryObj } from "@storybook/react";
import PusherHealthIndicator from "./index";

const meta: Meta<typeof PusherHealthIndicator> = {
  title: "Molecules/PusherHealthIndicator",
  component: PusherHealthIndicator,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PusherHealthIndicator>;

/**
 * This component is only visible in development mode or when NEXT_PUBLIC_ALPHA_MODE is true.
 * It monitors the Pusher connection status.
 */
export const Default: Story = {
  render: () => (
    <div className="h-40 p-4 bg-slate-100 dark:bg-slate-900 relative">
      <p className="text-sm text-gray-500">
        The indicator should appear in the bottom right corner if the
        environment allows.
      </p>
      <PusherHealthIndicator />
    </div>
  ),
};
