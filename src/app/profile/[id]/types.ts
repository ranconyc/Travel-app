// import { User, UserProfile, UserMedia } from "@prisma/client";
import { City } from "@/domain/city/city.schema";
import { User, UserMedia } from "@prisma/client";

export interface UserProfile {
  id: string;
  userId: string;
  user: User; // Ensure 'User' is defined elsewhere

  firstName: string;
  lastName: string;
  occupation: string;
  birthday: string;
  description: string;
  gender: string;

  languages: string[];

  homeBaseCityId: string;
  homeBaseCity: City;

  persona: {
    dailyRhythm: string;
    travelStyle: string;
    interest: { [key: string]: string[] };
  };

  socials: { [key: string]: string }; // Map of social platform names to URLs
}

export type ProfileUser = User & {
  profile:
    | (UserProfile & {
        homeBaseCity: {
          id: string;
          name: string;
          country: {
            id: string;
            name: string;
          } | null;
        } | null;
      })
    | null;
  images: UserMedia[];
  currentCity: {
    id: string;
    name: string;
    country: {
      id: string;
      name: string;
    } | null;
  } | null;
  visitedCities: {
    city: {
      id: string;
      name: string;
      country: {
        id: string;
        name: string;
      } | null;
    };
  }[];
  wishListCities: {
    city: {
      id: string;
      name: string;
      country: {
        id: string;
        name: string;
      } | null;
    };
  }[];
  interests: {
    interest: {
      id: string;
      label: string;
      slug: string;
    };
  }[];
};
