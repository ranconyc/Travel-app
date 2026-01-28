import type { Meta, StoryObj } from "@storybook/react";
import Stats from "./index";
import { Globe2, Users, MapPin } from "lucide-react";
import React from "react";

const meta: Meta<typeof Stats> = {
  title: "Molecules/Stats",
  component: Stats,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const MOCK_STATS = [
  { value: "~ 12 Hrs", label: "Away", icon: Globe2 },
  { value: "5.2M", label: "People", icon: Users },
  { value: "1,500 km²", label: "Area", icon: MapPin },
];

export const Default: Story = {
  args: {
    stats: MOCK_STATS,
  },
};

export const NoDividers: Story = {
  args: {
    stats: MOCK_STATS,
    showDividers: false,
  },
};
