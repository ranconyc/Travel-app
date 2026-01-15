"use client";

import Button from "@/app/component/common/Button";
import {
  Mail,
  Send,
  ChevronRight,
  Settings,
  Plus,
  Trash2,
  Heart,
} from "lucide-react";

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="flex flex-col gap-6">
    <h2 className="text-xl font-semibold border-b border-surface pb-2 text-primary">
      {title}
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {children}
    </div>
  </section>
);

const ButtonItem = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-2 p-4 bg-surface rounded-xl border border-blur items-center justify-center text-center">
    <div className="flex-1 flex items-center justify-center min-h-[60px]">
      {children}
    </div>
    <span className="text-[10px] uppercase tracking-wider font-bold text-secondary mt-2 opacity-70">
      {label}
    </span>
  </div>
);

export default function ButtonsShowcase() {
  return (
    <div className="min-h-screen bg-app-bg p-8 text-app-text flex flex-col gap-16 max-w-7xl mx-auto pb-24">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold font-sora tracking-tight">
          Design System: Buttons
        </h1>
        <p className="text-secondary max-w-2xl leading-relaxed">
          The consolidated global Button component. Built to be the single
          source of truth for all interactive actions across the application.
        </p>
      </header>

      {/* Variants */}
      <Section title="Visual Variants">
        <ButtonItem label='variant="primary"'>
          <Button variant="primary">Primary Action</Button>
        </ButtonItem>
        <ButtonItem label='variant="secondary"'>
          <Button variant="secondary">Secondary Action</Button>
        </ButtonItem>
        <ButtonItem label='variant="outline"'>
          <Button variant="outline">Outline Button</Button>
        </ButtonItem>
        <ButtonItem label='variant="ghost"'>
          <Button variant="ghost">Ghost Button</Button>
        </ButtonItem>
        <ButtonItem label='variant="teal"'>
          <Button variant="teal">Teal Highlight</Button>
        </ButtonItem>
        <ButtonItem label='variant="dark"'>
          <Button variant="dark">Dark Variant</Button>
        </ButtonItem>
        <ButtonItem label='variant="outline-white" (on dark)'>
          <div className="bg-gray-900 p-4 rounded-lg">
            <Button variant="outline-white">White Outline</Button>
          </div>
        </ButtonItem>
        <ButtonItem label='variant="back"'>
          <Button variant="back" />
        </ButtonItem>
      </Section>

      {/* Sizes */}
      <Section title="Sizes">
        <ButtonItem label='size="sm"'>
          <Button size="sm">Small Button</Button>
        </ButtonItem>
        <ButtonItem label='size="md" (Default)'>
          <Button size="md">Medium Button</Button>
        </ButtonItem>
        <ButtonItem label='size="lg"'>
          <Button size="lg">Large Button</Button>
        </ButtonItem>
      </Section>

      {/* States */}
      <Section title="Interactive States">
        <ButtonItem label="loading={true}">
          <Button loading>Processing</Button>
        </ButtonItem>
        <ButtonItem label="disabled={true}">
          <Button disabled>Not Clickable</Button>
        </ButtonItem>
        <ButtonItem label="Hover / Active">
          <Button className="hover:ring-4 hover:ring-brand/20 transition-all">
            Interactive
          </Button>
        </ButtonItem>
        <ButtonItem label="Loading Secondary">
          <Button variant="secondary" loading>
            Saving...
          </Button>
        </ButtonItem>
      </Section>

      {/* Icons & Composition */}
      <Section title="Icon Composition">
        <ButtonItem label="Icon Left">
          <Button icon={<Mail size={18} />}>Contact Us</Button>
        </ButtonItem>
        <ButtonItem label="Icon Right">
          <Button icon={<Send size={18} />} iconPosition="right">
            Send Update
          </Button>
        </ButtonItem>
        <ButtonItem label="Icon Only (Primary)">
          <Button icon={<Plus size={18} />} />
        </ButtonItem>
        <ButtonItem label="Icon Only (Secondary)">
          <Button
            icon={<Heart size={18} className="text-red-500 fill-red-500" />}
            variant="secondary"
          />
        </ButtonItem>
        <ButtonItem label="Complex Content">
          <Button
            variant="teal"
            icon={<ChevronRight size={18} />}
            iconPosition="right"
          >
            Get Started Now
          </Button>
        </ButtonItem>
        <ButtonItem label="Icon Size Sm">
          <Button size="sm" icon={<Plus size={14} />}>
            Add
          </Button>
        </ButtonItem>
        <ButtonItem label="Icon Size Lg">
          <Button size="lg" icon={<Trash2 size={24} />} variant="dark">
            Delete
          </Button>
        </ButtonItem>
      </Section>

      {/* Layout Variations */}
      <section className="flex flex-col gap-6">
        <h2 className="text-xl font-semibold border-b border-surface pb-2 text-primary">
          Layout & Container Integration
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ButtonItem label="fullWidth={true}">
            <div className="w-full max-w-xs">
              <Button fullWidth icon={<Plus size={18} />}>
                Add Component
              </Button>
            </div>
          </ButtonItem>
          <ButtonItem label="Flexbox Group">
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                Discard
              </Button>
              <Button variant="primary" size="sm">
                Save Draft
              </Button>
              <Button variant="teal" size="sm">
                Publish
              </Button>
            </div>
          </ButtonItem>
        </div>
      </section>
    </div>
  );
}
