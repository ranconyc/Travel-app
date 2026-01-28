import type { Meta, StoryObj } from "@storybook/react";
import MediaLinks from "./index";

const meta: Meta<typeof MediaLinks> = {
  title: "Molecules/MediaLinks",
  component: MediaLinks,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof MediaLinks>;

export const AllPlatforms: Story = {
  args: {
    links: {
      instagram: "https://instagram.com/example",
      tiktok: "https://tiktok.com/@example",
      facebook: "https://facebook.com/example",
      reddit: "https://reddit.com/u/example",
      linkedin: "https://linkedin.com/in/example",
      twitter: "https://twitter.com/example",
      website: "https://example.com",
    },
  },
};

export const SinglePlatform: Story = {
  args: {
    links: {
      instagram: "https://instagram.com/example",
    },
  },
};

export const TwoLinks: Story = {
  args: {
    links: {
      instagram: "https://instagram.com/example",
      tiktok: "https://tiktok.com/@example",
    },
  },
};

export const ThreeLinks: Story = {
  args: {
    links: {
      facebook: "https://facebook.com/example",
      linkedin: "https://linkedin.com/in/example",
      website: "https://example.com",
    },
  },
};

export const EmptyLinks: Story = {
  args: {
    links: {},
  },
};

export const WithCustomClass: Story = {
  args: {
    links: {
      instagram: "https://instagram.com/example",
      tiktok: "https://tiktok.com/@example",
    },
    className: "gap-4",
  },
};
