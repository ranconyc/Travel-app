import type { Meta, StoryObj } from "@storybook/react";
import EmptyState from "./index";
import Button from "@/components/atoms/Button";

const meta: Meta<typeof EmptyState> = {
  title: "Atoms/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    title: "No data found",
    description: "Please try again later.",
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    title: "No results",
    icon: <span className="text-2xl">🔍</span>,
  },
};

// Using a custom renderer to simulate the "Nearby Mates" composition
export const WithAction: Story = {
  args: {
    title: "No mates found",
    description: "Try broadening your filters (checking distance & age).",
    icon: <span className="text-2xl">🔍</span>,
  },
  render: (args) => (
    <div className="flex flex-col items-center">
      <EmptyState {...args} />
      <Button variant="outline" className="mt-[-2rem]">
        Expand Search Radius 🌍
      </Button>
    </div>
  ),
};
