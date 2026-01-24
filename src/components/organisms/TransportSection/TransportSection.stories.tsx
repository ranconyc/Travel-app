import type { Meta, StoryObj } from "@storybook/react";
import TransportSection from "./index";
import React from "react";

const meta: Meta<typeof TransportSection> = {
  title: "Sections/Transport",
  component: TransportSection,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    city: {
      info: {
        gettingAround: [
          {
            name: "BTS Skytrain",
            note: "Best for avoiding traffic. Air-conditioned.",
            badge: { text: "Efficient" },
          },
          {
            name: "Grab Shop",
            note: "App-based rides. Convenient but prone to traffic.",
            badge: { text: "Popular" },
          },
          {
            name: "Tuk Tuk",
            note: "Cultural experience. Agree on price first.",
            badge: { text: "Iconic" },
          },
        ],
      },
    },
  },
};
