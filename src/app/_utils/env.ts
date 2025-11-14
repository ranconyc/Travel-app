export const isBrowser = () =>
  typeof window !== "undefined" && typeof document !== "undefined";

export const hasNavigator = () =>
  isBrowser() && typeof navigator !== "undefined";

export const hasGeolocation = () =>
  hasNavigator() && "geolocation" in navigator;
