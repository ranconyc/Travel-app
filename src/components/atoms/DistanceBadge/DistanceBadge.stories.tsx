import type { Meta, StoryObj } from "@storybook/react";
import DistanceBadge from "./index";

const meta: Meta<typeof DistanceBadge> = {
  title: "Components/DistanceBadge",
  component: DistanceBadge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    distanceLabel: "2.5 km away",
  },
};

export const LongDistance: Story = {
  args: {
    distanceLabel: "~ 12 Hrs Away",
  },
};
