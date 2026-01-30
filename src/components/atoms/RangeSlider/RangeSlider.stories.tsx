import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import RangeSlider from "./index";

const meta: Meta<typeof RangeSlider> = {
  title: "Atoms/RangeSlider",
  component: RangeSlider,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: 300, padding: 20 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive wrapper for controlled state
const RangeSliderDemo = (props: React.ComponentProps<typeof RangeSlider>) => {
  const [value, setValue] = useState<[number, number]>(props.value);
  return <RangeSlider {...props} value={value} onChange={setValue} />;
};

export const Age: Story = {
  render: () => (
    <RangeSliderDemo
      min={18}
      max={80}
      value={[25, 45]}
      onChange={() => {}}
      label="Age Range"
      unit=" yrs"
    />
  ),
};

export const Distance: Story = {
  render: () => (
    <RangeSliderDemo
      min={1}
      max={500}
      value={[10, 100]}
      onChange={() => {}}
      label="Distance"
      unit=" km"
      step={5}
    />
  ),
};

export const NoLabel: Story = {
  render: () => (
    <RangeSliderDemo min={0} max={100} value={[20, 80]} onChange={() => {}} />
  ),
};
