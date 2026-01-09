import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Inter, Sora } from "next/font/google";
import ReactQueryProvider from "./providers/reactQueryProvider";
import SessionProviderWrapper from "./providers/SessionProviderWrapper";
import ConditionalNavbar from "./ConditionalNavbar";
import { SocketProvider } from "@/lib/socket/socket-context";

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
};

export const metadata: Metadata = {
  title: "Travel App",
  description: "Your personalized travel companion",
};

import { getCurrentUser } from "@/lib/auth/get-current-user";
import { UserProvider } from "./providers/UserProvider";
import React from "react";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://locationiq.org" />
      </head>
      <body
        className={`${sora.variable} ${inter.variable} antialiased`}
        suppressHydrationWarning
      >
        <UserProvider user={user}>
          <SessionProviderWrapper>
            <SocketProvider>
              <ReactQueryProvider>{children}</ReactQueryProvider>
            </SocketProvider>
          </SessionProviderWrapper>
          <ConditionalNavbar />
        </UserProvider>
      </body>
    </html>
  );
}
