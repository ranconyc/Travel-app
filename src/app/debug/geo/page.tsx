"use client";

import { useGeo } from "@/domain/user/user.hooks";
import { useUser } from "@/app/providers/UserProvider";
import Button from "@/components/atoms/Button";

export default function GeoDebugPage() {
  const loggedUser = useUser();
  const { coords, error, loading } = useGeo({
    persistToDb: true,
    distanceThresholdKm: 0.1, // Using smaller threshold for easier testing
    initialUser: loggedUser,
  });

  return (
    <div className="p-8 bg-main min-h-screen text-txt-main">
      <h1 className="text-3xl font-bold mb-6">Geo Location Debug</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-surface p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-md">Current Hook State</h2>
          <div className="space-y-2">
            <p>
              <span className="font-bold">Loading:</span>{" "}
              {loading ? "Yes" : "No"}
            </p>
            <p>
              <span className="font-bold">Error:</span> {error || "None"}
            </p>
            <div className="bg-main p-md rounded-lg mt-2">
              <p className="font-bold mb-1">Coordinates:</p>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(coords, null, 2) || "null"}
              </pre>
            </div>
          </div>
        </section>

        <section className="bg-surface p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-md">Logged User Info</h2>
          <div className="space-y-2">
            <p>
              <span className="font-bold">ID:</span> {loggedUser?.id}
            </p>
            <p>
              <span className="font-bold">Name:</span> {loggedUser?.name}
            </p>
            <div className="bg-main p-md rounded-lg mt-2">
              <p className="font-bold mb-1">User current location (from DB):</p>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(loggedUser?.currentLocation, null, 2) || "null"}
              </pre>
            </div>
          </div>
        </section>

        <section className="bg-surface p-6 rounded-xl shadow-sm md:col-span-2">
          <h2 className="text-xl font-semibold mb-md">Testing Instructions</h2>
          <ul className="list-disc list-inside space-y-2 text-secondary">
            <li>
              Open Chrome DevTools:{" "}
              <code className="bg-main px-1 rounded">Cmd + Option + I</code>
            </li>
            <li>
              Go to the &quot;Sensors&quot; tab (search in Command Menu if not
              visible)
            </li>
            <li>
              In &quot;Location&quot;, select &quot;Other...&quot; and enter new
              coordinates
            </li>
            <li>Move at least 100 meters (0.1km threshold used here)</li>
            <li>
              Check the console for{" "}
              <code className="bg-main px-1 rounded">
                &quot;Saving location...&quot;
              </code>{" "}
              logs
            </li>
            <li>
              Refresh the page to see if{" "}
              <code className="bg-main px-1 rounded">initialUser</code> location
              reflects the update
            </li>
          </ul>
        </section>
      </div>

      <div className="mt-8 flex justify-center">
        <Button variant="primary" onClick={() => window.location.reload()}>
          Refresh Data
        </Button>
      </div>
    </div>
  );
}
