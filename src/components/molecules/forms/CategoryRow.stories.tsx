import type { Meta, StoryObj } from "@storybook/react";
import { CategoryRow } from "./CategoryRow";

const meta: Meta<typeof CategoryRow> = {
  title: "Molecules/Forms/CategoryRow",
  component: CategoryRow,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "The category title to display",
    },
    selectedCount: {
      control: { type: "number", min: 0, max: 50 },
      description: "Number of selected items in this category",
    },
    variant: {
      control: "select",
      options: ["default", "compact"],
      description: "Visual variant of the row",
    },
  },
  args: {
    onClick: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof CategoryRow>;

export const Default: Story = {
  args: {
    title: "Food & Dining",
    selectedCount: 0,
    variant: "default",
  },
};

export const WithSelections: Story = {
  args: {
    title: "Outdoor Activities",
    selectedCount: 5,
    variant: "default",
  },
};

export const Compact: Story = {
  args: {
    title: "Arts & Culture",
    selectedCount: 3,
    variant: "compact",
  },
};

export const LongTitle: Story = {
  args: {
    title: "Historical Sites and Ancient Architecture",
    selectedCount: 12,
    variant: "default",
  },
};

export const MultipleRows: Story = {
  render: () => (
    <div className="space-y-2">
      <CategoryRow title="Food & Dining" selectedCount={0} onClick={() => {}} />
      <CategoryRow
        title="Outdoor Activities"
        selectedCount={5}
        onClick={() => {}}
      />
      <CategoryRow
        title="Arts & Culture"
        selectedCount={3}
        onClick={() => {}}
      />
      <CategoryRow title="Nightlife" selectedCount={0} onClick={() => {}} />
    </div>
  ),
};
