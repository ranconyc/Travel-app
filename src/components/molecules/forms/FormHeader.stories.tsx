import type { Meta, StoryObj } from "@storybook/react";
import { FormHeader } from "./FormHeader";
import { ProgressIndicator } from "./ProgressIndicator";
import { fn } from "@storybook/test";

const meta: Meta<typeof FormHeader> = {
  title: "Forms/FormHeader",
  component: FormHeader,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Main header title",
    },
    description: {
      control: "text",
      description: "Optional description text",
    },
    showBackButton: {
      control: "boolean",
      description: "Whether to show the back button",
    },
  },
  args: {
    onBack: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof FormHeader>;

export const Default: Story = {
  args: {
    title: "What's your natural travel rhythm?",
    description: "Select the option that matches you the most",
    showBackButton: true,
  },
};

export const WithProgress: Story = {
  args: {
    title: "Which travel style feels most like you?",
    description: "Select the option that matches you the most",
    showBackButton: true,
    rightElement: (
      <ProgressIndicator currentStep={2} totalSteps={4} showLabel />
    ),
  },
};

export const NoDescription: Story = {
  args: {
    title: "Complete Your Profile",
    showBackButton: true,
  },
};

export const NoBackButton: Story = {
  args: {
    title: "Welcome to TravelMate",
    description: "Let's get started with your travel preferences",
    showBackButton: false,
  },
};

export const LongContent: Story = {
  args: {
    title: "Tell us about your travel preferences and interests",
    description:
      "This information helps us personalize your experience and connect you with like-minded travelers around the world",
    showBackButton: true,
  },
};
