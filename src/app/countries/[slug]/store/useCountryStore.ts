import { create } from "zustand";
import { Country } from "@/domain/country/country.schema";

interface CountryState {
  country: Country | null;
  isLoading: boolean;
  actions: {
    setCountry: (country: Country) => void;
    setIsLoading: (loading: boolean) => void;
  };
}

export const useCountryStore = create<CountryState>((set) => ({
  country: null,
  isLoading: false,
  actions: {
    setCountry: (country) => set({ country }),
    setIsLoading: (loading) => set({ isLoading: loading }),
  },
}));

export const useCountry = () => useCountryStore((state) => state.country);
export const useCountryIsLoading = () =>
  useCountryStore((state) => state.isLoading);
export const useCountryActions = () =>
  useCountryStore((state) => state.actions);
