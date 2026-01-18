import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Inter, Sora } from "next/font/google";
import ReactQueryProvider from "@/app/providers/reactQueryProvider";
import SessionProviderWrapper from "@/app/providers/SessionProviderWrapper";
import ConditionalNavbar from "@/app/ConditionalNavbar";
import { SocketProvider } from "@/lib/socket/socket-context";
import { LocationProvider } from "@/app/providers/LocationProvider";
import AutoLocationUpdater from "@/app/components/AutoLocationUpdater";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const sora = Sora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sora",
  weight: ["400", "500", "600", "700"], // pick what you need
});

export const viewport: Viewport = {
  themeColor: "#343a40",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Travel App",
  description: "Your personalized travel companion",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
};

import { getCurrentUser } from "@/lib/auth/get-current-user";
import { UserProvider } from "@/app/providers/UserProvider";
import React from "react";
import { Toaster } from "sonner";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${sora.variable} ${inter.variable} antialiased`}
        suppressHydrationWarning
      >
        <ReactQueryProvider>
          <UserProvider user={user}>
            <SessionProviderWrapper>
              <LocationProvider>
                <AutoLocationUpdater />
                <SocketProvider>{children}</SocketProvider>
              </LocationProvider>
            </SessionProviderWrapper>
            <ConditionalNavbar />
            <Toaster position="top-center" richColors />
          </UserProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
