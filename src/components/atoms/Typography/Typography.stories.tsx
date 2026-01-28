import type { Meta, StoryObj } from "@storybook/react";
import Typography from "./index";

const meta: Meta<typeof Typography> = {
  title: "Atoms/Typography",
  component: Typography,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Scale: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <Typography variant="sm">Upheader (12px)</Typography>
        <Typography variant="h1">Headline 1 (36px)</Typography>
      </div>
      <div>
        <Typography variant="sm">Headline 2</Typography>
        <Typography variant="h2">
          The quick brown fox jumps over the lazy dog
        </Typography>
      </div>
      <div>
        <Typography variant="sm">Headline 3</Typography>
        <Typography variant="h3">
          Explore the world with our travel app
        </Typography>
      </div>
      <div>
        <Typography variant="sm">Headline 4</Typography>
        <Typography variant="h4">Find your next adventure today</Typography>
      </div>
      <div>
        <Typography variant="sm">Paragraph</Typography>
        <Typography variant="p">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </Typography>
      </div>
    </div>
  ),
};

export const H1: Story = {
  args: {
    variant: "h1",
    children: "Headline 1",
  },
};

export const H2: Story = {
  args: {
    variant: "h2",
    children: "Headline 2",
  },
};
