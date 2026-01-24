import type { Meta, StoryObj } from "@storybook/react";
import { Autocomplete } from "./index";

const meta: Meta<typeof Autocomplete> = {
  title: "Form/Autocomplete",
  component: Autocomplete,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const LANGUAGES = [
  "English",
  "Hebrew",
  "Spanish",
  "French",
  "German",
  "Thai",
  "Japanese",
  "Italian",
];

export const LocalList: Story = {
  args: {
    name: "languages",
    label: "Native Language",
    placeholder: "Search languages...",
    options: LANGUAGES,
  },
};

export const RemoteSimulated: Story = {
  args: {
    name: "cities",
    label: "Search Cities",
    placeholder: "Start typing 'Bangkok'...",
    loadOptions: async (query) => {
      await new Promise((r) => setTimeout(r, 500));
      const all = [
        { id: "1", label: "Bangkok", subtitle: "Thailand" },
        { id: "2", label: "Paris", subtitle: "France" },
        { id: "3", label: "Berlin", subtitle: "Germany" },
      ];
      return all.filter((c) =>
        c.label.toLowerCase().includes(query.toLowerCase()),
      );
    },
  },
};

export const WithError: Story = {
  args: {
    name: "dest",
    label: "Destination",
    error: "Destination is required.",
    options: ["London", "New York"],
  },
};
