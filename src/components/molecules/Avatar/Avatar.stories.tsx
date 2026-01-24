import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "./index";

const meta: Meta<typeof Avatar> = {
  title: "Components/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["circle", "square"],
    },
    size: {
      control: { type: "range", min: 20, max: 200, step: 4 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "Ran Cohen",
    size: 60,
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200"
  },
};

export const Square: Story = {
  args: {
    name: "Ran Cohen",
    size: 60,
    variant: "square",
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200"
  },
};

export const WithBorder: Story = {
  args: {
    name: "Ran Cohen",
    size: 80,
    border: true,
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200",
  },
};

export const Large: Story = {
  args: {
    name: "Traveler",
    size: 120,
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200",
  },
};
