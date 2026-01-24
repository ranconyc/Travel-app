import type { Meta, StoryObj } from "@storybook/react";
import ErrorMessage from "./index";

const meta: Meta<typeof ErrorMessage> = {
  title: "Form/ErrorMessage",
  component: ErrorMessage,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: "error-1",
    error: "This field is required",
  },
};

export const Hidden: Story = {
  args: {
    id: "error-2",
  },
};
