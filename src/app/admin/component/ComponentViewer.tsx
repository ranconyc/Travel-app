"use client";

import React, { useState } from "react";
import { getComponentPreview } from "@/app/admin/component/ComponentRegistry";
import { Search } from "lucide-react";

type ComponentInfo = {
  name: string;
  path: string;
  type: "COMMON" | "PAGE_SPECIFIC";
  page?: string;
};

type Props = {
  common: ComponentInfo[];
  pageSpecific: ComponentInfo[];
};

export default function ComponentViewer({ common, pageSpecific }: Props) {
  const [filter, setFilter] = useState("");

  const filterList = (list: ComponentInfo[]) =>
    list.filter(
      (c) =>
        c.name.toLowerCase().includes(filter.toLowerCase()) ||
        c.path.toLowerCase().includes(filter.toLowerCase()),
    );

  const filteredCommon = filterList(common);
  const filteredPage = filterList(pageSpecific);

  return (
    <div className="flex flex-col gap-8">
      {/* Search Bar */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary"
          size={20}
        />
        <input
          type="text"
          placeholder="Search components..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full pl-10 pr-md py-3 rounded-lg border border-surface-secondary bg-surface focus:outline-none focus:border-brand transition-colors"
        />
      </div>

      <section>
        <div className="flex items-center gap-md mb-6">
          <h2 className="text-xl font-bold text-brand">Common Components</h2>
          <span className="bg-brand/10 text-brand px-2 py-1 rounded text-sm font-mono">
            src/app/components
          </span>
          <span className="ml-auto text-sm text-secondary">
            {filteredCommon.length} items
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommon.map((c) => {
            const preview = getComponentPreview(c.name);
            return (
              <div
                key={c.path}
                className="group bg-surface border border-surface-secondary rounded-xl overflow-hidden hover:border-brand/30 transition-all shadow-sm"
              >
                <div className="h-32 bg-main/50 border-b border-surface-secondary flex items-center justify-center p-md">
                  {preview ? (
                    <div className="pointer-events-none">{preview}</div>
                  ) : (
                    <div className="text-xs text-secondary font-mono bg-surface-secondary/50 px-3 py-1 rounded">
                      No Preview
                    </div>
                  )}
                </div>
                <div className="p-md">
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-brand transition-colors">
                    {c.name}
                  </h3>
                  <p className="text-xs text-secondary font-mono break-all opacity-70">
                    {c.path}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-md mb-md">
          <h2 className="text-xl font-bold text-accent">
            Page-Specific Components
          </h2>
          <span className="bg-accent/10 text-accent px-2 py-1 rounded text-sm font-mono">
            **/_components/**
          </span>
          <span className="ml-auto text-sm text-secondary">
            {filteredPage.length} items
          </span>
        </div>
        <div className="bg-surface border border-accent/20 rounded-lg overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-secondary text-secondary uppercase text-xs font-bold border-b border-accent/10">
              <tr>
                <th className="px-4 py-3">Component Name</th>
                <th className="px-4 py-3">Used On Page</th>
                <th className="px-4 py-3">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-accent/5">
              {filteredPage.map((c) => (
                <tr key={c.path} className="hover:bg-accent/5">
                  <td className="px-4 py-3 font-semibold">{c.name}</td>
                  <td className="px-4 py-3 text-accent font-medium">
                    {c.page}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-secondary opacity-75">
                    {c.path}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
