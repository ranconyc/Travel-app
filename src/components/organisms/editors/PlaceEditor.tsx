"use client";

import { useState } from "react";
import Button from "@/components/atoms/Button";
import Link from "next/link";
import { ArrowLeft, Save, CheckCircle, Trash2 } from "lucide-react";
import {
  updatePlaceAction,
  deletePlaceAction,
} from "@/domain/place/place.actions";
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
];

const ARRAY_FIELDS = ["categories", "amenities", "vibe", "highlights", "tags"];
const JSON_FIELDS = ["coords", "openingHours", "entryPrice"];

function getMissingFields(data: any): string[] {
  const missing: string[] = [];
  if (!data.name) missing.push("name");
  if (!data.description) missing.push("description");
  if (!data.imageHeroUrl) missing.push("imageHeroUrl");
  return missing;
}

export default function PlaceEditor({ id, initialData }: Props) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const missingFields = getMissingFields(data);
  const completeness = Math.max(0, 100 - missingFields.length * 20);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await updatePlaceAction({ id, data });
      if (res.success) {
        toast.success("Place saved successfully");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to save place");
      }
    } catch (e) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this place?")) return;
    setLoading(true);
    try {
      const res = await deletePlaceAction({ id });
      if (res.success) {
        toast.success("Place deleted successfully");
        router.push("/admin/destinations");
      } else {
        toast.error(res.error || "Failed to delete place");
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
                PLACE
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
                  onImageUploaded={(url) =>
                    setData({ ...data, imageHeroUrl: url })
                  }
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
            <h2 className="text-lg font-bold mb-md">List Fields</h2>
            <div className="space-y-6">
              {ARRAY_FIELDS.map((field) => (
                <ArrayFieldEditor
                  key={field}
                  label={field.replace(/([A-Z])/g, " $1").trim()}
                  items={data[field]}
                  onChange={(newItems) =>
                    setData({ ...data, [field]: newItems })
                  }
                />
              ))}
            </div>
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
          <div className="bg-surface rounded-xl p-6 shadow-sm border border-border">
            <h3 className="font-bold text-lg mb-md flex items-center gap-2">
              Data Health
              {missingFields.length === 0 && (
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
                  className={`h-full ${completeness > 80 ? "bg-success" : completeness > 50 ? "bg-warning" : "bg-error"}`}
                  style={{ width: `${completeness}%` }}
                />
              </div>
            </div>
            <div className="text-xs text-secondary">
              {missingFields.length > 0 ? (
                <ul className="list-disc pl-4 space-y-1">
                  {missingFields.map((field) => (
                    <li key={field} className="text-error">
                      Missing {field}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-success">All required fields present.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
