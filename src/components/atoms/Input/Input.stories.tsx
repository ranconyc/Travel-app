import type { Meta, StoryObj } from "@storybook/react";
import Input from "./index";

const meta: Meta<typeof Input> = {
  title: "Form/Input",
  component: Input,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Full Name",
    placeholder: "e.g. Ran Cohen",
  },
};

export const WithHint: Story = {
  args: {
    label: "Password",
    type: "password",
    hintText: "Minimum 8 characters with numbers.",
  },
};

export const Error: Story = {
  args: {
    label: "Email Address",
    defaultValue: "ran@invalid",
    error: "Please enter a valid email address.",
  },
};

export const Disabled: Story = {
  args: {
    label: "Username",
    disabled: true,
    value: "@rancohen",
  },
};
