"use client";

import React, { useState, useEffect } from "react";
import Button from "@/app/components/common/Button";
import {
  Mail,
  Send,
  ChevronRight,
  Plus,
  Trash2,
  Heart,
  Palette,
  MousePointer,
  Sun,
  Moon,
  CheckSquare,
} from "lucide-react";

import Input from "@/app/components/form/Input";
import SelectionCard from "@/app/components/form/SelectionCard";
import SelectedItem from "@/app/components/common/SelectedItem";

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
  hex,
}: {
  name: string;
  variable: string;
  hex?: string;
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
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`flex flex-col gap-2 p-4 bg-surface rounded-xl border border-surface-secondary items-center justify-center text-center hover:border-brand/30 transition-colors ${className}`}
  >
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
  const [isDark, setIsDark] = useState(false);
  const [selected, setSelected] = useState<string[]>(["1"]);
  const [interests, setInterests] = useState([
    "Local Food",
    "Hiking",
    "Photography",
  ]);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [isDark]);

  const handleToggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const removeInterest = (item: string) => {
    setInterests((prev) => prev.filter((i) => i !== item));
  };

  return (
    <div className="min-h-screen bg-app-bg p-8 text-app-text flex flex-col gap-16 max-w-7xl mx-auto pb-24">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-5xl font-bold font-sora tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand to-teal-500 w-fit">
            Design System
          </h1>
          <p className="text-secondary max-w-2xl leading-relaxed text-lg">
            The unified visual language of TravelMate. Consolidating components
            and testing themes in one playground.
          </p>
        </div>

        <div className="bg-surface p-2 rounded-2xl border border-surface-secondary flex gap-2 shadow-sm">
          <Button
            variant={!isDark ? "primary" : "ghost"}
            size="sm"
            onClick={() => setIsDark(false)}
            icon={<Sun size={16} />}
          >
            Light
          </Button>
          <Button
            variant={isDark ? "primary" : "ghost"}
            size="sm"
            onClick={() => setIsDark(true)}
            icon={<Moon size={16} />}
          >
            Dark
          </Button>
        </div>
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
          <ColorCard name="Background" variable="--background" />
          <ColorCard name="Foreground" variable="--foreground" />
          <ColorCard name="Brand" variable="--brand" />
          <ColorCard name="Secondary" variable="--secondary" />
          <ColorCard name="Surface" variable="--surface" />
          <ColorCard name="Blur" variable="--blur" />
        </div>
      </section>

      {/* ---------------- FORM ELEMENTS ---------------- */}
      <section className="flex flex-col gap-8">
        <h2 className="text-2xl font-bold font-sora flex items-center gap-3 border-b border-surface-secondary pb-4 text-app-text">
          <span className="text-brand">
            <CheckSquare />
          </span>
          Form & Selection
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Inputs */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-secondary uppercase tracking-widest">
              Text Inputs
            </h3>
            <div className="grid gap-4">
              <Input label="Name" placeholder="Enter traveler name..." />
              <Input
                label="Email"
                type="email"
                placeholder="hello@travelmate.com"
              />
              <Input
                label="Error State"
                error="This field is required"
                defaultValue="Invalid input"
              />
              <Input
                label="Disabled"
                disabled
                defaultValue="Static dynamic data"
              />
            </div>
          </div>

          {/* Selection */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-secondary uppercase tracking-widest">
              Multi-Selection Cards
            </h3>
            <div className="grid gap-3">
              <SelectionCard
                id="1"
                label="Adventure"
                description="Hiking, trekking and more"
                isSelected={selected.includes("1")}
                onChange={handleToggle}
                icon={Sun}
              />
              <SelectionCard
                id="2"
                label="Relaxation"
                description="Spas, beaches and chill"
                isSelected={selected.includes("2")}
                onChange={handleToggle}
                icon={Moon}
              />
            </div>

            <div className="pt-4 space-y-3">
              <h3 className="text-sm font-bold text-secondary uppercase tracking-widest">
                Tags / Pills
              </h3>
              <ul className="flex flex-wrap gap-2">
                {interests.map((i) => (
                  <SelectedItem
                    key={i}
                    item={i}
                    onClick={() => removeInterest(i)}
                  />
                ))}
                {interests.length === 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setInterests(["Local Food", "Hiking", "Photography"])
                    }
                  >
                    Reset Tags
                  </Button>
                )}
              </ul>
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
          <ButtonItem label="fullWidth={true}" className="lg:col-span-2">
            <div className="w-full">
              <Button fullWidth icon={<Plus size={18} />}>
                Add Component
              </Button>
            </div>
          </ButtonItem>
          <ButtonItem label="Flexbox Group" className="lg:col-span-2">
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
