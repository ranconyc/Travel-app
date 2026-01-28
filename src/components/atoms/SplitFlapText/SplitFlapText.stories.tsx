import type { Meta, StoryObj } from "@storybook/react";
import SplitFlapText from "./index";

const meta: Meta<typeof SplitFlapText> = {
  title: "Atoms/SplitFlapText",
  component: SplitFlapText,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    text: {
      control: "text",
      description: "Text to display with split-flap animation",
    },
    speed: {
      control: "select",
      options: ["slow", "normal", "fast"],
      description: "Animation speed",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: "HELLO",
    speed: "normal",
  },
};

export const Slow: Story = {
  args: {
    text: "SLOW",
    speed: "slow",
  },
};

export const Fast: Story = {
  args: {
    text: "FAST",
    speed: "fast",
  },
};

export const WithNumbers: Story = {
  args: {
    text: "2024",
    speed: "normal",
  },
};

export const LongText: Story = {
  args: {
    text: "TRAVEL APP",
    speed: "normal",
  },
};

export const WithSpaces: Story = {
  args: {
    text: "HELLO WORLD",
    speed: "normal",
  },
};

export const SmallText: Story = {
  args: {
    text: "Small",
    speed: "normal",
    className: "text-sm",
  },
};

export const LargeText: Story = {
  args: {
    text: "Large",
    speed: "normal",
    className: "text-2xl font-bold",
  },
};

export const MultipleTexts: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <SplitFlapText text="Welcome" />
      </div>
      <div>
        <SplitFlapText text="to Travel App" className="text-xl" />
      </div>
      <div>
        <SplitFlapText text="2024" className="text-3xl font-mono" />
      </div>
    </div>
  ),
};
