import type { Meta, StoryObj } from "@storybook/react";
import MateCard from "./index";
import { User, Gender, Role } from "@/domain/user/user.schema";

const meta: Meta<typeof MateCard> = {
  title: "Molecules/MateCard",
  component: MateCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    priority: false,
  },
};

export default meta;
type Story = StoryObj<typeof MateCard>;

const mockUser: User = {
  id: "user-1",
  email: "test@example.com",
  name: "Sarah Jenkins",
  role: "USER" as Role,
  emailVerified: new Date(),
  profileCompleted: true,
  avatarUrl: "https://i.pravatar.cc/150?u=user-1",
  currentCityId: "city-1",
  media: [],
  profile: {
    firstName: "Sarah",
    lastName: "Jenkins",
    homeBaseCityId: "city-1",
    gender: "FEMALE" as Gender,
    occupation: "Digital Nomad",
    birthday: new Date("1995-01-01"),
    description: "Loves travel and coffee",
    languages: ["English", "Spanish"],
    persona: {
      interests: ["Hiking", "Photography", "Coffee"],
    },
  },
};

const mockLoggedUser: User = {
  ...mockUser,
  id: "logged-user",
};

export const Default: Story = {
  args: {
    mate: {
      ...mockUser,
      match: { score: 85 },
    },
    loggedUser: mockLoggedUser,
  },
};

export const NoInterests: Story = {
  args: {
    mate: {
      ...mockUser,
      id: "user-2",
      profile: {
        ...mockUser.profile,
        firstName: "Mike",
        lastName: "Ross",
        persona: { interests: [] },
      },
      match: { score: 40 },
    },
    loggedUser: mockLoggedUser,
  },
};

export const Visitor: Story = {
  args: {
    mate: {
      ...mockUser,
      id: "user-3",
      currentCityId: "city-2", // Different from homeBase (city-1)
      match: { score: 92 },
    },
    loggedUser: mockLoggedUser,
  },
};

export const Loading: Story = {
  render: () => (
    <div className="w-full max-w-xs h-64 bg-gray-200 animate-pulse rounded-lg" />
  ),
};
