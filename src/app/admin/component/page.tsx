import { promises as fs } from "fs";
import path from "path";
import React from "react";

type ComponentInfo = {
  name: string;
  path: string;
  type: "COMMON" | "PAGE_SPECIFIC";
  page?: string;
};

async function getFiles(dir: string): Promise<string[]> {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? getFiles(res) : res;
    })
  );
  return Array.prototype.concat(...files);
}

// Check if file is a React component (heuristic: starts with Capital letter, ends with .tsx)
function isComponentFile(filename: string) {
  const base = path.basename(filename);
  return (
    (base.endsWith(".tsx") || base.endsWith(".jsx")) &&
    /^[A-Z]/.test(base) &&
    !base.startsWith("layout") &&
    !base.startsWith("page") &&
    !base.startsWith("loading") &&
    !base.startsWith("error")
  );
}

async function getCommonComponents(): Promise<ComponentInfo[]> {
  const componentsDir = path.join(process.cwd(), "src/app/component");
  try {
    const allFiles = await getFiles(componentsDir);
    return allFiles
      .filter((f) => isComponentFile(f))
      .map((f) => ({
        name: path.basename(f, path.extname(f)),
        path: f.split("src/app")[1],
        type: "COMMON",
      }));
  } catch (e) {
    console.error("Error scanning common components", e);
    return [];
  }
}

async function getPageSpecificComponents(): Promise<ComponentInfo[]> {
  const appDir = path.join(process.cwd(), "src/app");
  try {
    const allFiles = await getFiles(appDir);
    return allFiles
      .filter((f) => f.includes("/_components/") && isComponentFile(f))
      .map((f) => {
        // Extract page path: everything before /_components/
        const relativePath = f.split("src/app")[1];
        const pagePath = relativePath.split("/_components/")[0];
        return {
          name: path.basename(f, path.extname(f)),
          path: relativePath,
          type: "PAGE_SPECIFIC",
          page: pagePath || "/", // Root if empty
        };
      });
  } catch (e) {
    console.error("Error scanning page components", e);
    return [];
  }
}

import ComponentViewer from "@/app/admin/component/ComponentViewer";

// ... (keep scan functions: getFiles, isComponentFile, getCommonComponents, getPageSpecificComponents)

export default async function AdminComponentsPage() {
  const common = await getCommonComponents();
  const pageSpecific = await getPageSpecificComponents();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold font-sora tracking-tight mb-2">
          Component Inventory
        </h1>
        <p className="text-secondary max-w-2xl leading-relaxed">
          An automated breakdown of all React components in the codebase.
        </p>
      </header>

      <ComponentViewer common={common} pageSpecific={pageSpecific} />
    </div>
  );
}
