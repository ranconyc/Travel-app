import type { Meta, StoryObj } from "@storybook/react";
import InterestTag from "./index";

const meta: Meta<typeof InterestTag> = {
  title: "Atoms/InterestTag",
  component: InterestTag,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
      description: "Content to display in the tag",
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
  args: {
    children: "Travel",
  },
};

export const LongText: Story = {
  args: {
    children: "Adventure Sports",
  },
};

export const WithEmoji: Story = {
  args: {
    children: "🏔️ Hiking",
  },
};

export const MultipleTags: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <InterestTag>Travel</InterestTag>
      <InterestTag>Food</InterestTag>
      <InterestTag>Photography</InterestTag>
      <InterestTag>Nature</InterestTag>
      <InterestTag>Culture</InterestTag>
    </div>
  ),
};
