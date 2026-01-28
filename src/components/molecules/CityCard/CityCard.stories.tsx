import type { Meta, StoryObj } from "@storybook/react";
import CityCard from "./index";

const meta: Meta<typeof CityCard> = {
  title: "Molecules/CityCard",
  component: CityCard,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    city: {
      control: "object",
      description: "City data object",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockCity = {
  cityId: "paris-1",
  name: "Paris",
  imageHeroUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=400",
  country: {
    name: "France",
    code: "FR",
  },
};

export const Default: Story = {
  args: {
    city: mockCity,
  },
};

export const NoImage: Story = {
  args: {
    city: {
      ...mockCity,
      imageHeroUrl: null,
    },
  },
};

export const NoCountry: Story = {
  args: {
    city: {
      cityId: "unknown-1",
      name: "Unknown City",
      imageHeroUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=400",
      country: null,
    },
  },
};

export const LongName: Story = {
  args: {
    city: {
      cityId: "sf-1",
      name: "San Francisco",
      imageHeroUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=400",
      country: {
        name: "United States",
        code: "US",
      },
    },
  },
};
