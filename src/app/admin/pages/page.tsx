import fs from "fs/promises";
import path from "path";
import { Shield, Globe } from "lucide-react";

type PageInfo = {
  route: string;
  filePath: string;
  isProtected: boolean;
  type: "STATIC" | "DYNAMIC";
};

// Helper to check if a route matches the middleware config
// Simple implementation for the current known patterns
function checkProtection(route: string, matchers: string[]) {
  return matchers.some((m) => {
    // Remove :path* or similar for prefix checking
    const prefix = m.replace("/:path*", "").replace("/:path", "");
    if (m === "/:path*") return true; // Protects everything
    return route.startsWith(prefix);
  });
}

async function getPages(dir: string, baseDir: string): Promise<string[]> {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? getPages(res, baseDir) : res;
    }),
  );
  return Array.prototype.concat(...files);
}

async function getMatcherConfig() {
  try {
    const proxyPath = path.join(process.cwd(), "src/proxy.ts");
    const content = await fs.readFile(proxyPath, "utf-8");
    // Simple regex to find the matcher array
    // Matches: matcher: [ ... ]
    const match = content.match(/matcher:\s*\[([\s\S]*?)\]/);
    if (match && match[1]) {
      return match[1]
        .split(",")
        .map((s) => s.trim().replace(/['"]/g, ""))
        .filter((s) => s.length > 0);
    }
  } catch (e) {
    console.error("Could not read proxy.ts", e);
  }
  return []; // Default to empty if fail
}

export default async function AdminPagesInventory() {
  const appDir = path.join(process.cwd(), "src/app");
  const allFiles = await getPages(appDir, appDir);

  const matchers = await getMatcherConfig();

  const pages: PageInfo[] = allFiles
    .filter((f) => path.basename(f) === "page.tsx")
    .map((f) => {
      // Convert /Users/.../src/app/about/page.tsx -> /about
      let relative = f.split("src/app")[1].replace("/page.tsx", "");
      if (relative === "") relative = "/"; // Root

      // Fix dynamic routes for display (e.g., [id])
      const isDynamic = relative.includes("[");

      const isProtected = checkProtection(relative, matchers);

      return {
        route: relative,
        filePath: f.split("src/app")[1],
        isProtected,
        type: isDynamic ? ("DYNAMIC" as const) : ("STATIC" as const),
      };
    })
    .sort((a, b) => a.route.localeCompare(b.route));

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-h1 font-bold font-sora tracking-tight mb-2">
          Page Inventory
        </h1>
        <p className="text-secondary max-w-2xl leading-relaxed">
          Overview of all application routes and their protection status.
        </p>
      </header>

      <div className="bg-surface border border-surface-secondary rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-secondary text-secondary uppercase text-xs font-bold border-b border-surface-secondary">
            <tr>
              <th className="px-6 py-4">Route</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">File Path</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-secondary/50">
            {pages.map((p) => (
              <tr
                key={p.route}
                className="hover:bg-brand/5 transition-colors group"
              >
                <td className="px-6 py-4">
                  <span className="font-mono font-medium text-p text-txt-main">
                    {p.route}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {p.type === "DYNAMIC" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        Dynamic
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-200">
                        Static
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {p.isProtected ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <Shield size={12} fill="currentColor" />
                      Protected
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      <Globe size={12} />
                      Public
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-secondary text-xs font-mono opacity-60 group-hover:opacity-100 transition-opacity">
                  {p.filePath}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
