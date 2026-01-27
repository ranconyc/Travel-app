#!/usr/bin/env node

/**
 * Enable Prisma slow query logging
 * Run this if you want to re-enable the logging
 */

const fs = require('fs');
const path = require('path');

const prismaFilePath = path.join(__dirname, '../src/lib/db/prisma.ts');

try {
  // Read the current prisma.ts file
  let content = fs.readFileSync(prismaFilePath, 'utf8');

  // Check if logging is already enabled
  if (content.includes('ENABLE_SLOW_QUERY_LOGGING !== "false"')) {
    console.log('✅ Prisma logging is already enabled');
    return;
  }

  // Enable logging by changing the condition
  content = content.replace(
    'process.env.ENABLE_SLOW_QUERY_LOGGING === "true"',
    'process.env.ENABLE_SLOW_QUERY_LOGGING !== "false"'
  );

  // Write the updated content back
  fs.writeFileSync(prismaFilePath, content, 'utf8');

  console.log('✅ Prisma slow query logging has been enabled');
  console.log('💡 To disable, run: node scripts/disable-prisma-logging.js');
  console.log('🚀 Restart your dev server to apply changes');

} catch (error) {
  console.error('❌ Error:', error.message);
}
