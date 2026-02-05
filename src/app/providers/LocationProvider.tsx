"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "sonner";

interface Location {
  latitude: number;
  longitude: number;
}

interface LocationContextType {
  location: Location | null;
  error: string | null;
  isLoading: boolean;
  requestLocation: (silent?: boolean) => Promise<Location | null>;
  autoUpdateEnabled: boolean;
  setAutoUpdateEnabled: (enabled: boolean) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined,
);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(true);

  const requestLocation = async (silent = false): Promise<Location | null> => {
    setIsLoading(true);
    setError(null);

    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        const msg = "Geolocation is not supported by your browser";
        setError(msg);
        if (!silent) toast.error(msg);
        setIsLoading(false);
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setLocation(newLocation);
          setIsLoading(false);
          resolve(newLocation);
        },
        (err) => {
          let msg = "Unable to retrieve your location";
          if (err.code === err.PERMISSION_DENIED) {
            msg = "Location permission denied";
          }
          setError(msg);
          if (!silent) toast.error(msg);
          setIsLoading(false);
          resolve(null);
        },
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 },
      );
    });
  };

  // Auto-fetch location on mount if enabled
  useEffect(() => {
    if (autoUpdateEnabled) {
      // Silent fetch on mount (no error toasts)
      requestLocation(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  return (
    <LocationContext.Provider
      value={{
        location,
        error,
        isLoading,
        requestLocation,
        autoUpdateEnabled,
        setAutoUpdateEnabled,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
}
