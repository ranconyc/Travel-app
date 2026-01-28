import type { Meta, StoryObj } from "@storybook/react";
import PassportStamp from "./index";

const meta: Meta<typeof PassportStamp> = {
  title: "Molecules/PassportStamp",
  component: PassportStamp,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    city: "Bangkok",
    country: "Thailand",
    date: "23 JAN 2026",
    index: 0,
  },
};

export const Large: Story = {
  args: {
    city: "Paris",
    country: "France",
    date: "15 AUG 2025",
    index: 1,
    size: "lg",
  },
};

export const XLarge: Story = {
  args: {
    city: "Tokyo",
    country: "Japan",
    date: "05 MAY 2026",
    index: 4,
    size: "xl",
  },
};

export const NoDate: Story = {
  args: {
    city: "Berlin",
    country: "Germany",
    index: 2,
  },
};

export const CustomColor: Story = {
  args: {
    city: "New York",
    country: "USA",
    index: 3,
    color: "#3F53FF",
  },
};
