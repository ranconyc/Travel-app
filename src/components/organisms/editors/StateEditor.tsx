"use client";

import { useState } from "react";
import Button from "@/components/atoms/Button";
import Link from "next/link";
import { ArrowLeft, Save, CheckCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";
import JsonFieldEditor from "./JsonFieldEditor";

type Props = {
  id: string;
  initialData: {
    id: string;
    name: string;
    code?: string;
    slug?: string;
    type?: string;
    imageHeroUrl?: string;
    imageHeroPublicId?: string;
    coords?: unknown;
    country?: { name: string; code: string };
  };
};

// Fields to check for data health (non-JSON Prisma fields only)
const REQUIRED_FIELDS = ["name", "slug"];
const RECOMMENDED_FIELDS = ["imageHeroUrl", "code", "type"];

function getMissingFields(data: Props["initialData"]): {
  required: string[];
  recommended: string[];
} {
  const required: string[] = [];
  const recommended: string[] = [];

  REQUIRED_FIELDS.forEach((field) => {
    if (!data[field as keyof typeof data]) required.push(field);
  });

  RECOMMENDED_FIELDS.forEach((field) => {
    if (!data[field as keyof typeof data]) recommended.push(field);
  });

  return { required, recommended };
}

export default function StateEditor({ id, initialData }: Props) {
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
      // Update state via API
      const res = await fetch(`/api/admin/states/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("State saved successfully");
        router.refresh();
      } else {
        toast.error("Failed to save state");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this state?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/states/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("State deleted successfully");
        router.push("/admin/destinations");
      } else {
        toast.error("Failed to delete state");
        setLoading(false);
      }
    } catch {
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
                {data.type || "STATE"}
              </span>
              <h1 className="text-2xl font-bold leading-tight">{data.name}</h1>
              {data.country && (
                <span className="text-sm text-secondary">
                  {data.country.name} ({data.country.code})
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleDelete}
            disabled={loading}
            className="bg-error! hover:bg-error/90! text-white flex items-center gap-2 px-3 border-transparent"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div>
                <label className="block text-xs font-medium text-secondary mb-1">
                  Name
                </label>
                <input
                  value={data.name || ""}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  className="w-full p-2 bg-surface border border-surface-secondary rounded focus:border-brand outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-secondary mb-1">
                  Code
                </label>
                <input
                  value={data.code || ""}
                  onChange={(e) => setData({ ...data, code: e.target.value })}
                  className="w-full p-2 bg-surface border border-surface-secondary rounded focus:border-brand outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-secondary mb-1">
                  Slug
                </label>
                <input
                  value={data.slug || ""}
                  onChange={(e) => setData({ ...data, slug: e.target.value })}
                  className="w-full p-2 bg-surface border border-surface-secondary rounded focus:border-brand outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-secondary mb-1">
                  Type
                </label>
                <select
                  value={data.type || "state"}
                  onChange={(e) => setData({ ...data, type: e.target.value })}
                  className="w-full p-2 bg-surface border border-surface-secondary rounded focus:border-brand outline-none transition-colors"
                >
                  <option value="state">State</option>
                  <option value="province">Province</option>
                  <option value="district">District</option>
                  <option value="region">Region</option>
                  <option value="territory">Territory</option>
                </select>
              </div>

              <div className="md:col-span-2">
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
                  entityType="state"
                  entityId={id}
                  defaultSearchQuery={`${data.name} ${data.country?.name || ""}`}
                />
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-xl p-6 shadow-sm border border-border">
            <h2 className="text-lg font-bold mb-md">Coordinates</h2>
            <JsonFieldEditor
              label="Coords"
              value={data.coords}
              onChange={(newValue) => setData({ ...data, coords: newValue })}
            />
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
              {REQUIRED_FIELDS.filter((f) => data[f as keyof typeof data])
                .length > 0 && (
                <div>
                  <p className="font-medium text-success mb-1">✓ Complete:</p>
                  <ul className="list-none pl-0 space-y-0.5">
                    {REQUIRED_FIELDS.filter(
                      (f) => data[f as keyof typeof data],
                    ).map((field) => (
                      <li
                        key={field}
                        className="text-secondary flex items-center gap-1"
                      >
                        <CheckCircle size={12} className="text-success" />{" "}
                        {field}
                      </li>
                    ))}
                    {RECOMMENDED_FIELDS.filter(
                      (f) => data[f as keyof typeof data],
                    ).map((field) => (
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
