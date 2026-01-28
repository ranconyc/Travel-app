import type { Meta, StoryObj } from "@storybook/react";
import Title from "./index";
import { MapPin, Calendar, Users } from "lucide-react";

const meta: Meta<typeof Title> = {
  title: "Atoms/Title",
  component: Title,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
      description: "Title text content",
    },
    as: {
      control: "select",
      options: ["h1", "h2", "h3", "h4", "h5", "h6"],
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
    children: "Page Title",
  },
};

export const H2: Story = {
  args: {
    children: "Section Title",
    as: "h2",
  },
};

export const H3: Story = {
  args: {
    children: "Subsection Title",
    as: "h3",
  },
};

export const WithIcon: Story = {
  args: {
    children: "Location",
    icon: <MapPin size={20} />,
  },
};

export const CalendarIcon: Story = {
  args: {
    children: "Events",
    icon: <Calendar size={20} />,
    as: "h2",
  },
};

export const UsersIcon: Story = {
  args: {
    children: "Community",
    icon: <Users size={20} />,
    as: "h3",
  },
};

export const CustomClass: Story = {
  args: {
    children: "Custom Styled Title",
    className: "text-2xl text-blue-600",
  },
};
