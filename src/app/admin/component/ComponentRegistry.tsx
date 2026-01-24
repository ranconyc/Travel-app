"use client";

import React from "react";
import Button from "@/components/atoms/Button";
import Logo from "@/components/atoms/Logo";
import { Avatar } from "@/components/molecules/Avatar";
import DistanceBadge from "@/components/atoms/DistanceBadge";
import Input from "@/components/atoms/Input";

/**
 * A registry of components that have safe-to-render previews.
 * Usage: matches the filename (without extension) to a JSX Element.
 */
export const COMPONENT_PREVIEWS: Record<string, React.ReactNode> = {
  Button: <Button>Default Button</Button>,
  Logo: <Logo />,
  Avatar: (
    <Avatar
      image="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
      name="JD"
      size={48}
    />
  ),
  DistanceBadge: <DistanceBadge distanceLabel="12 km" />,
  Input: (
    <Input
      label="Example Input"
      placeholder="Type something..."
      name="example"
    />
  ),
  // Add more common components here as needed
};

export const getComponentPreview = (name: string) => {
  return COMPONENT_PREVIEWS[name] || null;
};
