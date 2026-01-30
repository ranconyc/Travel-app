import type { Meta, StoryObj } from "@storybook/react";
import PhraseCard from "./index";

const meta: Meta<typeof PhraseCard> = {
  title: "Molecules/PhraseCard",
  component: PhraseCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    phrase: {
      control: "object",
    },
  },
};

export default meta;
type Story = StoryObj<typeof PhraseCard>;

export const Basics: Story = {
  args: {
    phrase: {
      label: "Hello",
      local: "こんにちは",
      romanized: "Konnichiwa",
      category: "Basics",
    },
  },
};

export const Dining: Story = {
  args: {
    phrase: {
      label: "Delicious",
      local: "おいしい",
      romanized: "Oishii",
      category: "Dining",
    },
  },
};

export const Transport: Story = {
  args: {
    phrase: {
      label: "Where is the station?",
      local: "駅はどこですか？",
      romanized: "Eki wa doko desu ka?",
      category: "Transport",
    },
  },
};

export const Emergency: Story = {
  args: {
    phrase: {
      label: "Help!",
      local: "助けて！",
      romanized: "Tasukete!",
      category: "Emergency",
    },
  },
};

export const GridView: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
      <PhraseCard
        phrase={{
          label: "Thank you",
          local: "ありがとう",
          romanized: "Arigatou",
          category: "Basics",
        }}
      />
      <PhraseCard
        phrase={{
          label: "Water, please",
          local: "お水ください",
          romanized: "Omizu kudasai",
          category: "Dining",
        }}
      />
      <PhraseCard
        phrase={{
          label: "Taxi",
          local: "タクシー",
          romanized: "Takushii",
          category: "Transport",
        }}
      />
      <PhraseCard
        phrase={{
          label: "Hospital",
          local: "病院",
          romanized: "Byouin",
          category: "Emergency",
        }}
      />
    </div>
  ),
};
