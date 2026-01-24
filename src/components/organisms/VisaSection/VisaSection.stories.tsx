import type { Meta, StoryObj } from "@storybook/react";
import VisaSection from "./index";
import React from "react";

const meta: Meta<typeof VisaSection> = {
  title: "Sections/Visa",
  component: VisaSection,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    visaOnArrivalNote: "Free 30-60 day stamps for most Western countries.",
    passportValidityNote:
      "Must be valid for at least 6 months beyond arrival date.",
  },
};
