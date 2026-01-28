import type { Meta, StoryObj } from "@storybook/react";
import CityCardEnhanced from "./index";

const meta: Meta<typeof CityCardEnhanced> = {
  title: "Molecules/CityCardEnhanced",
  component: CityCardEnhanced,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    // Add argTypes based on the component's props
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
