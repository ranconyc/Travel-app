"use client";

import { useState } from "react";
import Button from "@/app/components/common/Button";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  AlertTriangle,
  CheckCircle,
  Trash2,
} from "lucide-react";
import {
  updateCountryAction,
  deleteCountryAction,
} from "@/domain/country/country.actions";
import { updateCityAction, deleteCityAction } from "@/domain/city/city.actions";
import {
  updatePlaceAction,
  deletePlaceAction,
} from "@/domain/place/place.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Props = {
  id: string;
  type: "country" | "city" | "place";
  initialData: any;
};

// Define fields that we expect to might be missing but users might want to add
const POTENTIAL_FIELDS: Record<string, string[]> = {
  country: [
    "officialName",
    "continent",
    "subRegion",
    "regionCode",
    "subRegionCode",
    "capital",
    "areaKm2",
    "idealDuration",
  ],
  city: [
    "state",
    "district",
    "population",
    "timeZone",
    "bestSeason",
    "idealDuration",
    "safety",
    "isCapital",
    "radiusKm",
  ],
  place: [
    "altName",
    "address",
    "neighborhood",
    "websiteUrl",
    "phoneNumber",
    "googlePlaceId",
    "bestTimeToVisit",
    "typicalVisitDuration",
    "rating",
    "reviewCount",
    "accessibility",
    "safetyNotes",
    "summary",
  ],
};

// Array fields that need multi-input UI
const ARRAY_FIELDS: Record<string, string[]> = {
  country: ["regions"],
  city: ["neighborhoods"],
  place: ["categories", "amenities", "vibe", "highlights", "tags"],
};

// Complex JSON fields that need structured inputs
const JSON_FIELDS: Record<string, string[]> = {
  country: [
    "currency",
    "emergency",
    "visaEntry",
    "languages",
    "commonPhrases",
    "utilities",
    "internet",
    "budget",
    "cashCulture",
    "gettingAround",
    "bestTimeToVisit",
    "coords",
  ],
  city: ["budget", "gettingAround", "coords", "boundingBox"],
  place: ["coords", "openingHours", "entryPrice"],
};

function getMissingFields(data: any, prefix = ""): string[] {
  const missing: string[] = [];
  const keysToIgnore = [
    "id",
    "createdAt",
    "updatedAt",
    "places",
    "cities",
    "usersHomeBase",
    "media",
    "usersCurrentCity",
    "autoCreated",
    "needsReview",
    "slug",
    "countryId",
    "cityId",
  ];

  for (const key in data) {
    if (keysToIgnore.includes(key)) continue;

    const val = data[key];
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (val === null || val === undefined || val === "") {
      missing.push(fullKey);
    } else if (Array.isArray(val) && val.length === 0) {
      if (["neighborhoods", "regions", "images"].includes(key)) {
        missing.push(fullKey + " (empty list)");
      }
    }
  }

  if (data.description === undefined) missing.push("description");
  if (data.imageHeroUrl === undefined) missing.push("imageHeroUrl");

  return missing;
}

export default function DestinationEditorClient({
  id,
  type,
  initialData,
}: Props) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const missingFields = getMissingFields(data);
  const completeness = Math.max(0, 100 - missingFields.length * 5);

  const handleSave = async () => {
    setLoading(true);
    try {
      let res;
      if (type === "country") res = await updateCountryAction(id, data);
      else if (type === "city") res = await updateCityAction(id, data);
      else res = await updatePlaceAction(id, data);

      if (res.success) {
        toast.success("Saved successfully");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to save");
      }
    } catch (e) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    // eslint-disable-next-line no-alert
    if (
      !window.confirm(
        "Are you sure you want to delete this destination? This cannot be undone.",
      )
    )
      return;

    setLoading(true);
    try {
      let res;
      if (type === "country") res = await deleteCountryAction(id);
      else if (type === "city") res = await deleteCityAction(id);
      else res = await deletePlaceAction(id);

      if (res.success) {
        toast.success("Deleted successfully");
        router.push("/admin/destinations");
      } else {
        toast.error(res.error || "Failed to delete");
        setLoading(false);
      }
    } catch (e) {
      toast.error("An error occurred deleting item");
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      // 1) Instant preview
      const previewUrl = URL.createObjectURL(file);
      setData({ ...data, imageHeroUrl: previewUrl });

      // 2) Get Cloudinary signature
      const sigRes = await fetch("/api/destinations/upload", {
        method: "POST",
      });
      if (!sigRes.ok) throw new Error("Failed to get Cloudinary signature");

      const {
        cloudName,
        apiKey,
        timestamp,
        folder,
        signature,
        transformation,
      } = await sigRes.json();

      // 3) Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", String(timestamp));
      formData.append("folder", folder);
      formData.append("signature", signature);
      if (transformation) {
        formData.append("transformation", transformation);
      }

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        { method: "POST", body: formData },
      );

      if (!uploadRes.ok) {
        throw new Error(`Upload failed: ${uploadRes.status}`);
      }

      const result = await uploadRes.json();

      // 4) Update with CDN URL
      setData({ ...data, imageHeroUrl: result.secure_url });
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image");
    }
  };

  const extraFields = POTENTIAL_FIELDS[type] || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/destinations"
            className="hidden md:block p-2 hover:bg-surface-hover rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex flex-col items-start gap-1">
              <span className="uppercase text-[10px] font-bold text-secondary tracking-wider bg-surface-secondary px-2 py-0.5 rounded">
                {type}
              </span>
              <h1 className="text-2xl font-bold leading-tight">{data.name}</h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleDelete}
            disabled={loading}
            className="!bg-red-500 hover:!bg-red-600 text-white flex items-center gap-2 px-3 border-transparent"
          >
            <Trash2 size={16} />
            <span className="hidden md:inline">Delete</span>
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <Save size={16} />
            <span className="hidden md:inline">
              {loading ? "Saving..." : "Save"}
            </span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface rounded-xl p-6 shadow-sm border border-border">
            <h2 className="text-lg font-bold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-secondary mb-1">
                  Name
                </label>
                <input
                  value={data.name || ""}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  className="w-full p-2 bg-surface border border-surface-secondary rounded focus:border-brand outline-none transition-colors"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-medium text-secondary mb-1">
                  ID (Read Only)
                </label>
                <input
                  value={id}
                  disabled
                  className="w-full p-2 bg-surface-secondary border border-transparent rounded text-secondary font-mono text-xs cursor-text select-all"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-medium text-secondary mb-1">
                  Hero Image
                </label>
                <div className="space-y-2">
                  {/* Image Upload Area */}
                  <div
                    onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = "image/*";
                      input.onchange = async (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) await handleImageUpload(file);
                      };
                      input.click();
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={async (e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      if (file) await handleImageUpload(file);
                    }}
                    className="relative border-2 border-dashed border-surface-secondary hover:border-brand rounded-lg p-4 cursor-pointer transition-colors group"
                  >
                    {data.imageHeroUrl ? (
                      <div className="relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={data.imageHeroUrl}
                          alt="Hero"
                          className="w-full h-48 object-cover rounded"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
                          <span className="text-white text-sm">
                            Click or drag to replace
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-secondary text-sm">
                          Click or drag image here to upload
                        </p>
                        <p className="text-xs text-secondary/60 mt-1">
                          Recommended: 1920x1080px
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Manual URL Input (fallback) */}
                  <input
                    value={data.imageHeroUrl || ""}
                    onChange={(e) =>
                      setData({ ...data, imageHeroUrl: e.target.value })
                    }
                    placeholder="Or paste image URL..."
                    className="w-full p-2 bg-surface border border-surface-secondary rounded focus:border-brand outline-none transition-colors font-mono text-xs"
                  />
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-medium text-secondary mb-1">
                  Description
                </label>
                <textarea
                  value={data.description || ""}
                  onChange={(e) =>
                    setData({ ...data, description: e.target.value })
                  }
                  rows={4}
                  className="w-full p-2 bg-surface border border-surface-secondary rounded focus:border-brand outline-none transition-colors"
                />
              </div>

              {/* Dynamic Extra Fields */}
              {extraFields.map((field) => (
                <div key={field}>
                  <label className="block text-xs font-medium text-secondary mb-1 capitalize">
                    {field}
                  </label>
                  <input
                    value={
                      typeof data[field] === "object"
                        ? JSON.stringify(data[field])
                        : data[field] || ""
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      setData({ ...data, [field]: val });
                    }}
                    placeholder={`Add ${field}...`}
                    className="w-full p-2 bg-surface border border-surface-secondary rounded focus:border-brand outline-none transition-colors"
                  />
                </div>
              ))}

              {/* Type Specific Known Fields */}
              {type === "country" && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-secondary mb-1">
                      Population
                    </label>
                    <input
                      type="number"
                      value={data.population || ""}
                      onChange={(e) =>
                        setData({
                          ...data,
                          population: parseInt(e.target.value) || null,
                        })
                      }
                      className="w-full p-2 bg-surface border border-surface-secondary rounded focus:border-brand outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-secondary mb-1">
                      Safety Rating
                    </label>
                    <input
                      value={data.safety || ""}
                      onChange={(e) =>
                        setData({ ...data, safety: e.target.value })
                      }
                      placeholder="e.g. High, Medium"
                      className="w-full p-2 bg-surface border border-surface-secondary rounded focus:border-brand outline-none transition-colors"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Array Fields Section */}
          {ARRAY_FIELDS[type]?.length > 0 && (
            <div className="bg-surface rounded-xl p-6 shadow-sm border border-border">
              <h2 className="text-lg font-bold mb-4">List Fields</h2>
              <div className="space-y-6">
                {ARRAY_FIELDS[type].map((field) => {
                  const currentArray = Array.isArray(data[field])
                    ? data[field]
                    : [];
                  return (
                    <div key={field}>
                      <label className="block text-xs font-medium text-secondary mb-2 capitalize">
                        {field.replace(/([A-Z])/g, " $1").trim()}
                      </label>
                      <div className="space-y-2">
                        {currentArray.map((item: string, idx: number) => (
                          <div key={idx} className="flex gap-2">
                            <input
                              value={item}
                              onChange={(e) => {
                                const newArray = [...currentArray];
                                newArray[idx] = e.target.value;
                                setData({ ...data, [field]: newArray });
                              }}
                              className="flex-1 p-2 bg-surface border border-surface-secondary rounded focus:border-brand outline-none transition-colors text-sm"
                            />
                            <button
                              onClick={() => {
                                const newArray = currentArray.filter(
                                  (_: any, i: number) => i !== idx,
                                );
                                setData({ ...data, [field]: newArray });
                              }}
                              className="px-3 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded transition-colors text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            setData({
                              ...data,
                              [field]: [...currentArray, ""],
                            });
                          }}
                          className="w-full p-2 border-2 border-dashed border-surface-secondary hover:border-brand rounded transition-colors text-sm text-secondary hover:text-primary"
                        >
                          + Add {field.slice(0, -1)}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* JSON Fields Section */}
          {JSON_FIELDS[type]?.length > 0 && (
            <div className="bg-surface rounded-xl p-6 shadow-sm border border-border">
              <h2 className="text-lg font-bold mb-4">Structured Data (JSON)</h2>
              <div className="space-y-4">
                {JSON_FIELDS[type].map((field) => (
                  <div key={field}>
                    <label className="block text-xs font-medium text-secondary mb-1 capitalize">
                      {field.replace(/([A-Z])/g, " $1").trim()}
                    </label>
                    <textarea
                      value={
                        data[field] ? JSON.stringify(data[field], null, 2) : ""
                      }
                      onChange={(e) => {
                        try {
                          const parsed = e.target.value
                            ? JSON.parse(e.target.value)
                            : null;
                          setData({ ...data, [field]: parsed });
                        } catch {
                          // Allow typing invalid JSON temporarily
                        }
                      }}
                      placeholder={`Enter JSON for ${field}...`}
                      rows={3}
                      className="w-full p-2 bg-surface-secondary border border-transparent rounded focus:border-brand outline-none transition-colors font-mono text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Raw Data Editor */}
          <div className="bg-surface rounded-xl p-6 shadow-sm border border-border">
            <h2 className="text-lg font-bold mb-2">Raw Data Inspector</h2>
            <p className="text-xs text-secondary mb-4">
              Edit other fields JSON structure directly.
            </p>
            <textarea
              value={JSON.stringify(data, null, 2)}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  setData(parsed);
                } catch (e) {
                  // ignore parse errors while typing
                }
              }}
              className="w-full bg-surface-secondary p-4 rounded-lg text-xs font-mono min-h-[300px] border border-transparent focus:border-brand outline-none"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-surface rounded-xl p-6 shadow-sm border border-border">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              Data Health
              {missingFields.length === 0 && (
                <CheckCircle className="text-green-500" size={18} />
              )}
            </h3>

            <div className="mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span>Completeness</span>
                <span className="font-bold">{completeness}%</span>
              </div>
              <div className="h-2 w-full bg-surface-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full ${completeness > 80 ? "bg-green-500" : completeness > 50 ? "bg-yellow-500" : "bg-red-500"}`}
                  style={{ width: `${completeness}%` }}
                />
              </div>
            </div>

            <h4 className="text-secondary text-xs uppercase font-bold tracking-wider mb-3">
              Missing / Empty Fields
            </h4>
            {missingFields.length > 0 ? (
              <ul className="space-y-2">
                {missingFields.map((field) => (
                  <li
                    key={field}
                    className="flex items-start gap-2 text-sm text-red-400"
                  >
                    <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                    <span>{field}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-secondary italic">
                All key fields appear to be populated.
              </p>
            )}
          </div>

          {type === "country" || type === "city" ? (
            <div className="bg-surface rounded-xl p-6 shadow-sm border border-border">
              <h3 className="font-bold text-lg mb-4">Meta Status</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-secondary">Needs Review</span>
                <input
                  type="checkbox"
                  checked={data.needsReview ?? false}
                  onChange={(e) =>
                    setData({ ...data, needsReview: e.target.checked })
                  }
                  className="toggle"
                />
              </div>
            </div>
          ) : null}

          {data.imageHeroUrl && (
            <div className="bg-surface rounded-xl overflow-hidden border border-border shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.imageHeroUrl}
                alt="Hero"
                className="w-full h-48 object-cover"
              />
              <div className="p-3 text-xs text-secondary truncate">
                {data.imageHeroUrl}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
