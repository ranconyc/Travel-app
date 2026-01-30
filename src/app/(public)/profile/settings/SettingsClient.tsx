"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import {
  LogOut,
  User,
  Bell,
  Shield,
  Palette,
  HelpCircle,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import Typography from "@/components/atoms/Typography";

interface SettingsItem {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "danger";
}

export default function SettingsClient({ userId }: { userId: string }) {
  const settingsItems: SettingsItem[] = [
    {
      icon: <User size={20} />,
      label: "Edit Profile",
      href: "/profile/edit",
    },
    {
      icon: <Bell size={20} />,
      label: "Notifications",
      href: "/profile/settings/notifications",
    },
    {
      icon: <Shield size={20} />,
      label: "Privacy & Security",
      href: "/profile/settings/privacy",
    },
    {
      icon: <Palette size={20} />,
      label: "Appearance",
      href: "/profile/settings/appearance",
    },
    {
      icon: <HelpCircle size={20} />,
      label: "Help & Support",
      href: "/profile/settings/help",
    },
  ];

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="sticky top-0 z-sticky bg-surface/95 backdrop-blur-md border-b border-surface-secondary">
        <div className="flex items-center justify-between px-md py-sm">
          <Link
            href={`/profile/${userId}`}
            className="flex items-center gap-2 text-txt-sec hover:text-txt-main transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="sr-only">Back</span>
          </Link>
          <Typography variant="h4" className="font-semibold">
            Settings
          </Typography>
          <div className="w-6" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-md py-lg">
        {/* Settings Items */}
        <div className="bg-surface-secondary rounded-2xl overflow-hidden mb-lg">
          {settingsItems.map((item, index) => (
            <Link
              key={item.label}
              href={item.href || "#"}
              className={`flex items-center justify-between px-lg py-md hover:bg-surface transition-colors ${
                index !== settingsItems.length - 1
                  ? "border-b border-stroke"
                  : ""
              }`}
            >
              <div className="flex items-center gap-md">
                <span className="text-txt-sec">{item.icon}</span>
                <Typography variant="p">{item.label}</Typography>
              </div>
              <ChevronRight size={18} className="text-txt-muted" />
            </Link>
          ))}
        </div>

        {/* Logout Button */}
        <div className="bg-surface-secondary rounded-2xl overflow-hidden">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-md px-lg py-md hover:bg-error/10 transition-colors text-error"
          >
            <LogOut size={20} />
            <Typography variant="p" className="text-error">
              Log Out
            </Typography>
          </button>
        </div>

        {/* Version Info */}
        <div className="mt-xl text-center">
          <Typography variant="tiny" className="text-txt-muted">
            Version 1.0.0
          </Typography>
        </div>
      </main>
    </div>
  );
}
