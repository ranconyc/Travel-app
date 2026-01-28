import type { Meta, StoryObj } from "@storybook/react";
import ActivityCard from "./index";

const meta: Meta<typeof ActivityCard> = {
  title: "Molecules/ActivityCard",
  component: ActivityCard,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    activity: {
      control: "object",
      description: "Activity data object",
    },
    index: {
      control: { type: "range", min: 0, max: 10, step: 1 },
      description: "Index for priority loading",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockActivity = {
  id: "1",
  name: "Hiking Adventure",
  image: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=400",
  mates: [
    { id: "1", name: "Alex", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" },
    { id: "2", name: "Sam", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam" },
  ],
  slug: "hiking-adventure",
};

export const Default: Story = {
  args: {
    activity: mockActivity,
    index: 0,
  },
};

export const NoMates: Story = {
  args: {
    activity: {
      ...mockActivity,
      mates: [],
    },
    index: 1,
  },
};

export const ManyMates: Story = {
  args: {
    activity: {
      ...mockActivity,
      mates: [
        { id: "1", name: "Alex", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" },
        { id: "2", name: "Sam", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam" },
        { id: "3", name: "Jordan", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan" },
        { id: "4", name: "Casey", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Casey" },
      ],
    },
    index: 2,
  },
};

export const NoSlug: Story = {
  args: {
    activity: {
      ...mockActivity,
      slug: undefined,
    },
    index: 3,
  },
};

export const LowPriority: Story = {
  args: {
    activity: mockActivity,
    index: 5,
  },
};
