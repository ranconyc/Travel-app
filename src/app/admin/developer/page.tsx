import fs from "fs/promises";
import path from "path";
import { Code, Box, Hash, ChevronRight, FileText } from "lucide-react";

type ItemInfo = {
  name: string;
  filePath: string;
  type: "ACTION" | "HOOK";
  exports?: string[];
  // Map of export name -> list of file paths where it is used
  usageLocations?: Record<string, string[]>;
};

async function getFiles(
  dir: string,
  matcher: (name: string) => boolean,
): Promise<string[]> {
  let results: string[] = [];
  try {
    const list = await fs.readdir(dir, { withFileTypes: true });
    for (const file of list) {
      const res = path.resolve(dir, file.name);
      if (file.isDirectory()) {
        const subResults = await getFiles(res, matcher);
        results = results.concat(subResults);
      } else if (matcher(file.name)) {
        results.push(res);
      }
    }
  } catch {
    // ignore
  }
  return results;
}

async function getExports(filePath: string): Promise<string[]> {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    const exports: string[] = [];

    // Regex to find exported functions or constants
    // Matches: export async function name(, export function name(, export const name =
    const matches = content.matchAll(
      /export\s+(?:async\s+)?(?:function|const)\s+([a-zA-Z0-9_]+)/g,
    );
    for (const match of matches) {
      if (match[1]) exports.push(match[1]);
    }

    return exports;
  } catch {
    return [];
  }
}

async function getUsageLocations(
  names: string[],
  excludePath: string,
): Promise<Record<string, string[]>> {
  const locations: Record<string, string[]> = {};
  names.forEach((n) => (locations[n] = []));

  const srcDir = path.join(process.cwd(), "src");
  // Scan all TS/TSX files
  const allFiles = await getFiles(
    srcDir,
    (name) => name.endsWith(".ts") || name.endsWith(".tsx"),
  );

  for (const file of allFiles) {
    // Skip the file where the items are defined or the current admin page
    if (file === excludePath || file.includes("admin/developer/page.tsx"))
      continue;

    try {
      const content = await fs.readFile(file, "utf-8");
      const relativeFilePath = file.split("src/")[1] || file;

      for (const name of names) {
        if (content.includes(name)) {
          // Use a simple word boundary check
          const regex = new RegExp(`\\b${name}\\b`);
          if (regex.test(content)) {
            if (!locations[name].includes(relativeFilePath)) {
              locations[name].push(relativeFilePath);
            }
          }
        }
      }
    } catch {
      // ignore
    }
  }
  return locations;
}

export default async function AdminDeveloperPage() {
  const srcDir = path.join(process.cwd(), "src");

  // 1. Find Action Files (*.actions.ts)
  const actionFiles = await getFiles(srcDir, (name) =>
    name.endsWith(".actions.ts"),
  );

  // 2. Find Hook Files (use*.ts)
  // Heuristic: starts with 'use', ends with '.ts' or '.tsx', and is not inside 'node_modules' (handled by srcDir limit)
  const hookFiles = await getFiles(
    srcDir,
    (name) => name.startsWith("use") && name.endsWith(".ts"),
  );

  // Collect all names for a single codebase scan
  const allActionNames: string[] = [];
  const actionsData = await Promise.all(
    actionFiles.map(async (f) => {
      const exports = await getExports(f);
      allActionNames.push(...exports);
      return { f, exports };
    }),
  );

  const allHookNames: string[] = [];
  const hooksData = await Promise.all(
    hookFiles.map(async (f) => {
      const exports = await getExports(f);
      // For hooks, usually the default export or the named export matches the filename
      // But let's use the explicit exports we found
      // If no implicit export found, fallback to basename
      let names = exports;
      if (names.length === 0) {
        const base = path.basename(f).replace(/\.ts$/, "");
        names = [base];
      }
      // Filter out non-hook exports if mixed? For now keep all.
      // Actually strictly hooks usually export "useSomething".
      const hookExports = names.filter((n) => n.startsWith("use"));
      if (hookExports.length === 0 && names.length > 0) {
        // Fallback to all exports if none start with use (unlikely for a hook file)
        hookExports.push(...names);
      }

      allHookNames.push(...hookExports);
      return { f, exports: hookExports };
    }),
  );

  // Perform scan
  const usageLocations = await getUsageLocations(
    [...allActionNames, ...allHookNames],
    "",
  );

  const actions: ItemInfo[] = actionsData.map(({ f, exports }) => {
    const relative = f.split("src/")[1];
    return {
      name: path.basename(f),
      filePath: relative,
      type: "ACTION",
      exports,
      usageLocations: exports.reduce(
        (acc, exp) => ({ ...acc, [exp]: usageLocations[exp] || [] }),
        {},
      ),
    };
  });

  const hooks: ItemInfo[] = hooksData.map(({ f, exports }) => {
    const relative = f.split("src/")[1];
    return {
      name: path.basename(f).replace(/\.ts$/, ""),
      filePath: relative,
      type: "HOOK",
      exports,
      usageLocations: exports.reduce(
        (acc, exp) => ({ ...acc, [exp]: usageLocations[exp] || [] }),
        {},
      ),
    };
  });

  return (
    <div className="space-y-10 max-w-[1600px] animate-in fade-in duration-700 p-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200">
              <Code size={28} />
            </div>
            Developer Hub
          </h1>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl leading-relaxed">
            A comprehensive inventory of the application&apos;s core logic,
            listing all server-side actions and client-side hooks with their
            usage locations.
          </p>
        </div>

        <div className="flex gap-4">
          <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center min-w-[120px]">
            <span className="text-3xl font-bold text-blue-600">
              {actions.length}
            </span>
            <span className="text-xs uppercase tracking-wider font-bold text-gray-400 mt-1">
              Actions
            </span>
          </div>
          <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center min-w-[120px]">
            <span className="text-3xl font-bold text-purple-600">
              {hooks.length}
            </span>
            <span className="text-xs uppercase tracking-wider font-bold text-gray-400 mt-1">
              Hooks
            </span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-12">
        {/* Server Actions Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
              <Box size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Server Actions</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-gray-100 to-transparent"></div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-50/50 text-gray-400 uppercase text-xs tracking-widest font-black border-b border-gray-100">
                    <th className="px-8 py-5 w-1/4">Module & Location</th>
                    <th className="px-8 py-5 w-3/4">Exports & Usage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {actions.map((item) => (
                    <tr
                      key={item.filePath}
                      className="hover:bg-blue-50/30 transition-all group"
                    >
                      <td className="px-8 py-6 align-top">
                        <div className="flex flex-col gap-1 sticky top-0">
                          <span className="font-bold text-gray-900 text-base group-hover:text-blue-600 transition-colors">
                            {item.name.replace(".actions.ts", "")}
                          </span>
                          <span className="text-xs text-gray-400 font-mono flex items-center gap-1 group-hover:text-gray-500 break-all">
                            <ChevronRight size={10} /> {item.filePath}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-6">
                          {item.exports?.map((exp) => {
                            const locations = item.usageLocations?.[exp] || [];
                            return (
                              <div key={exp} className="flex flex-col gap-2">
                                <div className="flex items-center gap-3">
                                  <span className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-sm font-bold font-mono border border-blue-100">
                                    {exp}()
                                  </span>
                                  <span
                                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                      locations.length > 0
                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                        : "bg-amber-50 text-amber-700 border border-amber-100"
                                    }`}
                                  >
                                    {locations.length} usages
                                  </span>
                                </div>
                                {locations.length > 0 && (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 pl-4 border-l-2 border-gray-100 ml-2">
                                    {locations.map((loc) => (
                                      <div
                                        key={loc}
                                        className="text-xs text-gray-500 font-mono flex items-center gap-1.5"
                                      >
                                        <FileText
                                          size={10}
                                          className="text-gray-300"
                                        />
                                        {loc}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                          {(!item.exports || item.exports.length === 0) && (
                            <span className="text-gray-300 italic text-xs">
                              No explicit exports found
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Custom Hooks Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
              <Hash size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Custom Hooks</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-gray-100 to-transparent"></div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-50/50 text-gray-400 uppercase text-xs tracking-widest font-black border-b border-gray-100">
                    <th className="px-8 py-5 w-1/4">Hook & Location</th>
                    <th className="px-8 py-5 w-3/4">Usage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {hooks.map((item) => (
                    <tr
                      key={item.filePath}
                      className="hover:bg-purple-50/30 transition-all group"
                    >
                      <td className="px-8 py-6 align-top">
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-gray-900 text-base group-hover:text-purple-600 transition-colors">
                            {item.name}
                          </span>
                          <span className="text-xs text-gray-400 font-mono flex items-center gap-1 group-hover:text-gray-500 break-all">
                            <ChevronRight size={10} /> {item.filePath}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-6">
                          {item.exports?.map((exp) => {
                            const locations = item.usageLocations?.[exp] || [];
                            return (
                              <div key={exp} className="flex flex-col gap-2">
                                <div className="flex items-center gap-3">
                                  <span className="inline-flex items-center px-3 py-1 rounded-lg bg-purple-50 text-purple-700 text-sm font-bold font-mono border border-purple-100">
                                    {exp}()
                                  </span>
                                  <span
                                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                      locations.length > 0
                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                        : "bg-amber-50 text-amber-700 border border-amber-100"
                                    }`}
                                  >
                                    {locations.length} usages
                                  </span>
                                </div>
                                {locations.length > 0 && (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 pl-4 border-l-2 border-gray-100 ml-2">
                                    {locations.map((loc) => (
                                      <div
                                        key={loc}
                                        className="text-xs text-gray-500 font-mono flex items-center gap-1.5"
                                      >
                                        <FileText
                                          size={10}
                                          className="text-gray-300"
                                        />
                                        {loc}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
