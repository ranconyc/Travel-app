import type { Meta, StoryObj } from "@storybook/react";
import Logo from "./index";

const meta: Meta<typeof Logo> = {
  title: "Atoms/Logo",
  component: Logo,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const InContainer: Story = {
  render: () => (
    <div className="p-4 bg-gray-100 rounded">
      <Logo />
    </div>
  ),
};

export const WithText: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Logo />
      <span className="text-xl font-semibold">TravelMate</span>
    </div>
  ),
};
