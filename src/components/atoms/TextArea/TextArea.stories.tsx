import type { Meta, StoryObj } from "@storybook/react";
import TextArea from "./index";

const meta: Meta<typeof TextArea> = {
  title: "Atoms/TextArea",
  component: TextArea,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "Label text for the textarea",
    },
    error: {
      control: "text",
      description: "Error message to display",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    disabled: {
      control: "boolean",
      description: "Whether the textarea is disabled",
    },
    rows: {
      control: { type: "range", min: 2, max: 10, step: 1 },
      description: "Number of visible rows",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Description",
    placeholder: "Enter your description here...",
    rows: 4,
  },
};

export const WithError: Story = {
  args: {
    label: "Description",
    placeholder: "Enter your description here...",
    error: "Description must be at least 10 characters",
    rows: 4,
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled textarea",
    placeholder: "This textarea is disabled",
    disabled: true,
    rows: 3,
  },
};

export const NoLabel: Story = {
  args: {
    placeholder: "Type something here...",
    rows: 5,
  },
};

export const WithValue: Story = {
  args: {
    label: "Bio",
    defaultValue: "I love traveling and exploring new places around the world. My favorite destinations include Japan, Italy, and Thailand.",
    rows: 4,
  },
};

export const Small: Story = {
  args: {
    label: "Short note",
    placeholder: "Enter a short note...",
    rows: 2,
  },
};

export const Large: Story = {
  args: {
    label: "Detailed description",
    placeholder: "Enter a detailed description...",
    rows: 8,
  },
};
