"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { Plus, Trash2 } from "lucide-react";
import Button from "@/app/component/common/Button";
import {
  addActivityToTripAction,
  removeActivityFromTripAction,
} from "../../actions/itinerary.actions";

type Activity = {
  id: string;
  name: string;
  startTime: string | null;
  notes: string | null;
  date: Date;
};

type Props = {
  tripId: string;
  date: Date;
  dayNumber: number;
  activities: Activity[];
  isMine: boolean;
};

export default function ItineraryDay({
  tripId,
  date,
  dayNumber,
  activities,
  isMine,
}: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    startTime: "",
    notes: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  console.log(
    `trip id ${tripId}, is mine ${isMine} activities ${activities}   day number ${dayNumber}`
  );
  // Filter activities for this specific date
  // (Assuming backend passes all activities, or we filter before passing, but here we can just verify if needed.
  // Ideally parent passes ONLY activities for this day.)
  const dayActivities = activities.sort((a, b) =>
    (a.startTime || "").localeCompare(b.startTime || "")
  );

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name) return;

    setIsSaving(true);
    try {
      await addActivityToTripAction(tripId, {
        name: formData.name,
        date: date,
        startTime: formData.startTime,
        notes: formData.notes,
      });
      setIsAdding(false);
      setFormData({ name: "", startTime: "", notes: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to add activity");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(activityId: string) {
    if (!confirm("Remove this activity?")) return;
    try {
      await removeActivityFromTripAction(tripId, activityId);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="mb-6 border-b border-gray-200 pb-6 last:border-0">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold font-display">Day {dayNumber}</h3>
          <p className="text-gray-500">{format(date, "EEEE, MMMM d")}</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setIsAdding(!isAdding)}
          className="!py-1 !px-3 !text-xs"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Activity
        </Button>
      </div>

      {dayActivities.length === 0 && !isAdding && (
        <p className="text-sm text-gray-400 italic">No activities planned.</p>
      )}

      <ul className="space-y-3">
        {dayActivities.map((activity) => (
          <li
            key={activity.id}
            className="group relative bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-all flex gap-4 items-start"
          >
            <div className="flex-shrink-0 min-w-[60px] text-center">
              {activity.startTime ? (
                <span className="text-sm font-semibold text-primary block">
                  {activity.startTime}
                </span>
              ) : (
                <span className="text-xs text-gray-400 block">-</span>
              )}
            </div>
            <div className="flex-grow">
              <h4 className="font-semibold text-gray-900">{activity.name}</h4>
              {activity.notes && (
                <p className="text-sm text-gray-500 mt-1">{activity.notes}</p>
              )}
            </div>
            <button
              onClick={() => handleDelete(activity.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-400 hover:text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </li>
        ))}
      </ul>

      {isAdding && (
        <form
          onSubmit={handleAdd}
          className="mt-4 bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300"
        >
          <div className="grid grid-cols-[100px_1fr] gap-3 mb-3">
            <input
              type="time"
              className="p-2 border rounded-lg text-sm"
              value={formData.startTime}
              onChange={(e) =>
                setFormData({ ...formData, startTime: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Activity name (e.g. Dinner at..."
              className="p-2 border rounded-lg text-sm w-full"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              autoFocus
            />
          </div>
          <textarea
            placeholder="Notes, address, or details..."
            className="p-2 border rounded-lg text-sm w-full mb-3"
            rows={2}
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsAdding(false)}
              className="!py-1 !px-3"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving} className="!py-1 !px-3">
              {isSaving ? "Saving..." : "Save Activity"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
