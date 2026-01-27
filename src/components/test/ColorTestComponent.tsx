"use client";

import { useTheme } from "@/providers/ThemeProvider";
import Typography from "@/components/atoms/Typography/enhanced";

export default function ColorTestComponent() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Toggle Dark Mode */}
        <div className="flex items-center justify-between">
          <Typography variant="h2">Color System Test</Typography>
          <div className="flex gap-2">
            <button
              onClick={() => setTheme("light")}
              className={`px-4 py-2 rounded-lg ${
                theme === "light" 
                  ? "bg-brand text-white" 
                  : "bg-surface text-secondary"
              }`}
            >
              ☀️ Light
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`px-4 py-2 rounded-lg ${
                theme === "dark" 
                  ? "bg-brand text-white" 
                  : "bg-surface text-secondary"
              }`}
            >
              🌙 Dark
            </button>
            <button
              onClick={() => setTheme("system")}
              className={`px-4 py-2 rounded-lg ${
                theme === "system" 
                  ? "bg-brand text-white" 
                  : "bg-surface text-secondary"
              }`}
            >
              💻 System
            </button>
          </div>
        </div>

        {/* Current Theme Info */}
        <div className="bg-surface p-4 rounded-lg border border-stroke">
          <Typography variant="body">
            Current Theme: <strong>{theme}</strong> | 
            Resolved Theme: <strong>{resolvedTheme}</strong>
          </Typography>
        </div>

        {/* Semantic Colors Test */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-success border-success p-4 rounded-lg">
            <Typography variant="h3" className="text-success">Success</Typography>
            <Typography variant="body" className="text-success">Success message</Typography>
          </div>
          
          <div className="bg-warning border-warning p-4 rounded-lg">
            <Typography variant="h3" className="text-warning">Warning</Typography>
            <Typography variant="body" className="text-warning">Warning message</Typography>
          </div>
          
          <div className="bg-error border-error p-4 rounded-lg">
            <Typography variant="h3" className="text-error">Error</Typography>
            <Typography variant="body" className="text-error">Error message</Typography>
          </div>
          
          <div className="bg-info border-info p-4 rounded-lg">
            <Typography variant="h3" className="text-info">Info</Typography>
            <Typography variant="body" className="text-info">Info message</Typography>
          </div>
        </div>

        {/* Interactive States Test */}
        <div className="space-y-4">
          <Typography variant="h4">Interactive States</Typography>
          <div className="flex gap-2">
            <button className="bg-hover px-4 py-2 rounded-lg">Hover State</button>
            <button className="bg-active px-4 py-2 rounded-lg">Active State</button>
            <button className="bg-focus px-4 py-2 rounded-lg">Focus State</button>
            <button className="text-disabled bg-disabled px-4 py-2 rounded-lg">Disabled</button>
          </div>
        </div>

        {/* Gradients Test */}
        <div className="space-y-4">
          <Typography variant="h4">Gradients</Typography>
          <div className="bg-gradient-brand p-4 rounded-lg">
            <Typography variant="h3" className="text-gradient">Brand Gradient</Typography>
          </div>
          
          <div className="bg-gradient-warm p-4 rounded-lg">
            <Typography variant="h3" className="text-white">Warm Gradient</Typography>
          </div>
        </div>

        {/* Surface Colors Test */}
        <div className="space-y-4">
          <Typography variant="h4">Surface Colors</Typography>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-surface p-4 rounded-lg border border-stroke">
              <Typography variant="h4">Surface</Typography>
            </div>
            <div className="bg-surface-secondary p-4 rounded-lg border border-stroke">
              <Typography variant="h4">Surface Secondary</Typography>
            </div>
            <div className="bg-surface-hover p-4 rounded-lg border border-stroke">
              <Typography variant="h4">Surface Hover</Typography>
            </div>
          </div>
        </div>

        {/* Typography Colors Test */}
        <div className="space-y-4">
          <Typography variant="h4">Typography Colors</Typography>
          <div className="bg-surface p-4 rounded-lg border border-stroke space-y-2">
            <Typography variant="body" className="text-primary">Primary Text</Typography>
            <Typography variant="body" className="text-secondary">Secondary Text</Typography>
            <Typography variant="body" className="text-muted">Muted Text</Typography>
            <Typography variant="body" className="text-inverse">Inverse Text</Typography>
          </div>
        </div>
      </div>
    </div>
  );
}
