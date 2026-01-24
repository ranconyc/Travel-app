"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Avatar } from "@/components/molecules/Avatar";
import { updateUserRoleAction } from "@/domain/user/user.actions";
import { Loader2, Shield, User as UserIcon, Search } from "lucide-react";
import Button from "@/components/atoms/Button";

type User = {
  id: string;
  name: string | null;
  email: string | null;
  role: "USER" | "ADMIN";
  avatarUrl: string | null;
  createdAt: Date;
};

export default function UsersTable({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [filter, setFilter] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleRoleChange = async (
    userId: string,
    newRole: "USER" | "ADMIN",
  ) => {
    setLoadingId(userId);
    const res = await updateUserRoleAction({ userId, role: newRole });
    setLoadingId(null);

    if (res.success) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
      );
    } else {
      alert("Failed to update role");
    }
  };

  const filtered = users.filter(
    (u) =>
      (u.name?.toLowerCase() || "").includes(filter.toLowerCase()) ||
      (u.email?.toLowerCase() || "").includes(filter.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary"
          size={20}
        />
        <input
          type="text"
          placeholder="Search users..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full pl-10 pr-md py-2 rounded-lg border border-surface-secondary bg-surface focus:outline-none focus:border-brand transition-colors"
        />
      </div>

      <div className="bg-surface border border-surface-secondary rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-secondary text-secondary uppercase text-xs font-bold border-b border-surface-secondary">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-secondary/50">
              {filtered.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-brand/5 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar
                        image={user.avatarUrl || undefined}
                        name={user.name || "User"}
                        size={40}
                      />
                      <div>
                        <div className="font-medium text-txt-main">
                          {user.name || "Unnamed User"}
                        </div>
                        <div className="text-xs text-secondary">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.role === "ADMIN" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                        <Shield size={12} fill="currentColor" />
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-200">
                        <UserIcon size={12} />
                        User
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-secondary">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {loadingId === user.id ? (
                        <Loader2
                          className="animate-spin text-brand"
                          size={16}
                        />
                      ) : (
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(
                              user.id,
                              e.target.value as "USER" | "ADMIN",
                            )
                          }
                          className="text-xs border border-surface-secondary rounded px-2 py-1 bg-surface hover:border-brand cursor-pointer focus:outline-none focus:border-brand"
                        >
                          <option value="USER">User</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-secondary">No users found.</div>
        )}
      </div>
    </div>
  );
}
