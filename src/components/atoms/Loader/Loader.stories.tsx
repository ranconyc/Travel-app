import type { Meta, StoryObj } from "@storybook/react";
import Loader from "./index";

const meta: Meta<typeof Loader> = {
  title: "Atoms/Loader",
  component: Loader,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "range", min: 12, max: 48, step: 2 },
      description: "Size of the loader in pixels",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Small: Story = {
  args: {
    size: 16,
  },
};

export const Large: Story = {
  args: {
    size: 32,
  },
};

export const ExtraLarge: Story = {
  args: {
    size: 48,
  },
};

export const CustomColor: Story = {
  args: {
    className: "text-blue-500",
    size: 24,
  },
};

export const MultipleLoaders: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Loader size={16} />
      <Loader size={24} />
      <Loader size={32} />
      <Loader className="text-green-500" size={24} />
      <Loader className="text-purple-500" size={24} />
    </div>
  ),
};
