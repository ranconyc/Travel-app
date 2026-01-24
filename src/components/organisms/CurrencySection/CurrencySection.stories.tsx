import type { Meta, StoryObj } from "@storybook/react";
import CurrencySection from "./index";
import React from "react";

const meta: Meta<typeof CurrencySection> = {
  title: "Sections/Currency",
  component: CurrencySection,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "Thai Baht",
    symbol: "฿",
    code: "THB",
    paymentMethodsNote:
      "Cash is king. Credit cards accepted in major malls and luxury hotels.",
  },
};
