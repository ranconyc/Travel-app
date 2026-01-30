import type { Meta, StoryObj } from "@storybook/react";
import DestinationCard from "./index";

const meta: Meta<typeof DestinationCard> = {
  title: "Molecules/DestinationCard",
  component: DestinationCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    aspectRatio: {
      control: "select",
      options: ["aspect-4/3", "aspect-square", "aspect-video", "default"],
    },
    badge: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof DestinationCard>;

export const Default: Story = {
  args: {
    title: "Kyoto, Japan",
    subtitle: "Ancient Capital",
    href: "#",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "aspect-4/3",
  },
};

export const SquareWithBadge: Story = {
  args: {
    title: "Reykjavik",
    subtitle: "Iceland",
    href: "#",
    image:
      "https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&q=80&w=800",
    badge: "9.8",
    aspectRatio: "aspect-square",
  },
};

export const VideoRatio: Story = {
  args: {
    title: "Santorini",
    subtitle: "Greece",
    href: "#",
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=800",
    badge: "Popular",
    aspectRatio: "aspect-video",
  },
};

export const GridView: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
      <DestinationCard
        title="Paris"
        subtitle="France"
        href="#"
        image="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800"
        aspectRatio="aspect-square"
      />
      <DestinationCard
        title="London"
        subtitle="United Kingdom"
        href="#"
        image="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=800"
        aspectRatio="aspect-square"
      />
      <DestinationCard
        title="New York"
        subtitle="USA"
        href="#"
        image="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=800"
        aspectRatio="aspect-square"
      />
    </div>
  ),
};
