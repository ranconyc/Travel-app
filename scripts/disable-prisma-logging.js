#!/usr/bin/env node

/**
 * Disable Prisma slow query logging
 * Run this if you want to disable the logging warnings
 */

const fs = require('fs');
const path = require('path');

const prismaFilePath = path.join(__dirname, '../src/lib/db/prisma.ts');

try {
  // Read the current prisma.ts file
  let content = fs.readFileSync(prismaFilePath, 'utf8');

  // Check if logging is already disabled
  if (content.includes('ENABLE_SLOW_QUERY_LOGGING !== "true"')) {
    console.log('✅ Prisma logging is already disabled');
    return;
  }

  // Disable logging by changing the condition
  content = content.replace(
    'process.env.ENABLE_SLOW_QUERY_LOGGING !== "false"',
    'process.env.ENABLE_SLOW_QUERY_LOGGING === "true"'
  );

  // Write the updated content back
  fs.writeFileSync(prismaFilePath, content, 'utf8');

  console.log('✅ Prisma slow query logging has been disabled');
  console.log('💡 To re-enable, run: node scripts/enable-prisma-logging.js');
  console.log('🚀 Restart your dev server to apply changes');

} catch (error) {
  console.error('❌ Error:', error.message);
}
