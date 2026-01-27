import type { Meta, StoryObj } from "@storybook/react";
import VisaRequirement, { VisaRequirement as VisaRequirementType } from "./index";

const meta: Meta<typeof VisaRequirement> = {
  title: "Molecules/VisaRequirement",
  component: VisaRequirement,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// E-Visa Required (Warning)
export const EVisaRequired: Story = {
  args: {
    visa: {
      type: "EVisa",
      allowedStay: "90 Days",
      status: "warning",
      title: "E-Visa Required",
      description: "Israeli passport holders need to apply for an e-visa before arrival.",
      cost: {
        amount: 35,
        currency: "USD"
      },
      processingTime: "3-5 Business Days",
      officialLink: "https://official-visa-gov.th",
      documentsRequired: [
        "Valid Passport (6 months)",
        "Return Flight Ticket",
        "Proof of Accommodation"
      ],
      notes: "Ensure you have a printed copy of your approved E-Visa."
    }
  }
};

// Visa-Free (Success)
export const VisaFree: Story = {
  args: {
    visa: {
      type: "VisaFree",
      allowedStay: "6 Months",
      status: "success",
      title: "Visa-Free Travel",
      description: "Israeli passport holders can visit visa-free for up to 6 months for tourism.",
      documentsRequired: [
        "Valid Passport (6 months)",
        "Proof of Sufficient Funds",
        "Return Ticket"
      ],
      notes: "Cannot work or study during visa-free stay."
    }
  }
};

// Visa Required (Error)
export const VisaRequired: Story = {
  args: {
    visa: {
      type: "VisaRequired",
      allowedStay: "90 Days",
      status: "error",
      title: "Visa Required",
      description: "Israeli passport holders need to apply for a visitor visa before travel.",
      cost: {
        amount: 185,
        currency: "USD"
      },
      processingTime: "2-4 Weeks",
      officialLink: "https://ustraveldocs.com",
      documentsRequired: [
        "Valid Passport (6 months)",
        "DS-160 Form",
        "Passport Photos",
        "Proof of Financial Support",
        "Travel Itinerary"
      ],
      notes: "Interview at US Embassy required."
    }
  }
};

// Information Only
export const InformationOnly: Story = {
  args: {
    visa: {
      type: "Info",
      allowedStay: "30 Days",
      status: "info",
      title: "Visa on Arrival",
      description: "Visa can be obtained upon arrival at the airport for tourism purposes.",
      cost: {
        amount: 25,
        currency: "USD"
      },
      documentsRequired: [
        "Valid Passport (6 months)",
        "Passport Photos (2x2)",
        "Proof of Funds"
      ],
      notes: "Available at major international airports only."
    }
  }
};
