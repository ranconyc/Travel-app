import type { Meta, StoryObj } from "@storybook/react";
import WeatherWidget from "./index";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

const queryClient = new QueryClient();

const meta: Meta<typeof WeatherWidget> = {
  title: "Components/WeatherWidget",
  component: WeatherWidget,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Sunny: Story = {
  args: {
    lat: 13.7563,
    lng: 100.5018, // Bangkok
  },
};

export const London: Story = {
  args: {
    lat: 51.5074,
    lng: -0.1278,
  },
};
