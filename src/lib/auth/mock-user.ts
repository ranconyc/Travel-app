import { User } from "@/domain/user/user.schema";

export const MOCK_USER: User = {
  id: "6934473a051c90d78eafec9f",
  email: "ranco.nyc@gmail.com",
  name: "Ran Cohen",
  firstName: "Ran",
  lastName: "Cohen",
  role: "ADMIN",
  image:
    "https://res.cloudinary.com/doshknz4q/image/upload/v1765092529/profiles/ran_cohen.jpg",
  occupation: "UX Designer",
  gender: "MALE",
  birthday: new Date("1991-09-06T00:00:00.000Z"),
  createdAt: new Date("2025-12-06T15:09:46.014Z"),
  updatedAt: new Date("2025-12-27T17:38:17.933Z"),
  profileCompleted: true,
  languages: ["en", "es", "he"],
  currentCityId: "6934b7f88d03ad851b62f6b5",
  homeBaseCityId: "6934b7f88d03ad851b62f6b5",
  currentLocation: {
    type: "Point",
    coordinates: [-122.419416, 37.774929],
  },
  trips: [],
  interests: [],
};
