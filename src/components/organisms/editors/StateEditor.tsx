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
    coords?: unknown;
    country?: { name: string; code: string };
  };
};

function getMissingFields(data: Props["initialData"]): string[] {
  const missing: string[] = [];
  if (!data.name) missing.push("name");
  if (!data.slug) missing.push("slug");
  if (!data.imageHeroUrl) missing.push("imageHeroUrl");
  return missing;
}

export default function StateEditor({ id, initialData }: Props) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const missingFields = getMissingFields(data);
  const completeness = Math.max(0, 100 - missingFields.length * 20);

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
                  onImageUploaded={(url) =>
                    setData({ ...data, imageHeroUrl: url })
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
