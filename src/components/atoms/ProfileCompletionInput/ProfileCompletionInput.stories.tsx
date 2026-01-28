import type { Meta, StoryObj } from "@storybook/react";
import { ProfileCompletionInput } from "./index";

const meta: Meta<typeof ProfileCompletionInput> = {
  title: "Atoms/ProfileCompletionInput",
  component: ProfileCompletionInput,
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
    completed: {
      control: "boolean",
      description: "Whether the field is completed",
    },
    completionPercentage: {
      control: { type: "range", min: 0, max: 100, step: 10 },
      description: "Completion percentage for progress bar",
    },
    showProgress: {
      control: "boolean",
      description: "Whether to show progress bar",
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
    placeholder: "Enter your name...",
    showClear: false,
    completed: false,
    completionPercentage: 0,
    onClear: () => {},
  },
};

export const WithClearButton: Story = {
  args: {
    placeholder: "Enter your name...",
    showClear: true,
    completed: false,
    completionPercentage: 0,
    onClear: () => {},
  },
};

export const InProgress: Story = {
  args: {
    placeholder: "Enter your name...",
    showClear: true,
    completed: false,
    completionPercentage: 60,
    showProgress: true,
    onClear: () => {},
  },
};

export const Completed: Story = {
  args: {
    placeholder: "Enter your name...",
    showClear: false,
    completed: true,
    completionPercentage: 100,
    value: "John Doe",
    onClear: () => {},
  },
};

export const WithError: Story = {
  args: {
    placeholder: "Enter your name...",
    showClear: true,
    error: "This field is required",
    completed: false,
    completionPercentage: 0,
    onClear: () => {},
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Enter your name...",
    showClear: false,
    disabled: true,
    completed: false,
    completionPercentage: 0,
    onClear: () => {},
  },
};

export const HalfProgress: Story = {
  args: {
    placeholder: "Enter your bio...",
    showClear: true,
    completed: false,
    completionPercentage: 50,
    showProgress: true,
    onClear: () => {},
  },
};

export const AlmostComplete: Story = {
  args: {
    placeholder: "Enter your bio...",
    showClear: true,
    completed: false,
    completionPercentage: 90,
    showProgress: true,
    onClear: () => {},
  },
};
