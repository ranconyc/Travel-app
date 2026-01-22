import { create } from "zustand";
import { City } from "@/domain/city/city.schema";

interface CityState {
  city: City | null;
  isLoading: boolean;
  actions: {
    setCity: (city: City) => void;
    setIsLoading: (loading: boolean) => void;
  };
}

export const useCityStore = create<CityState>((set) => ({
  city: null,
  isLoading: false,
  actions: {
    setCity: (city) => set({ city }),
    setIsLoading: (loading) => set({ isLoading: loading }),
  },
}));

export const useCity = () => useCityStore((state) => state.city);
export const useCityIsLoading = () => useCityStore((state) => state.isLoading);
export const useCityActions = () => useCityStore((state) => state.actions);
