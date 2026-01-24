import fs from "fs/promises";
import path from "path";
import {
  Shield,
  Globe,
  Database,
  MapPin,
  Cloud,
  Image as ImageIcon,
  Server,
} from "lucide-react";

type ApiInfo = {
  route: string;
  filePath: string;
  isProtected: boolean;
  methods: string[];
  type: "STATIC" | "DYNAMIC";
};

// Helper to check if a route matches the middleware config
function checkProtection(route: string, matchers: string[]) {
  return matchers.some((m) => {
    const prefix = m.replace("/:path*", "").replace("/:path", "");
    if (m === "/:path*") return true;
    return route.startsWith(prefix);
  });
}

async function getMatcherConfig() {
  try {
    const proxyPath = path.join(process.cwd(), "src/proxy.ts");
    const content = await fs.readFile(proxyPath, "utf-8");
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
  return [];
}

async function getApiRoutes(dir: string, baseDir: string): Promise<string[]> {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? getApiRoutes(res, baseDir) : res;
    }),
  );
  return Array.prototype.concat(...files);
}

async function getMethods(filePath: string): Promise<string[]> {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    const methods: string[] = [];

    // Look for: export async function GET, export const GET, export { GET }
    // Simple regex for common Next.js App Router patterns
    const commonMethods = [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH",
      "HEAD",
      "OPTIONS",
    ];

    // Check for named exports
    for (const method of commonMethods) {
      // export function GET
      if (
        new RegExp(`export\\s+(async\\s+)?function\\s+${method}\\b`).test(
          content,
        )
      ) {
        methods.push(method);
        continue;
      }
      // export const GET
      if (new RegExp(`export\\s+const\\s+${method}\\b`).test(content)) {
        methods.push(method);
        continue;
      }
    }

    // Check for "export { handler as GET }" or "export { GET }" patterns roughly
    // This is harder to regex perfectly but we can look for the method name inside export {}
    // simpler: just check if the method string exists and 'export' exists? No that's too loose.
    // Let's stick to the function/const definitions which are 99% of app router code.
    // If they use `export { GET } from ...` it might miss, but that's rare in route.ts files usually.

    return methods;
  } catch (e) {
    return [];
  }
}

type ThirdPartyApi = {
  name: string;
  provider: string;
  baseUrl: string;
  category: "DATA" | "MEDIA" | "GEO" | "AUTH";
  status: "ACTIVE" | "INACTIVE";
  description: string;
};

const THIRD_PARTY_APIS: ThirdPartyApi[] = [
  {
    name: "REST Countries",
    provider: "Open Source",
    baseUrl: "https://restcountries.com/v3.1",
    category: "DATA",
    status: "ACTIVE",
    description:
      "Primary source for country metadata, borders, and general info.",
  },
  {
    name: "LocationIQ",
    provider: "LocationIQ",
    baseUrl: "https://us1.locationiq.com/v1",
    category: "GEO",
    status: "ACTIVE",
    description: "Used for forward/reverse geocoding and coordinate lookup.",
  },
  {
    name: "Cloudinary",
    provider: "Cloudinary",
    baseUrl: "https://api.cloudinary.com/v1_1",
    category: "MEDIA",
    status: "ACTIVE",
    description:
      "Hosting and transformation for user-uploaded images and avatars.",
  },
  {
    name: "Google Places",
    provider: "Google Cloud",
    baseUrl: "https://places.googleapis.com/v1",
    category: "GEO",
    status: "ACTIVE",
    description: "Detailed place information and photos.",
  },
];

const getCategoryIcon = (category: ThirdPartyApi["category"]) => {
  switch (category) {
    case "DATA":
      return <Database size={14} />;
    case "GEO":
      return <MapPin size={14} />;
    case "MEDIA":
      return <ImageIcon size={14} />;
    case "AUTH":
      return <Shield size={14} />;
    default:
      return <Server size={14} />;
  }
};

export default async function AdminApisPage() {
  const apiDir = path.join(process.cwd(), "src/app/api");

  // Ensure directory exists to avoid crash
  let allFiles: string[] = [];
  try {
    allFiles = await getApiRoutes(apiDir, apiDir);
  } catch (e) {
    console.warn("API directory not found or empty");
  }

  const matchers = await getMatcherConfig();

  const apis: ApiInfo[] = await Promise.all(
    allFiles
      .filter((f) => path.basename(f) === "route.ts")
      .map(async (f) => {
        // Convert /Users/.../src/app/api/foo/route.ts -> /api/foo
        let relative = f.split("src/app")[1].replace("/route.ts", "");

        // Fix dynamic routes for display (e.g., [id])
        const isDynamic = relative.includes("[");

        const isProtected = checkProtection(relative, matchers);
        const methods = await getMethods(f);

        return {
          route: relative,
          filePath: f.split("src/app")[1],
          isProtected,
          methods,
          type: isDynamic ? ("DYNAMIC" as const) : ("STATIC" as const),
        };
      }),
  );

  apis.sort((a, b) => a.route.localeCompare(b.route));

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-h1 font-bold font-sora tracking-tight mb-2">
          API Inventory
        </h1>
        <p className="text-secondary max-w-2xl leading-relaxed">
          Overview of all API endpoints, their methods, and protection status.
        </p>
      </header>

      <div className="bg-surface border border-surface-secondary rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-secondary text-secondary uppercase text-xs font-bold border-b border-surface-secondary">
            <tr>
              <th className="px-6 py-4">Endpoint</th>
              <th className="px-6 py-4">Methods</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-secondary/50">
            {apis.map((api) => (
              <tr
                key={api.route}
                className="hover:bg-brand/5 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-mono font-medium text-p text-txt-main">
                      {api.route}
                    </span>
                    <span className="text-xs text-secondary font-mono opacity-60 group-hover:opacity-100 transition-opacity">
                      {api.filePath}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    {api.methods.map((m) => (
                      <span
                        key={m}
                        className={`px-2 py-0.5 rounded text-micro font-bold border ${getMethodColor(
                          m,
                        )}`}
                      >
                        {m}
                      </span>
                    ))}
                    {api.methods.length === 0 && (
                      <span className="text-xs text-secondary italic">
                        Unknown
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {api.type === "DYNAMIC" ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      Dynamic
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-200">
                      Static
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {api.isProtected ? (
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
              </tr>
            ))}
            {apis.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-secondary"
                >
                  No API routes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold font-sora tracking-tight mb-md flex items-center gap-2">
          <Cloud className="text-brand" />
          3rd Party Integrations
        </h2>
        <div className="bg-surface border border-surface-secondary rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-secondary text-secondary uppercase text-xs font-bold border-b border-surface-secondary">
              <tr>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Base URL</th>
                <th className="px-6 py-4">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-secondary/50">
              {THIRD_PARTY_APIS.map((api) => (
                <tr
                  key={api.name}
                  className="hover:bg-brand/5 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-p text-txt-main">
                        {api.name}
                      </span>
                      <span className="text-xs text-secondary opacity-80">
                        {api.provider}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-surface-secondary text-txt-main border border-surface-secondary">
                      {getCategoryIcon(api.category)}
                      {api.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-xs bg-surface-secondary px-2 py-1 rounded text-secondary font-mono">
                      {api.baseUrl}
                    </code>
                  </td>
                  <td className="px-6 py-4 text-secondary max-w-sm">
                    {api.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function getMethodColor(method: string) {
  switch (method) {
    case "GET":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "POST":
      return "bg-green-50 text-green-700 border-green-200";
    case "PUT":
      return "bg-orange-50 text-orange-700 border-orange-200";
    case "DELETE":
      return "bg-red-50 text-red-700 border-red-200";
    case "PATCH":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}
