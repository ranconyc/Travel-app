import type { Meta, StoryObj } from "@storybook/react";
import ImageWithFallback from "./index";

const meta: Meta<typeof ImageWithFallback> = {
  title: "Atoms/ImageWithFallback",
  component: ImageWithFallback,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    src: {
      control: "text",
      description: "Primary image source URL",
    },
    alt: {
      control: "text",
      description: "Alt text for accessibility",
    },
    fallbackSrc: {
      control: "text",
      description: "Fallback image source URL",
    },
    fallbackText: {
      control: "text",
      description: "Text to show when image fails and no fallback",
    },
    width: {
      control: "number",
      description: "Image width",
    },
    height: {
      control: "number",
      description: "Image height",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    alt: "Mountain landscape",
    width: 400,
    height: 300,
  },
};

export const WithFallbackSrc: Story = {
  args: {
    src: "https://invalid-url-that-will-fail.com/image.jpg",
    alt: "Invalid image",
    fallbackSrc: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop",
    width: 400,
    height: 300,
  },
};

export const WithFallbackText: Story = {
  args: {
    src: "https://invalid-url-that-will-fail.com/image.jpg",
    alt: "Invalid image",
    fallbackText: "No Image Available",
    width: 400,
    height: 300,
  },
};

export const WithCustomFallback: Story = {
  args: {
    src: "https://invalid-url-that-will-fail.com/image.jpg",
    alt: "Invalid image",
    fallback: (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded">
        <span className="text-gray-500">Custom Fallback</span>
      </div>
    ),
    width: 400,
    height: 300,
  },
};

export const FillMode: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    alt: "Mountain landscape",
    fill: true,
    className: "w-96 h-64",
  },
};

export const SquareImage: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop",
    alt: "Square image",
    width: 200,
    height: 200,
  },
};
