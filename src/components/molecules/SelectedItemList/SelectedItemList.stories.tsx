import type { Meta, StoryObj } from "@storybook/react";
import SelectedItemList from "./index";

const meta: Meta<typeof SelectedItemList> = {
  title: "Molecules/SelectedItemList",
  component: SelectedItemList,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    items: {
      control: "object",
      description: "Array of selected items",
    },
    title: {
      control: "text",
      description: "Title for the list",
    },
    emptyText: {
      control: "text",
      description: "Text to show when no items",
    },
    onRemove: { action: "removed" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: ["Beach", "Mountains", "Cities"],
    title: "Selected Interests:",
    onRemove: (item) => console.log("Removed:", item),
  },
};

export const Empty: Story = {
  args: {
    items: [],
    title: "Selected Interests:",
    emptyText: "No interests selected yet",
    onRemove: (item) => console.log("Removed:", item),
  },
};

export const ManyItems: Story = {
  args: {
    items: ["Photography", "Hiking", "Food Tours", "Museums", "Nightlife", "Shopping", "Beach", "Mountains"],
    title: "Selected Activities:",
    onRemove: (item) => console.log("Removed:", item),
  },
};

export const CustomTitle: Story = {
  args: {
    items: ["Budget Travel", "Luxury", "Adventure"],
    title: "Travel Style:",
    onRemove: (item) => console.log("Removed:", item),
  },
};

export const ObjectItems: Story = {
  args: {
    items: [
      { id: "1", name: "Paris" },
      { id: "2", name: "Tokyo" },
      { id: "3", name: "New York" },
    ],
    title: "Destinations:",
    getLabel: (item: any) => item.name,
    onRemove: (item: any) => console.log("Removed:", item),
  },
};
