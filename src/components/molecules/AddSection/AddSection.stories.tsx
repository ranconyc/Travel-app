import type { Meta, StoryObj } from "@storybook/react";
import AddSection from "./index";

const meta: Meta<typeof AddSection> = {
  title: "Molecules/AddSection",
  component: AddSection,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Section title",
    },
    link: {
      control: "object",
      description: "Link object with href and label",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Add Destination",
    link: {
      href: "/destinations/add",
      label: "Add new destination",
    },
  },
};

export const Minimal: Story = {
  args: {
    title: "Add More",
    link: {
      href: "/add",
      label: "Add item",
    },
  },
};

export const Companion: Story = {
  args: {
    title: "Add Travel Companion",
    link: {
      href: "/companions/invite",
      label: "Invite friend",
    },
  },
};

export const CustomLink: Story = {
  args: {
    title: "Quick Add",
    link: {
      href: "/quick-add",
      label: "Add quickly",
    },
  },
};
