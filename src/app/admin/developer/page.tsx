import fs from "fs/promises";
import path from "path";
import { Code, Box, Hash, ChevronRight } from "lucide-react";

type ItemInfo = {
  name: string;
  filePath: string;
  type: "ACTION" | "HOOK";
  exports?: string[];
  usages?: Record<string, number>;
};

async function getFiles(dir: string, suffix: string): Promise<string[]> {
  let results: string[] = [];
  try {
    const list = await fs.readdir(dir, { withFileTypes: true });
    for (const file of list) {
      const res = path.resolve(dir, file.name);
      if (file.isDirectory()) {
        results = results.concat(await getFiles(res, suffix));
      } else if (file.name.endsWith(suffix)) {
        results.push(res);
      }
    }
  } catch {
    //
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
      /export\s+(?:async\s+)?(?:function|const)\s+([a-zA-Z0-9_]+)/g
    );
    for (const match of matches) {
      if (match[1]) exports.push(match[1]);
    }

    return exports;
  } catch {
    return [];
  }
}

async function getUsageCounts(
  names: string[],
  excludePath: string
): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};
  names.forEach((n) => (counts[n] = 0));

  const srcDir = path.join(process.cwd(), "src");
  const files = await getFiles(srcDir, ".ts");
  const tsxFiles = await getFiles(srcDir, ".tsx");
  const allFiles = [...files, ...tsxFiles];

  for (const file of allFiles) {
    // Skip the file where the items are defined or the current admin page
    if (file === excludePath || file.includes("admin/developer/page.tsx"))
      continue;

    try {
      const content = await fs.readFile(file, "utf-8");
      for (const name of names) {
        if (content.includes(name)) {
          // Use a simple word boundary check to avoid partial matches
          const regex = new RegExp(`\\b${name}\\b`, "g");
          const matches = content.match(regex);
          if (matches) {
            counts[name] += matches.length;
          }
        }
      }
    } catch {
      // ignore
    }
  }
  return counts;
}

export default async function AdminDeveloperPage() {
  const domainDir = path.join(process.cwd(), "src/domain");
  const hooksDir = path.join(process.cwd(), "src/app/_hooks");

  const actionFiles = await getFiles(domainDir, ".actions.ts");
  const hookFiles = await getFiles(hooksDir, ".ts");

  // Filter hook files to exclude those that are just index or don't look like hooks
  const filteredHooks = hookFiles.filter((f) => {
    const base = path.basename(f);
    return (
      base.startsWith("use") ||
      (base === "index.ts" && path.dirname(f).includes("use"))
    );
  });

  // Collect all names for a single codebase scan
  const allActionNames: string[] = [];
  const actionsData = await Promise.all(
    actionFiles.map(async (f) => {
      const exports = await getExports(f);
      allActionNames.push(...exports);
      return { f, exports };
    })
  );

  const allHookNames: string[] = [];
  const hooksData = await Promise.all(
    filteredHooks.map(async (f) => {
      const exports = await getExports(f);
      const name =
        exports.find((e) => e.startsWith("use")) ||
        path.basename(f).replace(".ts", "");
      allHookNames.push(name);
      return { f, exports, name };
    })
  );

  // Perform scans (separate or combined)
  // For better performance, we'll scan for everything in one go
  const usageCounts = await getUsageCounts(
    [...allActionNames, ...allHookNames],
    ""
  );

  const actions: ItemInfo[] = actionsData.map(({ f, exports }) => {
    const relative = f.split("src/")[1];
    return {
      name: path.basename(f),
      filePath: relative,
      type: "ACTION",
      exports,
      usages: exports.reduce(
        (acc, exp) => ({ ...acc, [exp]: usageCounts[exp] || 0 }),
        {}
      ),
    };
  });

  const hooks: ItemInfo[] = hooksData.map(({ f, exports, name }) => {
    const relative = f.split("src/")[1];
    return {
      name,
      filePath: relative,
      type: "HOOK",
      exports,
      usages: { [name]: usageCounts[name] || 0 },
    };
  });

  return (
    <div className="space-y-10 max-w-7xl animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 pb-8">
        <div>
          <h1 className="text-4xl font-extrabold font-sora tracking-tight text-gray-900 flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200">
              <Code size={28} />
            </div>
            Developer Hub
          </h1>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl leading-relaxed">
            A comprehensive inventory of the application&apos;s core logic,
            listing all server-side actions and client-side hooks.
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
                  <tr className="bg-gray-50/50 text-gray-400 uppercase text-[10px] tracking-widest font-black border-b border-gray-100">
                    <th className="px-8 py-5">Module & Location</th>
                    <th className="px-8 py-5">Exported Functions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {actions.map((item) => (
                    <tr
                      key={item.filePath}
                      className="hover:bg-blue-50/30 transition-all group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-gray-900 text-base group-hover:text-blue-600 transition-colors">
                            {item.name.replace(".actions.ts", "")}
                          </span>
                          <span className="text-xs text-gray-400 font-mono flex items-center gap-1 group-hover:text-gray-500">
                            <ChevronRight size={10} /> {item.filePath}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-wrap gap-2">
                          {item.exports?.map((exp) => {
                            const count = item.usages?.[exp] || 0;
                            return (
                              <div key={exp} className="flex flex-col gap-1">
                                <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-[11px] font-bold font-mono border border-blue-100/50 shadow-sm group-hover:bg-white group-hover:shadow transition-all ring-1 ring-transparent hover:ring-blue-300">
                                  {exp}()
                                </span>
                                <span
                                  className={`text-[9px] px-1.5 font-bold self-start rounded ${
                                    count > 0
                                      ? "text-emerald-600"
                                      : "text-amber-500"
                                  }`}
                                >
                                  {count} usages
                                </span>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hooks.map((item) => {
              const count = item.usages?.[item.name] || 0;
              return (
                <div
                  key={item.filePath}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-purple-200 hover:shadow-md hover:shadow-purple-50 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-full -mr-12 -mt-12 group-hover:bg-purple-100 transition-colors opacity-50"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="font-mono font-black text-purple-600 text-lg">
                        {item.name}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          count > 0
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-amber-50 text-amber-700 border border-amber-100"
                        }`}
                      >
                        {count} usages
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-400 font-mono break-all opacity-80 group-hover:opacity-100 flex items-center gap-1">
                      <ChevronRight size={8} /> {item.filePath}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
