import type { Meta, StoryObj } from "@storybook/react";
import HomeHeroSearch from "./index";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const meta: Meta<typeof HomeHeroSearch> = {
  title: "Organisms/HomeHeroSearch",
  component: HomeHeroSearch,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-[600px] p-4 bg-gray-100/50">
        <QueryClientProvider client={queryClient}>
          <Story />
        </QueryClientProvider>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof HomeHeroSearch>;

export const Default: Story = {};
