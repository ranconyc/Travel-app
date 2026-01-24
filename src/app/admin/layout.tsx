"use client";

import React, { useState } from "react";
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
  Menu,
  X,
  ArrowLeft,
  Database,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const ADMIN_LINKS = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard, key: undefined },
  { href: "/admin/users", label: "Users", Icon: Users, key: "users" },
  {
    href: "/admin/destinations",
    label: "Destinations",
    Icon: Map,
    key: "destinations",
  },
  { href: "/admin/pages", label: "Pages", Icon: FileIcon, key: "pages" },
  { href: "/admin/schema", label: "Schema", Icon: Database, key: "schema" },
  { href: "/admin/apis", label: "APIs", Icon: Server, key: "apis" },
  {
    href: "/admin/developer",
    label: "Actions & Hooks",
    Icon: Code,
    key: "developer",
  },
  {
    href: "/admin/component",
    label: "Components",
    Icon: Blocks,
    key: "component",
  },
  {
    href: "/admin/design-system",
    label: "Design System",
    Icon: Palette,
    key: "design-system",
  },
  {
    href: "/admin/generator",
    label: "Generator",
    Icon: Globe,
    key: "generator",
  },
  {
    href: "/admin/settings",
    label: "Settings",
    Icon: Settings,
    key: "settings",
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentPath = pathname.split("/")[2];

  const isActive = (key: string | undefined) => {
    return currentPath === key;
  };

  const getLinkClasses = (key: string | undefined) => {
    return isActive(key)
      ? "flex items-center gap-3 px-4 py-3 text-gray-700 bg-blue-50 rounded-lg font-medium"
      : "flex items-center gap-3 px-4 py-3 text-secondary hover:bg-gray-50 rounded-lg hover:text-gray-900 transition-colors";
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar (Desktop) */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
            <span className="bg-blue-600 text-white p-1 rounded">TM</span> Admin
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {ADMIN_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={getLinkClasses(link.key)}
            >
              <link.Icon size={20} />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-md border-t border-gray-100">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-secondary hover:text-red-600 transition-colors"
          >
            <LogOut size={20} />
            Exit Admin
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:hidden shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft size={24} />
            </button>
            <span className="font-bold text-lg">TM Admin</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -mr-2 text-gray-600 hover:bg-gray-100 rounded-full"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Drawer */}
            <aside className="absolute right-0 top-0 bottom-0 w-64 bg-white shadow-xl flex flex-col">
              <div className="p-md flex items-center justify-between border-b border-gray-100">
                <span className="font-bold text-lg">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-secondary hover:bg-gray-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                {ADMIN_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={getLinkClasses(link.key)}
                  >
                    <link.Icon size={20} />
                    {link.label}
                  </Link>
                ))}
                <div className="pt-md mt-md border-t border-gray-100">
                  <Link
                    href="/"
                    className="flex items-center gap-3 px-4 py-3 text-secondary hover:text-red-600 transition-colors"
                  >
                    <LogOut size={20} />
                    Exit Admin
                  </Link>
                </div>
              </nav>
            </aside>
          </div>
        )}

        <div className="flex-1 overflow-auto p-md md:p-8">{children}</div>
      </main>
    </div>
  );
}
