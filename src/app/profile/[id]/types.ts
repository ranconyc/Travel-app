import { User } from "@prisma/client";

export type ProfileUser = User & {
  languages: string[];
  homeBaseCity: {
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
