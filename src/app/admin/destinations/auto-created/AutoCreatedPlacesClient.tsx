"use client";

import { useState } from "react";
import { Search, Check, X, AlertTriangle, Clock, MapPin } from "lucide-react";
import { updatePlaceAction } from "@/domain/place/place.actions";
import { useRouter } from "next/navigation";

type Props = {
  places: any[];
};

export default function AutoCreatedPlacesClient({ places }: Props) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "needsReview" | "verified">("all");
  const [selectedPlaces, setSelectedPlaces] = useState<Set<string>>(new Set());
  const [verifying, setVerifying] = useState(false);
  const [verifiedCount, setVerifiedCount] = useState(0);

  const filteredPlaces = places.filter((place) => {
    const matchesSearch = 
      (place.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (place.address || "").toLowerCase().includes(search.toLowerCase()) ||
      (place.tags || []).some((tag: string) => tag.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = 
      filterStatus === "all" ||
      (filterStatus === "needsReview" && place.needsReview) ||
      (filterStatus === "verified" && !place.needsReview);

    return matchesSearch && matchesStatus;
  });

  const handleVerifySelected = async () => {
    if (selectedPlaces.size === 0) return;

    setVerifying(true);
    let verified = 0;

    try {
      // Verify each selected place
      for (const placeId of selectedPlaces) {
        await updatePlaceAction({
          id: placeId,
          data: {
            needsReview: false,
            autoCreated: false // Mark as manually verified
          }
        });
        verified++;
      }

      setVerifiedCount(verified);
      setSelectedPlaces(new Set());
    } catch (error) {
      console.error("Error verifying places:", error);
    } finally {
      setVerifying(false);
    }
  };

  const handleRejectSelected = async () => {
    if (selectedPlaces.size === 0) return;

    setVerifying(true);
    let rejected = 0;

    try {
      // Reject each selected place (you might want to delete them instead)
      for (const placeId of selectedPlaces) {
        await updatePlaceAction({
          id: placeId,
          data: {
            needsReview: true,
            autoCreated: true // Keep as autoCreated but mark as rejected
          }
        });
        rejected++;
      }

      setVerifiedCount(-rejected);
      setSelectedPlaces(new Set());
    } catch (error) {
      console.error("Error rejecting places:", error);
    } finally {
      setVerifying(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedPlaces.size === filteredPlaces.length) {
      setSelectedPlaces(new Set());
    } else {
      setSelectedPlaces(new Set(filteredPlaces.map(place => place.id)));
    }
  };

  const stats = {
    total: places.length,
    needsReview: places.filter(p => p.needsReview).length,
    verified: places.filter(p => !p.needsReview).length,
    selected: selectedPlaces.size
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface border border-surface-secondary/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-secondary">Total Places</span>
            <MapPin className="w-4 h-4 text-brand" />
          </div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </div>
        
        <div className="bg-surface border border-surface-secondary/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-secondary">Needs Review</span>
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
          </div>
          <div className="text-2xl font-bold text-yellow-600">{stats.needsReview}</div>
        </div>
        
        <div className="bg-surface border border-surface-secondary/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-secondary">Verified</span>
            <Check className="w-4 h-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
        </div>
        
        <div className="bg-surface border border-surface-secondary/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-secondary">Selected</span>
            <div className={`w-4 h-4 rounded-full ${
              selectedPlaces.size > 0 ? "bg-brand text-white" : "bg-surface-secondary text-secondary"
            }`} />
          </div>
          <div className="text-2xl font-bold text-brand">{stats.selected}</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="bg-surface rounded-full p-1 flex items-center border border-surface-secondary">
          {(["all", "needsReview", "verified"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-full capitalize text-sm font-medium transition-all ${
                filterStatus === status
                  ? "bg-brand text-white shadow-md"
                  : "text-secondary hover:text-primary"
              }`}
            >
              {status === "all" ? "All Places" : status === "needsReview" ? "Needs Review" : "Verified"}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSelectAll}
            className="px-4 py-2 rounded-lg bg-surface border border-surface-secondary text-sm font-medium hover:bg-surface-hover transition-colors"
          >
            {selectedPlaces.size === filteredPlaces.length ? "Deselect All" : "Select All"}
          </button>
          
          <button
            onClick={handleVerifySelected}
            disabled={selectedPlaces.size === 0 || verifying}
            className="px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {verifying ? (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 animate-spin" />
                Verifying...
              </div>
            ) : (
              `Verify ${selectedPlaces.size} Place${selectedPlaces.size !== 1 ? 's' : ''}`
            )}
          </button>
          
          <button
            onClick={handleRejectSelected}
            disabled={selectedPlaces.size === 0 || verifying}
            className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {verifying ? (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 animate-spin" />
                Rejecting...
              </div>
            ) : (
              `Reject ${selectedPlaces.size} Place${selectedPlaces.size !== 1 ? 's' : ''}`
            )}
          </button>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary w-4 h-4" />
          <input
            type="text"
            placeholder="Search places..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-surface border border-surface-secondary text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all duration-200"
          />
        </div>
      </div>

      {/* Success Message */}
      {verifiedCount > 0 && !verifying && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 animate-fade-in">
          <div className="flex items-center gap-2 text-green-800">
            <Check className="w-5 h-5" />
            <span className="font-medium">
              Successfully verified {verifiedCount} place{verifiedCount !== 1 ? 's' : ''}!
            </span>
          </div>
        </div>
      )}

      {/* Places List */}
      <div className="flex flex-col gap-2">
        {/* Desktop Header */}
        <div className="hidden md:grid md:grid-cols-[40px_2fr_1fr_1fr_1fr_1fr] px-4 py-2 text-xs font-bold text-secondary uppercase tracking-wider">
          <div></div>
          <div>Place</div>
          <div>ID / Code</div>
          <div>Status</div>
          <div>Actions</div>
        </div>

        {/* Places */}
        {filteredPlaces.length > 0 ? (
          filteredPlaces.map((place) => (
            <div
              key={place.id}
              className="group block bg-surface border border-surface-secondary rounded-xl hover:border-brand hover:shadow-sm transition-all p-4 md:px-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-[40px_2fr_1fr_1fr_1fr_1fr] gap-3 md:gap-0 items-start md:items-center">
                {/* Checkbox */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedPlaces.has(place.id)}
                    onChange={(e) => {
                      const newSelected = new Set(selectedPlaces);
                      if (e.target.checked) {
                        newSelected.add(place.id);
                      } else {
                        newSelected.delete(place.id);
                      }
                      setSelectedPlaces(newSelected);
                    }}
                    className="w-4 h-4 rounded-2xl border-2 border-surface-secondary text-brand focus:ring-2 focus:ring-brand/20"
                  />
                </div>

                {/* Place Info */}
                <div className="flex items-center gap-3">
                  {place.imageHeroUrl ? (
                    <div className="relative w-10 h-10 md:w-8 md:h-8 rounded-lg overflow-hidden flex-shrink-0 bg-surface-secondary">
                      <img
                        src={place.imageHeroUrl}
                        alt={place.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 md:w-8 md:h-8 rounded-lg bg-surface-secondary flex items-center justify-center text-secondary/40">
                      <MapPin size={20} />
                    </div>
                  )}
                  <div>
                    <span className="font-bold text-txt-main text-sm line-clamp-1">
                      {place.name}
                    </span>
                    <span className="text-xs text-secondary line-clamp-1">
                      {place.address || "No address available"}
                    </span>
                  </div>
                </div>

                {/* ID / Code */}
                <div className="hidden md:block text-center">
                  <span className="text-xs text-secondary font-mono">
                    {place.id}
                  </span>
                </div>

                {/* Status */}
                <div className="flex md:block items-center justify-center">
                  <div>
                    {place.needsReview ? (
                      <span className="inline-flex items-center px-2 py-1 rounded text-micro font-bold bg-yellow-100 text-yellow-800">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        NEEDS REVIEW
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded text-micro font-bold bg-green-100 text-green-800">
                        <Check className="w-3 h-3 mr-1" />
                        VERIFIED
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <a
                    href={`/place/${place.slug}`}
                    className="px-3 py-1 rounded-lg bg-surface border border-surface-secondary text-xs font-medium hover:bg-surface-hover transition-colors"
                  >
                    View
                  </a>
                  {place.needsReview && (
                    <button
                      onClick={() => {
                        const newSelected = new Set(selectedPlaces);
                        if (newSelected.has(place.id)) {
                          newSelected.delete(place.id);
                        } else {
                          newSelected.add(place.id);
                        }
                        setSelectedPlaces(newSelected);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        selectedPlaces.has(place.id)
                          ? "bg-brand text-white"
                          : "bg-surface border border-surface-secondary hover:bg-surface-hover"
                      }`}
                    >
                      {selectedPlaces.has(place.id) ? "Selected" : "Select"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center bg-surface/30 rounded-3xl border-2 border-dashed border-surface-secondary/50 backdrop-blur-sm">
            <MapPin className="w-8 h-8 mx-auto text-secondary mb-4 opacity-50" />
            <p className="text-secondary font-medium mb-2">
              No auto-created places found matching your criteria.
            </p>
            <p className="text-secondary/60 text-sm max-w-[300px] mx-auto text-balance">
              Check back soon as we explore more places.
            </p>
          </div>
        )}
      </div>

      <div className="text-right text-xs text-secondary mt-2">
        Showing {filteredPlaces.length} of {places.length} auto-created places
      </div>
    </div>
  );
}
