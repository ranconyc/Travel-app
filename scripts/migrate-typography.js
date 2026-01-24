const fs = require("fs");
const path = require("path");

// Mapping from hardcoded pixel values to Typography variants
const tokenMap = {
  "36px": "h1",
  "32px": "h1",
  "24px": "h2",
  "20px": "h3",
  "18px": "h4",
  "16px": "p",
  "14px": "sm",
  "12px": "tiny",
  "10px": "micro",
  "8px": "micro",
};

function migrateFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let hasChanged = false;

  // 1. Find all text-[...px] occurrences
  const regex = /text-\[(\d+)px\]/g;

  content = content.replace(regex, (match, p1) => {
    const variant = tokenMap[`${p1}px`] || "p";
    console.log(
      `  Converting ${match} to variant="${variant}" in ${path.basename(filePath)}`,
    );
    hasChanged = true;
    // Note: This only replaces the class.
    // To fully convert to <Typography>, manual wrapping is often safer.
    // However, if we are inside a Typography component already (e.g. from an audit),
    // we might just want the sibling tokens.
    return `text-${variant}`;
  });

  if (hasChanged) {
    fs.writeFileSync(filePath, content);
  }
}

// Simple recursive traversal for src directory
function walk(dir) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== "node_modules" && file !== ".next") walk(fullPath);
    } else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
      migrateFile(fullPath);
    }
  });
}

console.log("🚀 Starting Typography Class Migration...");
walk(path.join(__dirname, "..", "src"));
console.log("✅ Migration complete inside src folder.");
