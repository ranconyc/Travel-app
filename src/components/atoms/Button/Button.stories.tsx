import type { Meta, StoryObj } from "@storybook/react";
import Button from "./index";
import { Heart, Send, Plus } from "lucide-react";
import React from "react";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "outline",
        "ghost",
        "back",
        "teal",
        "dark",
        "outline-white",
        "icon",
      ],
    },
    size: {
      control: "radio",
      options: ["sm", "md", "lg"],
    },
    color: {
      control: "select",
      options: ["purple", "blue", "green", "yellow", "red", "pink"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Primary Button",
    variant: "primary",
  },
};

export const AccentPurple: Story = {
  args: {
    children: "Purple Accent",
    variant: "primary",
    color: "purple",
  },
};

export const AccentGreen: Story = {
  args: {
    children: "Green Accent",
    variant: "primary",
    color: "green",
  },
};

export const Icon: Story = {
  args: {
    variant: "icon",
    icon: <Heart size={20} />,
  },
};

export const WithIcon: Story = {
  args: {
    children: "Send Message",
    icon: <Send size={18} />,
    variant: "primary",
  },
};

export const Outline: Story = {
  args: {
    children: "Outline Button",
    variant: "outline",
    color: "blue",
  },
};

export const Large: Story = {
  args: {
    children: "Large Button",
    size: "lg",
    variant: "primary",
  },
};

export const Loading: Story = {
  args: {
    children: "Loading...",
    loading: true,
    variant: "primary",
  },
};
