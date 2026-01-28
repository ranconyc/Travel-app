import type { Meta, StoryObj } from "@storybook/react";
import FormHeader from "./index";

const meta: Meta<typeof FormHeader> = {
  title: "Molecules/FormHeader",
  component: FormHeader,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Form title",
    },
    description: {
      control: "text",
      description: "Form description",
    },
    showBackButton: {
      control: "boolean",
      description: "Whether to show back button",
    },
    onBack: { action: "back-clicked" },
    rightElement: {
      control: "text",
      description: "Element to show on the right side",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Create Profile",
    description: "Tell us about yourself to personalize your experience",
    onBack: () => {},
  },
};

export const NoDescription: Story = {
  args: {
    title: "Basic Information",
    showBackButton: true,
    onBack: () => {},
  },
};

export const NoBackButton: Story = {
  args: {
    title: "Review & Submit",
    description: "Please review your information before submitting",
    showBackButton: false,
  },
};

export const WithRightElement: Story = {
  args: {
    title: "Step 3 of 5",
    description: "Add your travel preferences",
    showBackButton: true,
    rightElement: <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm">Skip</button>,
    onBack: () => {},
  },
};

export const LongTitle: Story = {
  args: {
    title: "Complete Your Travel Profile for Better Recommendations",
    description: "This information helps us find the perfect travel matches for you",
    onBack: () => {},
  },
};
