import type { Meta, StoryObj } from "@storybook/react";
import Card from "./index";
import Typography from "../Typography";
import React from "react";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-8 w-64 h-64 flex flex-col justify-end bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-3xl">
        <Typography variant="h3">Amsterdam</Typography>
        <Typography variant="p">Netherlands</Typography>
      </div>
    ),
    hover: true,
  },
};

export const SurfaceSecondary: Story = {
  args: {
    variant: "surface-secondary",
    className: "p-6 w-80",
    children: (
      <div className="flex flex-col gap-md">
        <Typography variant="h4">System Info</Typography>
        <Typography variant="p">
          This card uses the surface-secondary background variation common in
          dashboards.
        </Typography>
      </div>
    ),
  },
};

export const Plain: Story = {
  args: {
    variant: "surface",
    hover: false,
    className: "p-6 w-64",
    children: (
      <Typography variant="p" className="text-center">
        A simple card without hover effects.
      </Typography>
    ),
  },
};
