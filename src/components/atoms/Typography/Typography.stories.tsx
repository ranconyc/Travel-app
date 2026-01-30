import type { Meta, StoryObj } from "@storybook/react";
import Typography from "./index";

const meta: Meta<typeof Typography> = {
  title: "Atoms/Typography",
  component: Typography,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "h1",
        "h2",
        "h3",
        "h4",
        "p",
        "body-lg",
        "body",
        "body-sm",
        "display-xl",
        "display-lg",
        "display-md",
        "display-sm",
        "ui-lg",
        "ui",
        "ui-sm",
        "label",
        "label-sm",
        "caption",
        "caption-sm",
        "tiny",
        "micro",
      ],
    },
    weight: {
      control: "select",
      options: ["light", "normal", "medium", "semibold", "bold", "black"],
    },
    color: {
      control: "select",
      options: [
        "main",
        "sec",
        "brand",
        "error",
        "inverse",
        "success",
        "warning",
        "white",
        "muted",
      ],
    },
    wrap: {
      control: "select",
      options: ["balance", "pretty", "nowrap", "normal"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Scale: Story = {
  render: () => (
    <div className="flex flex-col gap-8 max-w-2xl">
      <section className="space-y-4">
        <Typography variant="micro" color="brand">
          Headlines (Sora)
        </Typography>
        <div className="flex flex-col gap-2">
          <Typography variant="h1">Headline 1</Typography>
          <Typography variant="h2">Headline 2</Typography>
          <Typography variant="h3">Headline 3</Typography>
          <Typography variant="h4">Headline 4</Typography>
        </div>
      </section>

      <section className="space-y-4">
        <Typography variant="micro" color="brand">
          Display (Hero)
        </Typography>
        <div className="flex flex-col gap-2">
          <Typography variant="display-xl">Display XL</Typography>
          <Typography variant="display-lg">Display LG</Typography>
        </div>
      </section>

      <section className="space-y-4">
        <Typography variant="micro" color="brand">
          Body Text (Inter)
        </Typography>
        <div className="flex flex-col gap-2">
          <Typography variant="body-lg">
            Body Large - Premium reading experience
          </Typography>
          <Typography variant="body">
            Body Default - Standard content
          </Typography>
          <Typography variant="body-sm">
            Body Small - Secondary information
          </Typography>
        </div>
      </section>

      <section className="space-y-4">
        <Typography variant="micro" color="brand">
          UI & Labels
        </Typography>
        <div className="flex flex-wrap gap-4 items-center">
          <Typography variant="ui">UI Default</Typography>
          <Typography variant="label">Label Bold</Typography>
          <Typography variant="caption">Caption Text</Typography>
          <Typography variant="micro">Micro Tag</Typography>
        </div>
      </section>

      <section className="space-y-4">
        <Typography variant="micro" color="brand">
          Body Text & Orphans
        </Typography>
        <div className="grid grid-cols-2 gap-8">
          <div className="p-4 border border-dashed border-surface-secondary rounded-lg">
            <Typography variant="micro" className="mb-2 text-txt-muted">
              Normal wrapping
            </Typography>
            <Typography variant="p" wrap="normal">
              Travel around the world and find the most beautiful places to stay
              and explore.
            </Typography>
          </div>
          <div className="p-4 border border-solid border-brand/20 bg-brand/5 rounded-lg">
            <Typography variant="micro" className="mb-2 text-brand">
              2026 Pretty wrapping (No Orphans)
            </Typography>
            <Typography variant="p" wrap="pretty">
              Travel around the world and find the most beautiful places to stay
              and explore.
            </Typography>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <Typography variant="micro" color="brand">
          Atomic Weights
        </Typography>
        <div className="flex flex-wrap gap-4 items-end">
          <Typography variant="h2" weight="light">
            Light
          </Typography>
          <Typography variant="h2" weight="normal">
            Normal
          </Typography>
          <Typography variant="h2" weight="medium">
            Medium
          </Typography>
          <Typography variant="h2" weight="semibold">
            Semibold
          </Typography>
          <Typography variant="h2" weight="bold">
            Bold
          </Typography>
          <Typography variant="h2" weight="black">
            Black
          </Typography>
        </div>
      </section>

      <section className="space-y-4">
        <Typography variant="micro" color="brand">
          Loading States (Built-in)
        </Typography>
        <div className="space-y-2">
          <Typography isLoading variant="h1" />
          <Typography isLoading variant="p" className="w-1/2" />
        </div>
      </section>
    </div>
  ),
};

export const Interactive: Story = {
  args: {
    variant: "h1",
    children: "Editable Typography",
  },
};

export const Skeleton: Story = {
  args: {
    isLoading: true,
    variant: "h2",
  },
};
