import type { Meta, StoryObj } from "@storybook/react";
import { CountryItem } from "./index";

const meta: Meta<typeof CountryItem> = {
  title: "Atoms/CountryItem",
  component: CountryItem,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    code: {
      control: "text",
      description: "Country code (e.g., 'US', 'GB')",
    },
    label: {
      control: "text",
      description: "Country name to display",
    },
    flag: {
      control: "text",
      description: "Flag emoji or icon",
    },
    isSelected: {
      control: "boolean",
      description: "Whether the country is selected",
    },
    isPopular: {
      control: "boolean",
      description: "Whether to show popular badge",
    },
    onChange: { action: "changed" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    code: "US",
    label: "United States",
    flag: "🇺🇸",
    isSelected: false,
    isPopular: false,
    onChange: () => {},
  },
};

export const Selected: Story = {
  args: {
    code: "GB",
    label: "United Kingdom",
    flag: "🇬🇧",
    isSelected: true,
    isPopular: false,
    onChange: () => {},
  },
};

export const Popular: Story = {
  args: {
    code: "JP",
    label: "Japan",
    flag: "🇯🇵",
    isSelected: false,
    isPopular: true,
    onChange: () => {},
  },
};

export const SelectedAndPopular: Story = {
  args: {
    code: "FR",
    label: "France",
    flag: "🇫🇷",
    isSelected: true,
    isPopular: true,
    onChange: () => {},
  },
};

export const LongName: Story = {
  args: {
    code: "UA",
    label: "United Arab Emirates",
    flag: "🇦🇪",
    isSelected: false,
    isPopular: false,
    onChange: () => {},
  },
};
