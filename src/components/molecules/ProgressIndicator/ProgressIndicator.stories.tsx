import type { Meta, StoryObj } from "@storybook/react";
import ProgressIndicator from "./index";

const meta: Meta<typeof ProgressIndicator> = {
  title: "Molecules/ProgressIndicator",
  component: ProgressIndicator,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    currentStep: {
      control: { type: "range", min: 1, max: 10, step: 1 },
      description: "Current step number",
    },
    totalSteps: {
      control: { type: "range", min: 2, max: 10, step: 1 },
      description: "Total number of steps",
    },
    variant: {
      control: "select",
      options: ["bar", "dots"],
      description: "Progress display variant",
    },
    showLabel: {
      control: "boolean",
      description: "Whether to show step label",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const BarDefault: Story = {
  args: {
    currentStep: 2,
    totalSteps: 5,
    variant: "bar",
    showLabel: false,
  },
};

export const BarWithLabel: Story = {
  args: {
    currentStep: 3,
    totalSteps: 5,
    variant: "bar",
    showLabel: true,
  },
};

export const DotsDefault: Story = {
  args: {
    currentStep: 2,
    totalSteps: 5,
    variant: "dots",
    showLabel: false,
  },
};

export const DotsWithLabel: Story = {
  args: {
    currentStep: 4,
    totalSteps: 6,
    variant: "dots",
    showLabel: true,
  },
};

export const Beginning: Story = {
  args: {
    currentStep: 1,
    totalSteps: 4,
    variant: "bar",
    showLabel: true,
  },
};

export const AlmostComplete: Story = {
  args: {
    currentStep: 4,
    totalSteps: 5,
    variant: "dots",
    showLabel: true,
  },
};

export const Complete: Story = {
  args: {
    currentStep: 5,
    totalSteps: 5,
    variant: "bar",
    showLabel: true,
  },
};
