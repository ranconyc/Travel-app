import type { Meta, StoryObj } from "@storybook/react";
import { CityStamp, stampStyles } from "./index";
import { Plane, Train, Car, Ship, MapPin } from "lucide-react";

const meta: Meta<typeof CityStamp> = {
  title: "Molecules/CityStamp",
  component: CityStamp,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: stampStyles,
    },
    date: { control: "text" },
    cityName: { control: "text" },
    countryName: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof CityStamp>;

export const Default: Story = {
  args: {
    cityName: "Paris",
    countryName: "France",
    date: "2024",
    variant: "circle",
  },
};

export const WithIcon: Story = {
  args: {
    cityName: "Tokyo",
    countryName: "Japan",
    date: "2025",
    variant: "hexagon",
    icon: <Plane size={16} />,
  },
};

export const AllGeometric: Story = {
  render: () => (
    <div className="flex flex-wrap gap-8 justify-center items-center max-w-4xl">
      <CityStamp
        cityName="London"
        countryName="UK"
        variant="circle"
        icon={<Train size={14} />}
      />
      <CityStamp
        cityName="N. York"
        countryName="USA"
        variant="square"
        icon={<Car size={14} />}
      />
      <CityStamp
        cityName="Berlin"
        countryName="Ger"
        variant="triangle-red"
        icon={<MapPin size={14} />}
      />
      <CityStamp cityName="Rome" countryName="Italy" variant="octagon" />
      <CityStamp
        cityName="Cairo"
        countryName="Egypt"
        variant="pentagon-orange"
      />
    </div>
  ),
};

export const ThematicStyles: Story = {
  render: () => (
    <div className="flex flex-wrap gap-8 justify-center items-center max-w-4xl">
      <CityStamp
        cityName="Kyoto"
        countryName="Japan"
        variant="nature-flower-pink"
        date="Sakura"
      />
      <CityStamp
        cityName="Sydney"
        countryName="Aus"
        variant="ocean-wave-blue"
        icon={<Ship size={14} />}
      />
      <CityStamp
        cityName="Houston"
        countryName="USA"
        variant="space-rocket-red"
        date="Launch"
      />
      <CityStamp cityName="Seattle" countryName="USA" variant="cloud-sky" />
    </div>
  ),
};

export const RetroCollection: Story = {
  render: () => (
    <div className="flex flex-wrap gap-8 justify-center items-center p-8 bg-amber-50 rounded-lg">
      <CityStamp
        cityName="Havana"
        countryName="Cuba"
        variant="retro-ticket-1"
        date="1950"
      />
      <CityStamp
        cityName="Mumbai"
        countryName="India"
        variant="retro-badge-1"
        date="1980"
      />
      <CityStamp
        cityName="Austin"
        countryName="USA"
        variant="retro-ticket-2"
        date="2023"
      />
    </div>
  ),
};
