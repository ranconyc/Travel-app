"use client";

import { useState, useEffect } from "react";
import { getAllStatesAction } from "@/domain/state/state.actions";
import HeaderWrapper from "@/components/molecules/Header";
import Typography from "@/components/atoms/Typography";
import Input from "@/components/atoms/Input";
import { Search } from "lucide-react";
import DestinationCard from "@/components/molecules/DestinationCard";
import Loader from "@/components/atoms/Loader";
import { useDebounce } from "@/domain/shared/utils/useDebounce";

interface State {
  id?: string;
  name: string;
  type?: string | null;
  country: {
    name: string;
    cca3: string;
  };
  _count: {
    cities: number;
  };
}

interface StateIndexClientProps {
  initialStates: State[];
}

export default function StateIndexClient({
  initialStates,
}: StateIndexClientProps) {
  const [states, setStates] = useState<State[]>(initialStates);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    const fetchStates = async () => {
      // Don't fetch if search is empty and we already have initial states
      // BUT, if we clear search, we might want to reset to initial...
      // Let's simplified: if searchTerm changes (even to empty), we fetch.
      // Optimization: If empty, we can just use initialStates if we haven't mutated them?
      // For simplicity and consistency, let's fetch when search is active or cleared.
      // However, to avoid double fetch on mount (debouncedSearch starts empty),
      // we need to skip if debouncedSearch is empty AND we haven't searched yet.
      // Actually, standard pattern:

      if (debouncedSearch === "" && states === initialStates) return;

      setLoading(true);
      try {
        const result = await getAllStatesAction({
          search: debouncedSearch,
          limit: 50,
        });
        if (result.success && "data" in result) {
          setStates(result.data as unknown as State[]);
        }
      } catch (error) {
        console.error("Failed to fetch states:", error);
      } finally {
        setLoading(false);
      }
    };

    // Only run effect if search term changes from initial
    if (debouncedSearch !== "") {
      fetchStates();
    } else if (states !== initialStates) {
      // Reset to initial if search is cleared
      setStates(initialStates);
    }

    // ESLint compliance: we ideally want to ignore the dependency on initialStates if stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  return (
    <div className="min-h-screen bg-main pb-20">
      <HeaderWrapper backButton className="sticky top-0 z-50">
        <div className="mt-md">
          <Typography variant="tiny" className="font-medium tracking-wider">
            Explore Regions
          </Typography>
          <Typography variant="h1" className="mt-1 mb-6 w-fit capitalize">
            States & Provinces
          </Typography>
          <div className="relative">
            <Input
              placeholder="Search states, provinces, or regions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary w-4 h-4" />
          </div>
        </div>
      </HeaderWrapper>

      <main className="p-md mt-md">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-md">
            <Loader />
            <Typography color="sec" className="animate-pulse">
              Loading regions...
            </Typography>
          </div>
        ) : states.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-md">
            {states.map((state) => (
              <DestinationCard
                key={state.id || state.name}
                href="#" // Placeholder
                title={state.name}
                subtitle={`${state.country.name} • ${state._count.cities} cities`}
                aspectRatio="aspect-video"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-surface p-6 rounded-full mb-md shadow-sm border border-surface-secondary">
              <Search className="w-10 h-10 text-secondary opacity-20" />
            </div>
            <Typography variant="h3" className="w-fit capitalize">
              No regions found
            </Typography>
            <Typography color="sec" className="max-w-[240px] mt-2">
              Try adjusting your search criteria.
            </Typography>
          </div>
        )}
      </main>
    </div>
  );
}
