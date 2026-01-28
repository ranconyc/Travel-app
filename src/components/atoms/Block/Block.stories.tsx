import type { Meta, StoryObj } from "@storybook/react";
import Block from "./index";

const meta: Meta<typeof Block> = {
  title: "Atoms/Block",
  component: Block,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    as: {
      control: "select",
      options: ["div", "section", "article", "main", "aside"],
      description: "HTML element to render as",
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
    children: (
      <div>
        <h3 className="text-lg font-semibold mb-2">Block Content</h3>
        <p className="text-sm text-gray-600">
          This is the default block component with surface styling and shadow.
        </p>
      </div>
    ),
  },
};

export const AsSection: Story = {
  args: {
    as: "section",
    children: (
      <div>
        <h3 className="text-lg font-semibold mb-2">Section Block</h3>
        <p className="text-sm text-gray-600">
          This block renders as a semantic section element.
        </p>
      </div>
    ),
  },
};

export const WithCustomClass: Story = {
  args: {
    className: "w-fit",
    children: (
      <div>
        <h3 className="text-lg font-semibold mb-2">Fit Width Block</h3>
        <p className="text-sm text-gray-600">
          This block has custom width styling.
        </p>
      </div>
    ),
  },
};

export const Minimal: Story = {
  args: {
    children: <p>Simple content in a block.</p>,
  },
};
