import type { Meta, StoryObj } from "@storybook/react";
import HeroImage from "./index";

const meta: Meta<typeof HeroImage> = {
  title: "Molecules/HeroImage",
  component: HeroImage,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof HeroImage>;

export const WithImage: Story = {
  args: {
    name: "Paris",
    src: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800",
  },
};

export const Placeholder: Story = {
  args: {
    name: "New York",
    src: null,
  },
};

export const InContainer: Story = {
  render: () => (
    <div className="w-[400px]">
      <HeroImage
        name="Santorini"
        src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=800"
      />
    </div>
  ),
};
