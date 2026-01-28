import type { Meta, StoryObj } from "@storybook/react";
import { AutocompleteInput } from "./index";

const meta: Meta<typeof AutocompleteInput> = {
  title: "Atoms/AutocompleteInput",
  component: AutocompleteInput,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    onClear: { action: "cleared" },
    showClear: {
      control: "boolean",
      description: "Whether to show the clear button",
    },
    error: {
      control: "text",
      description: "Error message to display",
    },
    placeholder: {
      control: "text",
      description: "Input placeholder text",
    },
    disabled: {
      control: "boolean",
      description: "Whether the input is disabled",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Type to search...",
    showClear: false,
    onClear: () => {},
  },
};

export const WithClearButton: Story = {
  args: {
    placeholder: "Type to search...",
    showClear: true,
    onClear: () => {},
  },
};

export const WithError: Story = {
  args: {
    placeholder: "Type to search...",
    showClear: true,
    error: "This field is required",
    onClear: () => {},
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Type to search...",
    showClear: false,
    disabled: true,
    onClear: () => {},
  },
};

export const WithValue: Story = {
  args: {
    value: "New York",
    placeholder: "Type to search...",
    showClear: true,
    onClear: () => {},
  },
};
