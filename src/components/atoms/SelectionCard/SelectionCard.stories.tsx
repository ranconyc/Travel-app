import type { Meta, StoryObj } from "@storybook/react";
import SelectionCard from "./index";
import { Plane, Compass, Heart } from "lucide-react";
import React from "react";

const meta: Meta<typeof SelectionCard> = {
  title: "Atoms/SelectionCard",
  component: SelectionCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Radio: Story = {
  args: {
    id: "adventure",
    type: "radio",
    label: "Adventure",
    description: "Seeking thrills and outdoors.",
    icon: <Compass size={24} />,
    isSelected: false,
  },
};

export const SelectedCheckbox: Story = {
  args: {
    id: "flights",
    type: "checkbox",
    label: "Direct Flights Only",
    description: "Only show non-stop routes.",
    icon: <Plane size={24} />,
    isSelected: true,
  },
};

export const MultiLine: Story = {
  args: {
    id: "social",
    label: "Social Hubs",
    description:
      "Connect with other travelers in the same city and share experiences together.",
    icon: <Heart size={24} />,
    isSelected: false,
  },
};

export const RadioNoIcon: Story = {
  args: {
    id: "radio-no-icon",
    type: "radio",
    label: "Radio Option",
    description: "Standard radio selection without icon.",
    isSelected: false,
  },
};

export const CheckboxNoIcon: Story = {
  args: {
    id: "checkbox-no-icon",
    type: "checkbox",
    label: "Checkbox Option",
    description: "Standard checkbox selection without icon.",
    isSelected: true,
  },
};
