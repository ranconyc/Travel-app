import type { Meta, StoryObj } from "@storybook/react";
import Select from "./index";

const meta: Meta<typeof Select> = {
  title: "Atoms/Select",
  component: Select,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "Label text for the select",
    },
    error: {
      control: "text",
      description: "Error message to display",
    },
    options: {
      control: "object",
      description: "Array of options with value and label",
    },
    disabled: {
      control: "boolean",
      description: "Whether the select is disabled",
    },
    required: {
      control: "boolean",
      description: "Whether the select is required",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleOptions = [
  { value: "", label: "Select an option" },
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

export const Default: Story = {
  args: {
    label: "Choose an option",
    options: sampleOptions,
  },
};

export const WithError: Story = {
  args: {
    label: "Choose an option",
    options: sampleOptions,
    error: "This field is required",
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled select",
    options: sampleOptions,
    disabled: true,
  },
};

export const NoLabel: Story = {
  args: {
    options: sampleOptions,
  },
};

export const WithDefaultValue: Story = {
  args: {
    label: "Country",
    options: [
      { value: "", label: "Select country" },
      { value: "us", label: "United States" },
      { value: "gb", label: "United Kingdom" },
      { value: "fr", label: "France" },
      { value: "jp", label: "Japan" },
    ],
    defaultValue: "us",
  },
};

export const LongOptions: Story = {
  args: {
    label: "Select destination",
    options: [
      { value: "", label: "Choose destination" },
      { value: "paris", label: "Paris, France" },
      { value: "tokyo", label: "Tokyo, Japan" },
      { value: "newyork", label: "New York, United States" },
      { value: "london", label: "London, United Kingdom" },
    ],
  },
};
