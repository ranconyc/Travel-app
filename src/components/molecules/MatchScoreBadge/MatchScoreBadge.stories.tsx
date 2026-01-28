import type { Meta, StoryObj } from "@storybook/react";
import MatchScoreBadge from "./index";

const meta: Meta<typeof MatchScoreBadge> = {
  title: "Molecules/MatchScoreBadge",
  component: MatchScoreBadge,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    score: {
      control: { type: "range", min: 0, max: 100, step: 5 },
      description: "Match score percentage",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the badge",
    },
    showLabel: {
      control: "boolean",
      description: "Whether to show the label",
    },
    showBreakdown: {
      control: "boolean",
      description: "Whether to show breakdown tooltip",
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
    score: 75,
  },
};

export const Small: Story = {
  args: {
    score: 85,
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    score: 90,
    size: "lg",
  },
};

export const NoLabel: Story = {
  args: {
    score: 80,
    showLabel: false,
  },
};

export const LowScore: Story = {
  args: {
    score: 25,
  },
};

export const PerfectScore: Story = {
  args: {
    score: 100,
  },
};

export const WithBreakdown: Story = {
  args: {
    score: 72,
    showBreakdown: true,
    matchResult: {
      score: 72,
      breakdown: {
        interests: 85,
        budget: 60,
        vibe: 70,
      },
      reasoning: ["Similar travel interests", "Budget compatibility"],
    },
  },
};

export const MultipleBadges: Story = {
  render: () => (
    <div className="flex gap-4">
      <MatchScoreBadge score={95} size="sm" />
      <MatchScoreBadge score={75} size="md" />
      <MatchScoreBadge score={45} size="lg" />
    </div>
  ),
};
