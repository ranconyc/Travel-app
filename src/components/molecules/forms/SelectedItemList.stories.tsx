import type { Meta, StoryObj } from "@storybook/react";
import { SelectedItemList } from "./SelectedItemList";
import { fn } from "@storybook/test";

const meta: Meta<typeof SelectedItemList> = {
  title: "Molecules/Forms/SelectedItemList",
  component: SelectedItemList,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Title displayed above the list",
    },
    emptyText: {
      control: "text",
      description: "Text shown when list is empty",
    },
  },
  args: {
    onRemove: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof SelectedItemList>;

export const WithItems: Story = {
  args: {
    items: ["Hiking", "Photography", "Street Food", "Museums", "Beach"],
    title: "You're into:",
  },
};

export const Empty: Story = {
  args: {
    items: [],
    title: "Selected interests:",
    emptyText: "No interests selected yet",
  },
};

export const CustomLabels: Story = {
  args: {
    items: [
      { id: "1", name: "Paris" },
      { id: "2", name: "Tokyo" },
      { id: "3", name: "New York" },
    ],
    getLabel: (item: any) => item.name,
    title: "You've been to:",
  },
};

export const ManyItems: Story = {
  args: {
    items: [
      "Hiking",
      "Photography",
      "Street Food",
      "Museums",
      "Beach",
      "Nightlife",
      "Shopping",
      "Architecture",
      "Local Markets",
      "Coffee Culture",
      "Wine Tasting",
      "Adventure Sports",
    ],
    title: "All your interests:",
  },
};

export const NoTitle: Story = {
  args: {
    items: ["France", "Japan", "USA", "Italy"],
    title: undefined,
  },
};
