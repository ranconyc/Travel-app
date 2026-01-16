"use client";

import Button from "@/app/component/common/Button";
import {
  Mail,
  Send,
  ChevronRight,
  Plus,
  Trash2,
  Heart,
  Palette,
  Type,
  MousePointer,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                 COMPONENTS                                 */
/* -------------------------------------------------------------------------- */

const Section = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <section className="flex flex-col gap-6">
    <h2 className="text-2xl font-bold font-sora flex items-center gap-3 border-b border-surface-secondary pb-4 text-app-text">
      {icon && <span className="text-brand">{icon}</span>}
      {title}
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {children}
    </div>
  </section>
);

const ColorCard = ({
  name,
  variable,
  hex, // approximate for display if useful, or just rely on bg
}: {
  name: string;
  variable: string;
  hex?: string;
  bgClass?: string;
}) => (
  <div className="bg-surface border border-surface-secondary rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
    <div
      className="h-24 w-full"
      style={{ backgroundColor: `var(${variable})` }}
    />
    <div className="p-4">
      <h3 className="font-bold text-lg mb-1">{name}</h3>
      <code className="text-xs bg-surface-secondary/50 px-2 py-1 rounded text-secondary font-mono block w-fit">
        {variable}
      </code>
      {hex && <p className="text-xs text-secondary mt-2">{hex}</p>}
    </div>
  </div>
);

const ButtonItem = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-2 p-4 bg-surface rounded-xl border border-surface-secondary items-center justify-center text-center hover:border-brand/30 transition-colors">
    <div className="flex-1 flex items-center justify-center min-h-[60px] w-full">
      {children}
    </div>
    <span className="text-[10px] uppercase tracking-wider font-bold text-secondary mt-2 opacity-70">
      {label}
    </span>
  </div>
);

/* -------------------------------------------------------------------------- */
/*                                    PAGE                                    */
/* -------------------------------------------------------------------------- */

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-app-bg p-8 text-app-text flex flex-col gap-16 max-w-7xl mx-auto pb-24">
      <header className="flex flex-col gap-4 mb-8">
        <h1 className="text-5xl font-bold font-sora tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand to-teal-500 w-fit">
          Design System
        </h1>
        <p className="text-secondary max-w-2xl leading-relaxed text-lg">
          The unified visual language of TravelMate. This reference guide
          showcases the core foundations: colors, typography, and interactive
          components.
        </p>
      </header>

      {/* ---------------- COLORS ---------------- */}
      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold font-sora flex items-center gap-3 border-b border-surface-secondary pb-4 text-app-text">
          <span className="text-brand">
            <Palette />
          </span>
          Color Palette
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <ColorCard
            name="Background"
            variable="--background"
            hex="rgb(244, 245, 247)"
          />
          <ColorCard
            name="Foreground"
            variable="--foreground"
            hex="rgb(15, 23, 42)"
          />
          <ColorCard name="Brand" variable="--brand" hex="rgb(1, 167, 120)" />
          <ColorCard
            name="Secondary"
            variable="--secondary"
            hex="rgb(94, 100, 112)"
          />
          <ColorCard
            name="Surface"
            variable="--surface"
            hex="rgb(255, 255, 255)"
          />
          <ColorCard
            name="Blur"
            variable="--blur"
            hex="rgba(161, 165, 173, 0.5)"
          />
        </div>
      </section>

      {/* ---------------- TYPOGRAPHY ---------------- */}
      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold font-sora flex items-center gap-3 border-b border-surface-secondary pb-4 text-app-text">
          <span className="text-brand">
            <Type />
          </span>
          Typography
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-surface p-8 rounded-xl border border-surface-secondary">
          <div className="space-y-4">
            <span className="text-xs font-bold text-secondary uppercase tracking-widest">
              Headings (Sora)
            </span>
            <div className="space-y-4">
              <h1 className="text-5xl font-bold">Heading 1</h1>
              <h2 className="text-4xl font-bold">Heading 2</h2>
              <h3 className="text-3xl font-bold">Heading 3</h3>
              <h4 className="text-2xl font-bold">Heading 4</h4>
            </div>
          </div>
          <div className="space-y-4">
            <span className="text-xs font-bold text-secondary uppercase tracking-widest">
              Body (Intro/Inter)
            </span>
            <div className="space-y-4 font-sans">
              <p className="text-lg">
                Lead Paragraph - The quick brown fox jumps over the lazy dog.
              </p>
              <p className="text-base text-secondary">
                Body Text - Efficiently unleash cross-media information without
                cross-media value. Quickly maximize timely deliverables for
                real-time schemas. Dramatically maintain clicks-and-mortar
                solutions without functional solutions.
              </p>
              <p className="text-xs text-secondary/70">
                Caption - 14 Jan 2024 • 5 min read
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- BUTTONS ---------------- */}
      <div className="flex flex-col gap-12">
        <div className="flex items-center gap-3 pb-2 border-b border-surface-secondary">
          <span className="text-brand">
            <MousePointer />
          </span>
          <h2 className="text-2xl font-bold font-sora text-app-text">
            Interactive Components
          </h2>
        </div>

        {/* Variants */}
        <Section title="Button Variants">
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
            <div className="bg-gray-900 p-4 rounded-lg w-full flex justify-center">
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
        <Section title="Layout & Container Integration">
          <ButtonItem label="fullWidth={true}">
            <div className="w-full">
              <Button fullWidth icon={<Plus size={18} />}>
                Add Component
              </Button>
            </div>
          </ButtonItem>
          <ButtonItem label="Flexbox Group">
            <div className="flex gap-2 flex-wrap justify-center">
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
        </Section>
      </div>
    </div>
  );
}
