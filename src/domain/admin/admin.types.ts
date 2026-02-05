export type AdminDashboardStats = {
  totalUsers: number;
  activeUsers: number;
  totalCities: number;
  totalCountries: number;
};

export type TopCity = {
  cityId: string;
  name: string;
  country: string;
  countryCode: string;
  visitors: number;
};

export type LatestUser = {
  id: string;
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
  createdAt: Date;
};

export type Timeframe = "today" | "week" | "month" | "all";

export type TopSearchItem = {
  query: string;
  count: number;
};
