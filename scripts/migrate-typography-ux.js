const fs = require("fs");
const path = require("path");

// Mapping based on UX Audit Migration Rules
const tokenMap = {
  "36px": "h1",
  "4xl": "h1",
  "28px": "h2",
  "20px": "h3",
  "16px": "p",
  "15px": "p",
  base: "p",
  "14px": "sm",
  "12px": "tiny",
  "10px": "micro",
};

function migrateFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let hasChanged = false;

  // 1. Convert text-[...px]
  const pixelRegex = /text-\[(\d+)px\]/g;
  content = content.replace(pixelRegex, (match, px) => {
    const size = parseInt(px);
    let variant = "p";

    if (size >= 32) variant = "h1";
    else if (size >= 24) variant = "h2";
    else if (size >= 18) variant = "h3";
    else if (size === 15 || size === 16) variant = "p";
    else if (size === 14) variant = "sm";
    else if (size === 12) variant = "tiny";
    else if (size <= 10) variant = "micro";

    // Exact overrides from tokenMap
    if (tokenMap[`${px}px`]) variant = tokenMap[`${px}px`];

    console.log(`  [${path.basename(filePath)}] ${match} -> text-${variant}`);
    hasChanged = true;
    return `text-${variant}`;
  });

  // 2. Convert text-4xl and text-base
  const utilMap = {
    "text-4xl": "text-h1",
    "text-base": "text-p",
  };

  Object.entries(utilMap).forEach(([oldClass, newClass]) => {
    if (content.includes(oldClass)) {
      const regex = new RegExp(`\\b${oldClass}\\b`, "g");
      content = content.replace(regex, newClass);
      console.log(`  [${path.basename(filePath)}] ${oldClass} -> ${newClass}`);
      hasChanged = true;
    }
  });

  if (hasChanged) {
    fs.writeFileSync(filePath, content);
  }
}

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

const targetDir = path.join(__dirname, "..", "src");
console.log(`🚀 Typography Standardization Migration (UX Audit)`);
console.log(`Target: ${targetDir}\n`);

walk(targetDir);

console.log(
  "\n✅ Migration finished. Classes are now aligned with the Typography system.",
);
