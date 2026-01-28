import type { Meta, StoryObj } from "@storybook/react";
import AutocompleteResults from "./index";

const meta: Meta<typeof AutocompleteResults> = {
  title: "Molecules/AutocompleteResults",
  component: AutocompleteResults,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    open: {
      control: "boolean",
      description: "Whether results are visible",
    },
    loading: {
      control: "boolean",
      description: "Whether results are loading",
    },
    err: {
      control: "text",
      description: "Error message to display",
    },
    qVal: {
      control: "text",
      description: "Search query value",
    },
    id: {
      control: "text",
      description: "Input ID",
    },
    activeIndex: {
      control: { type: "range", min: -1, max: 10, step: 1 },
      description: "Currently active result index",
    },
    highlight: {
      control: "boolean",
      description: "Whether to highlight matching text",
    },
    noResultsText: {
      control: "text",
      description: "Text to show when no results",
    },
    onSelect: { action: "selected" },
    onHover: { action: "hovered" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockOptions = [
  { id: "1", label: "Paris, France", subtitle: "City of Light" },
  { id: "2", label: "London, UK", subtitle: "Historic capital" },
  { id: "3", label: "Tokyo, Japan", subtitle: "Modern metropolis" },
];

export const Default: Story = {
  args: {
    open: true,
    loading: false,
    err: null,
    merged: mockOptions,
    qVal: "par",
    id: "autocomplete-input",
    activeIndex: 0,
    highlight: true,
    onSelect: (opt) => console.log("Selected:", opt),
    onHover: (idx) => console.log("Hovered:", idx),
  },
};

export const Loading: Story = {
  args: {
    open: true,
    loading: true,
    err: null,
    merged: [],
    qVal: "searching",
    id: "autocomplete-input",
    activeIndex: -1,
    highlight: false,
    onSelect: (opt) => console.log("Selected:", opt),
    onHover: (idx) => console.log("Hovered:", idx),
  },
};

export const Error: Story = {
  args: {
    open: true,
    loading: false,
    err: "Failed to fetch results",
    merged: [],
    qVal: "error",
    id: "autocomplete-input",
    activeIndex: -1,
    highlight: false,
    onSelect: (opt) => console.log("Selected:", opt),
    onHover: (idx) => console.log("Hovered:", idx),
  },
};

export const NoResults: Story = {
  args: {
    open: true,
    loading: false,
    err: null,
    merged: [],
    qVal: "xyz",
    id: "autocomplete-input",
    activeIndex: -1,
    highlight: true,
    noResultsText: "No cities found",
    onSelect: (opt) => console.log("Selected:", opt),
    onHover: (idx) => console.log("Hovered:", idx),
  },
};

export const Closed: Story = {
  args: {
    open: false,
    loading: false,
    err: null,
    merged: mockOptions,
    qVal: "test",
    id: "autocomplete-input",
    activeIndex: -1,
    highlight: true,
    onSelect: (opt) => console.log("Selected:", opt),
    onHover: (idx) => console.log("Hovered:", idx),
  },
};

export const NoHighlight: Story = {
  args: {
    open: true,
    loading: false,
    err: null,
    merged: mockOptions,
    qVal: "o",
    id: "autocomplete-input",
    activeIndex: 1,
    highlight: false,
    onSelect: (opt) => console.log("Selected:", opt),
    onHover: (idx) => console.log("Hovered:", idx),
  },
};
