import type { Meta, StoryObj } from "@storybook/react";
import PlaceCard from "./index";

const mockPlace = {
  id: "place-1",
  placeId: "tokyo-skytree",
  name: "Tokyo Skytree",
  type: "landmark",
  tags: ["landmark", "viewpoint", "culture"],
  rating: 4.8,
  priceLevel: 3,
  location: {
    type: "Point",
    coordinates: [139.8107, 35.7101],
  },
  address: "Sumida, Tokyo, Japan",
  cityId: "jp-tokyo",
  slug: "tokyo-skytree",
  imageHeroUrl:
    "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&q=80&w=800",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const meta: Meta<typeof PlaceCard> = {
  title: "Molecules/PlaceCard",
  component: PlaceCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PlaceCard>;

export const Default: Story = {
  args: {
    place: mockPlace,
  },
};

export const WithMatchScore: Story = {
  args: {
    place: mockPlace,
    userPersona: {
      interests: ["landmark", "viewpoint"],
      budget: "$$$",
      travelStyle: ["sightseeing"],
    },
  },
};

export const WithDistance: Story = {
  args: {
    place: mockPlace,
    distance: 2.5,
  },
};

export const GridView: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl p-4 h-[400px]">
      <PlaceCard
        place={{
          ...mockPlace,
          name: "Skytree",
          imageHeroUrl:
            "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&q=80&w=400",
        }}
      />
      <PlaceCard
        place={{
          ...mockPlace,
          name: "Senso-ji",
          imageHeroUrl:
            "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&q=80&w=400",
          tags: ["temple", "culture"],
        }}
        userPersona={{
          interests: ["culture"],
          budget: "$$",
        }}
        distance={1.2}
      />
      <PlaceCard
        place={{
          ...mockPlace,
          name: "Shibuya Crossing",
          imageHeroUrl:
            "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=400",
          tags: ["modern", "city"],
        }}
        distance={3.8}
      />
    </div>
  ),
};
