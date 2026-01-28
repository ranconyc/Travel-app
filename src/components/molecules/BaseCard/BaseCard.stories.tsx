import type { Meta, StoryObj } from "@storybook/react";
import BaseCard from "./index";

const meta: Meta<typeof BaseCard> = {
  title: "Molecules/BaseCard",
  component: BaseCard,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
      description: "Card content",
    },
    image: {
      control: "object",
      description: "Image object with src, alt, and priority",
    },
    linkHref: {
      control: "text",
      description: "Link URL for clickable card",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
    aspectRatio: {
      control: "text",
      description: "Aspect ratio class",
    },
    gradient: {
      control: "boolean",
      description: "Whether to show gradient overlay",
    },
    priority: {
      control: "boolean",
      description: "Whether image should load with priority",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-4">
        <h3 className="font-bold text-lg">Card Title</h3>
        <p className="text-sm text-gray-600">Card description goes here</p>
      </div>
    ),
  },
};

export const WithImage: Story = {
  args: {
    image: {
      src: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=400",
      alt: "Beautiful landscape",
      priority: true,
    },
    children: (
      <div className="p-4">
        <h3 className="font-bold text-lg">Image Card</h3>
        <p className="text-sm text-gray-600">This card has an image</p>
      </div>
    ),
  },
};

export const WithGradient: Story = {
  args: {
    image: {
      src: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=400",
      alt: "Beautiful landscape",
      priority: false,
    },
    gradient: true,
    children: (
      <div className="p-4 text-white">
        <h3 className="font-bold text-lg">Gradient Overlay</h3>
        <p className="text-sm">Text appears over gradient</p>
      </div>
    ),
  },
};

export const Clickable: Story = {
  args: {
    image: {
      src: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=400",
      alt: "Beautiful landscape",
      priority: false,
    },
    linkHref: "/example",
    children: (
      <div className="p-4">
        <h3 className="font-bold text-lg">Clickable Card</h3>
        <p className="text-sm text-gray-600">This card links somewhere</p>
      </div>
    ),
  },
};

export const CustomAspectRatio: Story = {
  args: {
    image: {
      src: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=400",
      alt: "Beautiful landscape",
      priority: false,
    },
    aspectRatio: "aspect-video",
    children: (
      <div className="p-4">
        <h3 className="font-bold text-lg">Wide Card</h3>
        <p className="text-sm text-gray-600">16:9 aspect ratio</p>
      </div>
    ),
  },
};

export const NoImage: Story = {
  args: {
    children: (
      <div className="p-6 text-center">
        <h3 className="font-bold text-lg mb-2">No Image</h3>
        <p className="text-sm text-gray-600">This card has no image</p>
      </div>
    ),
  },
};
