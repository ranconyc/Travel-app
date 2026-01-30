import type { Meta, StoryObj } from "@storybook/react";
import ContinentCard from "./index";

const meta: Meta<typeof ContinentCard> = {
  title: "Molecules/ContinentCard",
  component: ContinentCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ContinentCard>;

export const Europe: Story = {
  args: {
    continent: {
      name: "Europe",
      slug: "europe",
      color: "from-blue-600 to-indigo-800",
      icon: "🇪🇺",
    },
  },
};

export const Asia: Story = {
  args: {
    continent: {
      name: "Asia",
      slug: "asia",
      color: "from-red-600 to-amber-700",
      icon: "🥢",
    },
  },
};

export const Africa: Story = {
  args: {
    continent: {
      name: "Africa",
      slug: "africa",
      color: "from-orange-600 to-yellow-800",
      icon: "🦁",
    },
  },
};

export const Americas: Story = {
  args: {
    continent: {
      name: "Americas",
      slug: "americas",
      color: "from-green-600 to-teal-800",
      icon: "🏔️",
    },
  },
};

export const Oceania: Story = {
  args: {
    continent: {
      name: "Oceania",
      slug: "oceania",
      color: "from-cyan-500 to-blue-600",
      icon: "🏝️",
    },
  },
};

export const GridView: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl p-4">
      <ContinentCard
        continent={{
          name: "Europe",
          slug: "europe",
          color: "from-blue-600 to-indigo-800",
          icon: "🇪🇺",
        }}
      />
      <ContinentCard
        continent={{
          name: "Asia",
          slug: "asia",
          color: "from-red-600 to-amber-700",
          icon: "🥢",
        }}
      />
    </div>
  ),
};
