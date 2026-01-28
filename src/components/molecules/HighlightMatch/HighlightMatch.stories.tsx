import type { Meta, StoryObj } from "@storybook/react";
import HighlightMatch from "./index";

// Create a wrapper component for Storybook
const HighlightMatchWrapper = ({ text, query }: { text: string; query: string }) => (
  <div className="p-4 border rounded">
    {HighlightMatch(text, query)}
  </div>
);

const meta: Meta<typeof HighlightMatchWrapper> = {
  title: "Molecules/HighlightMatch",
  component: HighlightMatchWrapper,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    text: {
      control: "text",
      description: "Text to search within",
    },
    query: {
      control: "text",
      description: "Search query to highlight",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: "Paris, France",
    query: "par",
  },
};

export const NoMatch: Story = {
  args: {
    text: "London, United Kingdom",
    query: "paris",
  },
};

export const EmptyQuery: Story = {
  args: {
    text: "Tokyo, Japan",
    query: "",
  },
};

export const MultipleMatches: Story = {
  args: {
    text: "San Francisco, California",
    query: "san",
  },
};

export const CaseInsensitive: Story = {
  args: {
    text: "NEW YORK CITY",
    query: "new",
  },
};

export const PartialMatch: Story = {
  args: {
    text: "Amsterdam",
    query: "dam",
  },
};

export const LongText: Story = {
  args: {
    text: "The City of Light and Love",
    query: "city",
  },
};
