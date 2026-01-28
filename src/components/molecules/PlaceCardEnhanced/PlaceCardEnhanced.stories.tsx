import type { Meta, StoryObj } from "@storybook/react";
import PlaceCardEnhanced from "./index";

const meta: Meta<typeof PlaceCardEnhanced> = {
  title: "Molecules/PlaceCardEnhanced",
  component: PlaceCardEnhanced,
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
