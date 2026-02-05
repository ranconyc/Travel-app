import type { Meta, StoryObj } from "@storybook/react";
import HomeHeader from "./index";
import { UserProvider } from "@/app/providers/UserProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLocationStore } from "@/store/locationStore";
import { useEffect } from "react";
import { User } from "@/domain/user/user.schema";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
    },
  },
});

// Mock Data
const mockHomeCity = {
  id: "city-123",
  cityId: "nyc",
  name: "New York",
  countryRefId: "usa",
  imageHeroUrl: null,
};

const mockParisCity = {
  id: "city-456",
  cityId: "paris",
  name: "Paris",
  countryRefId: "fra",
  imageHeroUrl: null,
};

const baseUser: User = {
  id: "user-1",
  email: "test@example.com",
  role: "USER",
  name: "Ran Cohen",
  emailVerified: new Date(),
  avatarUrl: null,
  profileCompleted: true,
  currentLocation: { lat: 40.7128, lng: -74.006 },
  currentCityId: "city-123",
  currentCity: mockHomeCity,
  profile: {
    id: "profile-1",
    userId: "user-1",
    firstName: "Ran",
    lastName: "Cohen",
    occupation: null,
    birthday: null,
    description: null,
    gender: null,
    languages: [],
    homeBaseCityId: "city-123",
    homeBaseCity: mockHomeCity,
    persona: null,
    socials: null,
    updatedAt: new Date(),
  },
  media: [],
  visitedCountries: [],
  createdAt: new Date(),
};

// Location Sync Decorator
const LocationDecorator = (Story: any, context: any) => {
  const { args } = context;
  const { setDbLocation, reset } = useLocationStore();

  useEffect(() => {
    reset(); // Reset store
    if (args.user?.currentCity) {
      const user = args.user as User;
      if (user.currentCity) {
        setDbLocation(
          { lat: 0, lng: 0 }, // Dummy coords, we care about city
          user.currentCity.id,
        );
        // Manually set current city as setDbLocation calculates it async or needs more data
        useLocationStore.setState({
          currentCity: user.currentCity.name,
          currentCityId: user.currentCity.id,
          dbCoords: { lat: 0, lng: 0 },
        });
      }
    }
  }, [args.user, setDbLocation, reset]);

  return <Story />;
};

const meta: Meta<typeof HomeHeader> = {
  title: "Organisms/HomeHeader",
  component: HomeHeader,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story, context) => (
      <QueryClientProvider client={queryClient}>
        <UserProvider user={context.args.user as User}>
          <Story />
        </UserProvider>
      </QueryClientProvider>
    ),
    LocationDecorator,
  ],
};

export default meta;
type Story = StoryObj<typeof HomeHeader & { user: User }>;

export const AtHome: Story = {
  args: {
    user: baseUser,
  },
};

export const Traveling: Story = {
  args: {
    user: {
      ...baseUser,
      currentCityId: mockParisCity.id,
      currentCity: mockParisCity,
    },
  },
};

export const NoHomeBase: Story = {
  args: {
    user: {
      ...baseUser,
      profile: {
        ...baseUser.profile!,
        homeBaseCityId: null,
        homeBaseCity: null,
      },
      currentCityId: mockParisCity.id,
      currentCity: mockParisCity,
    },
  },
};
