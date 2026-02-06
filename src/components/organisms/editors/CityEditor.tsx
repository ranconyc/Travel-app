"use client";

import { useState } from "react";
import Button from "@/components/atoms/Button";
import Link from "next/link";
import { ArrowLeft, Save, CheckCircle, Trash2 } from "lucide-react";
import { updateCityAction, deleteCityAction } from "@/domain/city/city.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";
import ArrayFieldEditor from "./ArrayFieldEditor";
import JsonFieldEditor from "./JsonFieldEditor";

type Props = {
  id: string;
  initialData: any;
};

const EXTRA_FIELDS = [
  "state",
  "district",
  "population",
  "timeZone",
  "bestSeason",
  "idealDuration",
  "safety",
  "isCapital",
  "radiusKm",
];

const JSON_FIELDS = ["budget", "gettingAround", "coords", "boundingBox"];

// Fields to check for data health (non-JSON Prisma fields only)
// Fields to check for data health (non-JSON Prisma fields only)
const REQUIRED_FIELDS = ["name", "countryRefId", "coords", "population"];
const RECOMMENDED_FIELDS = [
  "imageHeroUrl",
  "description",
  "weather",
  "bestTimeToVisit",
  "budget",
  "safety",
  "internetSpeed",
  "timeZone",
];

function getMissingFields(data: Record<string, unknown>): {
  required: string[];
  recommended: string[];
} {
  const required: string[] = [];
  const recommended: string[] = [];

  REQUIRED_FIELDS.forEach((field) => {
    if (!data[field]) required.push(field);
  });

  RECOMMENDED_FIELDS.forEach((field) => {
    if (!data[field]) recommended.push(field);
  });

  return { required, recommended };
}

export default function CityEditor({ id, initialData }: Props) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { required: missingRequired, recommended: missingRecommended } =
    getMissingFields(data);
  const totalMissing = missingRequired.length + missingRecommended.length;
  const totalFields = REQUIRED_FIELDS.length + RECOMMENDED_FIELDS.length;
  const completeness = Math.round(
    ((totalFields - totalMissing) / totalFields) * 100,
  );

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await updateCityAction({ id, data });
      if (res.success) {
        toast.success("City saved successfully");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to save city");
      }
    } catch (e) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this city?")) return;
    setLoading(true);
    try {
      const res = await deleteCityAction({ id });
      if (res.success) {
        toast.success("City deleted successfully");
        router.push("/admin/destinations");
      } else {
        toast.error(res.error || "Failed to delete city");
        setLoading(false);
      }
    } catch (e) {
      toast.error("An error occurred deleting item");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-md">
          <Link
            href="/admin/destinations"
            className="hidden md:block p-2 hover:bg-surface-hover rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex flex-col items-start gap-1">
              <span className="uppercase text-micro font-bold text-secondary tracking-wider bg-surface-secondary px-2 py-0.5 rounded">
                CITY
              </span>
              <h1 className="text-2xl font-bold leading-tight">{data.name}</h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleDelete}
            disabled={loading}
            className="!bg-error hover:!bg-error/90 text-white flex items-center gap-2 px-3 border-transparent"
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
            <h2 className="text-lg font-bold mb-md">Basic Information</h2>
            <div className="grid grid-cols-1 gap-md">
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
                <ImageUploader
                  label="Hero Image"
                  currentImageUrl={data.imageHeroUrl}
                  onImageUploaded={(url, publicId) =>
                    setData({
                      ...data,
                      imageHeroUrl: url,
                      imageHeroPublicId: publicId,
                    })
                  }
                  entityType="city"
                  entityId={id}
                  defaultSearchQuery={data.name}
                />
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

              {EXTRA_FIELDS.map((field) => (
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
                    onChange={(e) =>
                      setData({ ...data, [field]: e.target.value })
                    }
                    placeholder={`Add ${field}...`}
                    className="w-full p-2 bg-surface border border-surface-secondary rounded focus:border-brand outline-none transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface rounded-xl p-6 shadow-sm border border-border">
            <h2 className="text-lg font-bold mb-md">Neighborhoods</h2>
            <ArrayFieldEditor
              label="Neighborhoods"
              items={data.neighborhoods}
              onChange={(newItems) =>
                setData({ ...data, neighborhoods: newItems })
              }
            />
          </div>

          <div className="bg-surface rounded-xl p-6 shadow-sm border border-border">
            <h2 className="text-lg font-bold mb-md">Structured Data (JSON)</h2>
            <div className="space-y-4">
              {JSON_FIELDS.map((field) => (
                <JsonFieldEditor
                  key={field}
                  label={field.replace(/([A-Z])/g, " $1").trim()}
                  value={data[field]}
                  onChange={(newValue) =>
                    setData({ ...data, [field]: newValue })
                  }
                />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Hero Image Preview */}
          {data.imageHeroUrl && (
            <div className="bg-surface rounded-xl overflow-hidden shadow-sm border border-border">
              <img
                src={data.imageHeroUrl}
                alt={data.name}
                className="w-full h-32 object-cover"
              />
            </div>
          )}

          <div className="bg-surface rounded-xl p-6 shadow-sm border border-border">
            <h3 className="font-bold text-lg mb-md flex items-center gap-2">
              Data Health
              {missingRequired.length === 0 &&
                missingRecommended.length === 0 && (
                  <CheckCircle className="text-success" size={18} />
                )}
            </h3>
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span>Completeness</span>
                <span className="font-bold">{completeness}%</span>
              </div>
              <div className="h-2 w-full bg-surface-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full ${missingRequired.length === 0 ? (completeness > 80 ? "bg-success" : "bg-warning") : "bg-error"}`}
                  style={{ width: `${completeness}%` }}
                />
              </div>
            </div>
            <div className="text-xs space-y-3">
              {/* Complete Fields */}
              {REQUIRED_FIELDS.filter((f) => data[f]).length > 0 && (
                <div>
                  <p className="font-medium text-success mb-1">✓ Complete:</p>
                  <ul className="list-none pl-0 space-y-0.5">
                    {REQUIRED_FIELDS.filter((f) => data[f]).map((field) => (
                      <li
                        key={field}
                        className="text-secondary flex items-center gap-1"
                      >
                        <CheckCircle size={12} className="text-success" />{" "}
                        {field}
                      </li>
                    ))}
                    {RECOMMENDED_FIELDS.filter((f) => data[f]).map((field) => (
                      <li
                        key={field}
                        className="text-secondary flex items-center gap-1"
                      >
                        <CheckCircle size={12} className="text-success" />{" "}
                        {field}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Missing Required */}
              {missingRequired.length > 0 && (
                <div>
                  <p className="font-medium text-error mb-1">
                    ✗ Missing (Required):
                  </p>
                  <ul className="list-none pl-0 space-y-0.5">
                    {missingRequired.map((field) => (
                      <li key={field} className="text-error">
                        {field}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Missing Recommended */}
              {missingRecommended.length > 0 && (
                <div>
                  <p className="font-medium text-warning mb-1">
                    ○ Missing (Recommended):
                  </p>
                  <ul className="list-none pl-0 space-y-0.5">
                    {missingRecommended.map((field) => (
                      <li key={field} className="text-secondary">
                        {field}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
