import fs from "fs/promises";
import path from "path";
import { Database, Key, Link as LinkIcon } from "lucide-react";

type PrismaField = {
  name: string;
  type: string;
  isOptional: boolean;
  isUnique: boolean;
  isId: boolean;
  isArray: boolean;
  defaultValue?: string;
  relation?: string;
};

type PrismaModel = {
  name: string;
  fields: PrismaField[];
  indexes: string[];
  description?: string;
};

async function parsePrismaSchema(): Promise<PrismaModel[]> {
  const schemaPath = path.join(process.cwd(), "prisma/schema.prisma");
  const content = await fs.readFile(schemaPath, "utf-8");

  const models: PrismaModel[] = [];
  const modelRegex = /model\s+(\w+)\s*\{([^}]+)\}/g;

  let match;
  while ((match = modelRegex.exec(content)) !== null) {
    const modelName = match[1];
    const modelBody = match[2];

    const fields: PrismaField[] = [];
    const indexes: string[] = [];

    // Parse fields
    const fieldLines = modelBody.split("\n").filter((line) => line.trim());

    for (const line of fieldLines) {
      const trimmed = line.trim();

      // Skip comments and empty lines
      if (trimmed.startsWith("//") || !trimmed) continue;

      // Check for indexes
      if (trimmed.startsWith("@@")) {
        indexes.push(trimmed);
        continue;
      }

      // Parse field definition
      const fieldMatch = trimmed.match(/^(\w+)\s+([^\s]+)/);
      if (fieldMatch) {
        const fieldName = fieldMatch[1];
        let fieldType = fieldMatch[2];

        const isArray = fieldType.endsWith("[]");
        if (isArray) fieldType = fieldType.slice(0, -2);

        const isOptional = fieldType.endsWith("?");
        if (isOptional) fieldType = fieldType.slice(0, -1);

        const isId = trimmed.includes("@id");
        const isUnique = trimmed.includes("@unique");

        // Check for default value
        const defaultMatch = trimmed.match(/@default\(([^)]+)\)/);
        const defaultValue = defaultMatch ? defaultMatch[1] : undefined;

        // Check for relation
        const relationMatch = trimmed.match(/@relation\(/);
        const relation = relationMatch ? fieldType : undefined;

        fields.push({
          name: fieldName,
          type: fieldType,
          isOptional,
          isUnique,
          isId,
          isArray,
          defaultValue,
          relation,
        });
      }
    }

    models.push({
      name: modelName,
      fields,
      indexes,
    });
  }

  return models;
}

function getTypeColor(type: string) {
  if (type === "String") return "text-blue-600 bg-blue-50 border-blue-200";
  if (type === "Int" || type === "Float")
    return "text-green-600 bg-green-50 border-green-200";
  if (type === "Boolean")
    return "text-purple-600 bg-purple-50 border-purple-200";
  if (type === "DateTime")
    return "text-orange-600 bg-orange-50 border-orange-200";
  if (type === "Json") return "text-pink-600 bg-pink-50 border-pink-200";
  return "text-gray-600 bg-gray-50 border-gray-200";
}

export default async function AdminSchemaPage() {
  const models = await parsePrismaSchema();

  // Calculate relationships
  const relationships = new Map<string, string[]>();
  models.forEach((model) => {
    const related = model.fields.filter((f) => f.relation).map((f) => f.type);
    if (related.length > 0) {
      relationships.set(model.name, related);
    }
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-h1 font-bold font-sora tracking-tight mb-2 flex items-center gap-3">
          <Database className="text-brand" />
          Database Schema
        </h1>
        <p className="text-secondary max-w-2xl leading-relaxed">
          Complete overview of all Prisma models, fields, types, and
          relationships.
        </p>
        <div className="mt-4 flex gap-4">
          <div className="bg-surface px-4 py-2 rounded-lg border border-surface-secondary">
            <span className="text-2xl font-bold text-brand">
              {models.length}
            </span>
            <span className="text-xs text-secondary ml-2 uppercase font-bold">
              Models
            </span>
          </div>
          <div className="bg-surface px-4 py-2 rounded-lg border border-surface-secondary">
            <span className="text-2xl font-bold text-brand">
              {models.reduce((sum, m) => sum + m.fields.length, 0)}
            </span>
            <span className="text-xs text-secondary ml-2 uppercase font-bold">
              Fields
            </span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {models.map((model) => {
          const relatedModels = relationships.get(model.name) || [];

          return (
            <div
              key={model.name}
              className="bg-surface border border-surface-secondary rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Model Header */}
              <div className="bg-surface-secondary px-6 py-4 border-b border-surface-secondary">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold font-sora">{model.name}</h3>
                  <div className="flex items-center gap-2">
                    {relatedModels.length > 0 && (
                      <span className="text-xs bg-brand/10 text-brand px-2 py-1 rounded-full font-bold flex items-center gap-1">
                        <LinkIcon size={10} />
                        {relatedModels.length} relations
                      </span>
                    )}
                    <span className="text-xs bg-surface px-2 py-1 rounded-full font-bold text-secondary">
                      {model.fields.length} fields
                    </span>
                  </div>
                </div>
              </div>

              {/* Fields */}
              <div className="p-4">
                <div className="space-y-2">
                  {model.fields.map((field) => (
                    <div
                      key={field.name}
                      className="flex items-center justify-between p-3 bg-app-bg rounded-lg hover:bg-surface-secondary/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex items-center gap-2">
                          {field.isId && (
                            <Key size={14} className="text-yellow-500" />
                          )}
                          <span className="font-mono font-medium text-sm">
                            {field.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-micro font-bold px-2 py-0.5 rounded border ${getTypeColor(
                              field.type,
                            )}`}
                          >
                            {field.type}
                            {field.isArray && "[]"}
                            {field.isOptional && "?"}
                          </span>

                          {field.isUnique && (
                            <span className="text-micro font-bold px-2 py-0.5 rounded border bg-amber-50 text-amber-700 border-amber-200">
                              UNIQUE
                            </span>
                          )}

                          {field.defaultValue && (
                            <span className="text-micro font-bold px-2 py-0.5 rounded border bg-slate-50 text-slate-600 border-slate-200">
                              = {field.defaultValue}
                            </span>
                          )}

                          {field.relation && (
                            <span className="text-micro font-bold px-2 py-0.5 rounded border bg-brand/10 text-brand border-brand/20 flex items-center gap-1">
                              <LinkIcon size={10} />→ {field.type}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Indexes */}
                {model.indexes.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-surface-secondary">
                    <h4 className="text-xs font-bold text-secondary uppercase mb-2">
                      Indexes
                    </h4>
                    <div className="space-y-1">
                      {model.indexes.map((index, i) => (
                        <div
                          key={i}
                          className="text-xs font-mono bg-surface-secondary px-3 py-2 rounded text-secondary"
                        >
                          {index}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
