import type { Meta, StoryObj } from "@storybook/react";
import AutoLocationUpdater from "./index";

// Mock the providers for Storybook
const MockUserProvider = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
);

const MockLocationProvider = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
);

const meta: Meta<typeof AutoLocationUpdater> = {
  title: "Molecules/AutoLocationUpdater",
  component: AutoLocationUpdater,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <MockUserProvider>
        <MockLocationProvider>
          <Story />
        </MockLocationProvider>
      </MockUserProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithUser: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: "This component runs automatically when user is logged in and location is available. It doesn't render any visible content - it's a utility component that handles location updates in the background.",
      },
    },
  },
};
