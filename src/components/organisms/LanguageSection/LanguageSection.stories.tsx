import type { Meta, StoryObj } from "@storybook/react";
import LanguageSection from "./index";
import React from "react";

const meta: Meta<typeof LanguageSection> = {
  title: "Organisms/LanguageSection",
  component: LanguageSection,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    languagesEnglish: "Thai",
    languageNative: "ภาษาไทย",
    englishProficiencyNote:
      "Medium. High in tourist areas like Sukhumvit or Phuket.",
    usefulPhrases: [
      { en: "Hello", local: "Sawatdee" },
      { en: "Thank you", local: "Khop khun" },
      { en: "Water", local: "Nam" },
      { en: "How much?", local: "Tao rai?" },
    ],
  },
};
