import type { Meta, StoryObj } from "@storybook/react";
import PageInfo from "./index";

const meta: Meta<typeof PageInfo> = {
  title: "Molecules/PageInfo",
  component: PageInfo,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Main title text",
    },
    subtitle: {
      control: "text",
      description: "Subtitle text (optional)",
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
    title: "Welcome to Travel App",
    subtitle: "Discover amazing places",
  },
};

export const TitleOnly: Story = {
  args: {
    title: "Just a Title",
  },
};

export const LongTitle: Story = {
  args: {
    title:
      "Explore the World's Most Beautiful Destinations and Create Unforgettable Memories",
    subtitle: "Adventure Awaits",
  },
};

export const ShortTitle: Story = {
  args: {
    title: "Hello",
    subtitle: "Welcome",
  },
};

export const CustomClass: Story = {
  args: {
    title: "Custom Styled",
    subtitle: "With custom styling",
    className: "text-center",
  },
};
