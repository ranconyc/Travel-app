import type { Meta, StoryObj } from "@storybook/react";
import ElectricitySection from "./index";

const meta: Meta<typeof ElectricitySection> = {
  title: "Organisms/ElectricitySection",
  component: ElectricitySection,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Universal: Story = {
  args: {
    voltage: "230V",
    frequencyHz: "50",
    plugs: ["Type C", "Type G"],
  },
};

export const USStandard: Story = {
  args: {
    voltage: "120V",
    frequencyHz: "60",
    plugs: ["Type A", "Type B"],
  },
};
