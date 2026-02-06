import type { Meta, StoryObj } from "@storybook/react";
import VisaStatusChecker from "./index";

const meta: Meta<typeof VisaStatusChecker> = {
  title: "Molecules/VisaStatusChecker",
  component: VisaStatusChecker,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockVisaBase = {
  type: "Visa",
  status: "warning" as const,
  title: "Visa Rules",
  description: "General rules",
  cost: {
    amount: 50,
    currency: "USD",
  },
  stay: "90/180 Days",
  processingTime: "4-96 Hours",
  officialLink: "https://example.com/apply",
  documentsRequired: [
    "Biometric Passport",
    "Travel Insurance",
    "Financial Proof",
  ],
  notes: "Covers all member countries. Processing times may vary.",
};

export const VisaRequired: Story = {
  args: {
    visa: mockVisaBase,
    destinationCountryName: "France",
    passportCountry: "Israel",
    userStatus: {
      type: "warning",
      label: "Visa is Required",
      description: "You must apply for a visa before travel.",
      color: "orange",
    },
  },
};

export const VisaFree: Story = {
  args: {
    visa: {
      ...mockVisaBase,
      status: "success",
      cost: undefined,
      officialLink: undefined,
      documentsRequired: ["Valid Passport"],
      notes: "Enjoy your stay!",
    },
    destinationCountryName: "Germany",
    passportCountry: "Israel",
    userStatus: {
      type: "success",
      label: "Visa Free",
      description: "You can enter without a visa.",
      color: "green",
    },
  },
};

export const EVisaRequired: Story = {
  args: {
    visa: {
      ...mockVisaBase,
      status: "info",
      type: "e-Visa",
      cost: { amount: 20, currency: "USD" },
    },
    destinationCountryName: "Turkey",
    passportCountry: "Israel",
    userStatus: {
      type: "unknown",
      label: "e-Visa Required",
      description: "Apply online before flying.",
      color: "blue",
    },
  },
};

export const Restricted: Story = {
  args: {
    visa: {
      ...mockVisaBase,
      status: "error",
    },
    destinationCountryName: "North Korea",
    passportCountry: "USA",
    userStatus: {
      type: "restricted",
      label: "Entry Restricted",
      description: "Non-essential travel is prohibited.",
      color: "red",
    },
  },
};

export const Blacklisted: Story = {
  args: {
    visa: {
      ...mockVisaBase,
      status: "error",
    },
    destinationCountryName: "Conflict Zone",
    passportCountry: "USA",
    userStatus: {
      type: "error",
      label: "Travel Ban",
      description: "Your passport is currently banned from entry.",
      color: "black",
    },
  },
};

export const GeneralVisaInfo: Story = {
  args: {
    visa: mockVisaBase,
    destinationCountryName: "France",
    // No passportCountry or userStatus passed here
  },
};
