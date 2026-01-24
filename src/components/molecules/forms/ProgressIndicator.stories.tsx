import type { Meta, StoryObj } from "@storybook/react";
import { ProgressIndicator } from "./ProgressIndicator";

const meta: Meta<typeof ProgressIndicator> = {
  title: "Forms/ProgressIndicator",
  component: ProgressIndicator,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    currentStep: {
      control: { type: "number", min: 1, max: 10 },
      description: "Current step number",
    },
    totalSteps: {
      control: { type: "number", min: 1, max: 10 },
      description: "Total number of steps",
    },
    variant: {
      control: "select",
      options: ["bar", "dots"],
      description: "Visual variant",
    },
    showLabel: {
      control: "boolean",
      description: "Whether to show step label",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProgressIndicator>;

export const BarDefault: Story = {
  args: {
    currentStep: 2,
    totalSteps: 4,
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
    totalSteps: 4,
    variant: "dots",
    showLabel: false,
  },
};

export const DotsWithLabel: Story = {
  args: {
    currentStep: 3,
    totalSteps: 6,
    variant: "dots",
    showLabel: true,
  },
};

export const FirstStep: Story = {
  args: {
    currentStep: 1,
    totalSteps: 4,
    variant: "bar",
    showLabel: true,
  },
};

export const LastStep: Story = {
  args: {
    currentStep: 4,
    totalSteps: 4,
    variant: "bar",
    showLabel: true,
  },
};

export const ManySteps: Story = {
  args: {
    currentStep: 5,
    totalSteps: 10,
    variant: "dots",
    showLabel: true,
  },
};

export const Comparison: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-secondary mb-2">Bar variant</p>
        <ProgressIndicator
          currentStep={2}
          totalSteps={4}
          variant="bar"
          showLabel
        />
      </div>
      <div>
        <p className="text-sm text-secondary mb-2">Dots variant</p>
        <ProgressIndicator
          currentStep={2}
          totalSteps={4}
          variant="dots"
          showLabel
        />
      </div>
    </div>
  ),
};
