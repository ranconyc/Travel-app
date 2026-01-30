import type { Meta, StoryObj } from "@storybook/react";
import PageHeader from "./index";
import Button from "@/components/atoms/Button";
import { Search, Settings } from "lucide-react";

const meta: Meta<typeof PageHeader> = {
  title: "Molecules/PageHeader",
  component: PageHeader,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {
  args: {
    title: "Explore Destinations",
    subtitle: "Discover your next adventure",
  },
};

export const WithBackButton: Story = {
  args: {
    title: "Profile Settings",
    backButton: true,
  },
};

export const WithRightContent: Story = {
  args: {
    title: "Tokyo",
    subtitle: "Japan",
    backButton: true,
    rightContent: (
      <Button variant="outline" size="sm" icon={<Settings size={16} />}>
        Settings
      </Button>
    ),
  },
};

export const Complete: Story = {
  args: {
    title: "Search Results",
    subtitle: "12 cities found",
    backButton: true,
    rightContent: <Settings size={20} className="text-secondary" />,
    bottomContent: (
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search size={16} className="text-secondary" />
        </div>
        <input
          type="text"
          placeholder="Filter results..."
          className="w-full bg-surface-secondary border-0 rounded-xl py-3 pl-10 pr-4 text-sm outline-none ring-1 ring-stroke focus:ring-brand transition-all"
        />
      </div>
    ),
  },
};
