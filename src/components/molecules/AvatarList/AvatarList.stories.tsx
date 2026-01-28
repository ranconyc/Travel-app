import type { Meta, StoryObj } from "@storybook/react";
import { AvatarList } from "./index";

const MOCK_USERS = [
  { id: "1", name: "Alice", image: "https://i.pravatar.cc/150?u=a" },
  { id: "2", name: "Bob", image: "https://i.pravatar.cc/150?u=b" },
  { id: "3", name: "Charlie", image: "https://i.pravatar.cc/150?u=c" },
  { id: "4", name: "David", image: "https://i.pravatar.cc/150?u=d" },
  { id: "5", name: "Eve", image: "https://i.pravatar.cc/150?u=e" },
];

const meta: Meta<typeof AvatarList> = {
  title: "Molecules/AvatarList",
  component: AvatarList,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    list: MOCK_USERS.slice(0, 3),
    size: 40,
  },
};

export const LongList: Story = {
  args: {
    list: MOCK_USERS,
    maxVisible: 3,
    showExtra: true,
  },
};

export const WithMatchPercentage: Story = {
  args: {
    list: MOCK_USERS.slice(0, 2),
    showMatch: true,
    matchPercentage: 85,
  },
};

export const Small: Story = {
  args: {
    list: MOCK_USERS,
    size: 24,
    maxVisible: 4,
  },
};
