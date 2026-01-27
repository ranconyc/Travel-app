#!/usr/bin/env node

/**
 * Typography Migration Script
 * 
 * This script automatically migrates old typography patterns to the new system.
 * 
 * Usage: node scripts/batch-migrate.js
 */

const fs = require('fs');
const path = require('path');

// Migration patterns
const migrations = [
  // Display typography
  {
    pattern: /text-4xl font-bold/g,
    replacement: 'text-display-lg',
    description: '4xl bold → display-lg'
  },
  {
    pattern: /text-3xl font-bold/g,
    replacement: 'text-display-md',
    description: '3xl bold → display-md'
  },
  {
    pattern: /text-2xl font-bold/g,
    replacement: 'text-display-sm',
    description: '2xl bold → display-sm'
  },
  
  // UI typography
  {
    pattern: /text-sm font-medium/g,
    replacement: 'text-ui-sm',
    description: 'sm medium → ui-sm'
  },
  {
    pattern: /text-base font-medium/g,
    replacement: 'text-ui',
    description: 'base medium → ui'
  },
  {
    pattern: /text-lg font-medium/g,
    replacement: 'text-ui-lg',
    description: 'lg medium → ui-lg'
  },
  
  // Label typography
  {
    pattern: /text-xs font-bold uppercase/g,
    replacement: 'text-label',
    description: 'xs bold uppercase → label'
  },
  {
    pattern: /text-xs font-semibold uppercase/g,
    replacement: 'text-label',
    description: 'xs semibold uppercase → label'
  },
  
  // Caption typography
  {
    pattern: /text-xs text-gray-600/g,
    replacement: 'text-caption-sm',
    description: 'xs gray-600 → caption-sm'
  },
  {
    pattern: /text-sm text-gray-600/g,
    replacement: 'text-caption',
    description: 'sm gray-600 → caption'
  },
  
  // Color fixes
  {
    pattern: /text-white/g,
    replacement: 'text-inverse',
    description: 'white → inverse (for overlays)'
  }
];

// Files to migrate (high priority)
const targetFiles = [
  'src/components/molecules/MatchScoreCard/index.tsx',
  'src/components/organisms/LanguageSection/index.tsx',
  'src/components/organisms/ElectricitySection/index.tsx',
  'src/components/organisms/CurrencySection/index.tsx',
  'src/components/organisms/EmergencySection/index.tsx',
  'src/components/organisms/TimeZoneSection/index.tsx',
  'src/components/organisms/VisaSection/index.tsx',
  'src/components/atoms/Badge/index.tsx',
  'src/components/atoms/Button/index.tsx',
  'src/components/atoms/InterestTag/index.tsx',
  'src/app/countries/[slug]/components/LogisticsSection.tsx',
  'src/app/countries/[slug]/components/LanguageSection.tsx',
  'src/app/countries/[slug]/components/StatsRow.tsx',
  'src/app/countries/[slug]/components/CitiesSection.tsx',
  'src/app/countries/[slug]/components/DictanceSection.tsx',
  'src/app/cities/[slug]/components/Stats.tsx',
  'src/app/profile/[id]/components/compatibility/MatchSummary.tsx',
  'src/features/auth/components/AuthHeader.tsx',
  'src/features/chats/components/MessageButton.tsx'
];

// Typography component import updates
const componentImportUpdates = [
  {
    pattern: /from "@\/components\/atoms\/Typography"/g,
    replacement: 'from "@/components/atoms/Typography/enhanced"',
    description: 'Update Typography import to enhanced version'
  }
];

function migrateFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return false;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;

    // Apply typography migrations
    migrations.forEach(migration => {
      const originalContent = content;
      content = content.replace(migration.pattern, migration.replacement);
      if (content !== originalContent) {
        hasChanges = true;
        console.log(`  ✅ ${migration.description}`);
      }
    });

    // Apply import updates
    componentImportUpdates.forEach(update => {
      const originalContent = content;
      content = content.replace(update.pattern, update.replacement);
      if (content !== originalContent) {
        hasChanges = true;
        console.log(`  ✅ ${update.description}`);
      }
    });

    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }

    return false;
  } catch (error) {
    console.error(`❌ Error migrating ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  console.log('🚀 Starting Typography Migration...\n');
  
  let totalFiles = 0;
  let migratedFiles = 0;

  targetFiles.forEach(filePath => {
    totalFiles++;
    console.log(`📄 Processing: ${filePath}`);
    
    if (migrateFile(filePath)) {
      migratedFiles++;
      console.log(`  ✅ Migrated successfully\n`);
    } else {
      console.log(`  ℹ️  No changes needed\n`);
    }
  });

  console.log('📊 Migration Summary:');
  console.log(`  Total files processed: ${totalFiles}`);
  console.log(`  Files migrated: ${migratedFiles}`);
  console.log(`  Files unchanged: ${totalFiles - migratedFiles}`);
  
  if (migratedFiles > 0) {
    console.log('\n✨ Migration completed!');
    console.log('💡 Run "npm run build" to verify everything works correctly.');
  } else {
    console.log('\n✅ All files already use the new typography system!');
  }
}

// Run the migration
if (require.main === module) {
  main();
}

module.exports = { migrateFile, migrations, targetFiles };
