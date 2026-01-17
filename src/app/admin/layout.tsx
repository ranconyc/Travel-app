"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Map,
  Blocks,
  File as FileIcon,
  Globe,
  Server,
  Palette,
  Code,
} from "lucide-react";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // console.log("Path", pathname.split("/")[2]);
  const currentPath = pathname.split("/")[2];

  const isActive = (path: string | undefined) => {
    return currentPath === path;
  };

  const getLinkClasses = (path: string | undefined) => {
    return isActive(path)
      ? "flex items-center gap-3 px-4 py-3 text-gray-700 bg-blue-50 rounded-lg font-medium"
      : "flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-lg hover:text-gray-900 transition-colors";
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
            <span className="bg-blue-600 text-white p-1 rounded">TM</span> Admin
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <Link href="/admin" className={getLinkClasses(undefined)}>
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link href="/admin/users" className={getLinkClasses("users")}>
            <Users size={20} />
            Users
          </Link>
          <Link
            href="/admin/destinations"
            className={getLinkClasses("destinations")}
          >
            <Map size={20} />
            Destinations
          </Link>
          <Link href="/admin/pages" className={getLinkClasses("pages")}>
            <FileIcon size={20} />
            Pages
          </Link>
          <Link href="/admin/apis" className={getLinkClasses("apis")}>
            <Server size={20} />
            APIs
          </Link>
          <Link href="/admin/developer" className={getLinkClasses("developer")}>
            <Code size={20} />
            Actions & Hooks
          </Link>
          <Link href="/admin/component" className={getLinkClasses("component")}>
            <Blocks size={20} />
            Components
          </Link>
          <Link
            href="/admin/design-system"
            className={getLinkClasses("design-system")}
          >
            <Palette size={20} />
            Design System
          </Link>
          <Link href="/admin/generator" className={getLinkClasses("generator")}>
            <Globe size={20} />
            Generator
          </Link>
          <Link href="/admin/settings" className={getLinkClasses("settings")}>
            <Settings size={20} />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-600 transition-colors"
          >
            <LogOut size={20} />
            Exit Admin
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center px-6 md:hidden">
          <span className="font-bold">TravelMate Admin</span>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
