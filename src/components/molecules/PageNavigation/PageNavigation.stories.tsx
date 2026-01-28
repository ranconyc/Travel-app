import type { Meta, StoryObj } from "@storybook/react";
import PageNavigation from "./index";

const meta: Meta<typeof PageNavigation> = {
  title: "Molecules/PageNavigation",
  component: PageNavigation,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    showBack: {
      control: "boolean",
      description: "Whether to show back button",
    },
    showActions: {
      control: "boolean",
      description: "Whether to show action buttons",
    },
    showSocial: {
      control: "boolean",
      description: "Whether to show social buttons",
    },
    title: {
      control: "text",
      description: "Title text",
    },
    locationName: {
      control: "text",
      description: "Location name for social links",
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
    title: "Page Title",
    locationName: "Paris",
  },
};

export const BackOnly: Story = {
  args: {
    showBack: true,
    showActions: false,
    showSocial: false,
  },
};

export const WithActions: Story = {
  args: {
    title: "Destination Details",
    showBack: true,
    showActions: true,
    showSocial: false,
  },
};

export const WithSocial: Story = {
  args: {
    title: "Paris Guide",
    locationName: "Paris",
    showBack: true,
    showActions: false,
    showSocial: true,
  },
};

export const AllFeatures: Story = {
  args: {
    title: "Complete Navigation",
    locationName: "Tokyo",
    showBack: true,
    showActions: true,
    showSocial: true,
  },
};

export const TitleOnly: Story = {
  args: {
    title: "Simple Page",
    showBack: false,
    showActions: false,
    showSocial: false,
  },
};
