import type { Meta, StoryObj } from "@storybook/react";
import AvatarUpload from "./index";

const meta: Meta<typeof AvatarUpload> = {
  title: "Molecules/AvatarUpload",
  component: AvatarUpload,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    src: null,
    onSelect: () => console.log("onSelect triggered"),
  },
};

export const WithImage: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200",
    onSelect: () => console.log("onSelect triggered"),
  },
};

export const Disabled: Story = {
  args: {
    src: null,
    disabled: true,
    onSelect: () => console.log("onSelect triggered"),
  },
};
