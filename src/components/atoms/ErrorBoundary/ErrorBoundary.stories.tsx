import type { Meta, StoryObj } from "@storybook/react";
import { ErrorBoundary, withErrorBoundary } from "./index";

// A component that throws an error for testing
const ThrowingComponent = ({ shouldThrow = false }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error("This is a test error!");
  }
  return <div>No error occurred</div>;
};

// A component wrapped with the HOC
const WrappedComponent = withErrorBoundary(ThrowingComponent, "TestComponent");

const meta: Meta<typeof ErrorBoundary> = {
  title: "Atoms/ErrorBoundary",
  component: ErrorBoundary,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    componentName: {
      control: "text",
      description: "Name of the component for error reporting",
    },
    onReset: { action: "reset" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    children: <div>Normal content without errors</div>,
  },
};

export const WithError: Story = {
  args: {
    componentName: "TestComponent",
    children: <ThrowingComponent shouldThrow />,
  },
};

export const WithCustomFallback: Story = {
  args: {
    children: <ThrowingComponent shouldThrow />,
    fallback: (
      <div className="p-4 bg-yellow-100 border border-yellow-300 rounded">
        <p>Custom fallback: Something went wrong!</p>
      </div>
    ),
  },
};

export const WithResetHandler: Story = {
  args: {
    componentName: "ResetTestComponent",
    children: <ThrowingComponent shouldThrow />,
    onReset: () => console.log("Custom reset handler called"),
  },
};

export const WrappedComponentStory: Story = {
  render: () => <WrappedComponent shouldThrow />,
  parameters: {
    docs: {
      description: {
        story: "Using the withErrorBoundary HOC wrapper",
      },
    },
  },
};
