#!/usr/bin/env node

/**
 * Check and update user role to ADMIN
 * Run this script to make your user an admin
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function checkAndUpdateAdminRole() {
  try {
    console.log('🔍 Checking user roles...\n');

    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (users.length === 0) {
      console.log('❌ No users found in database');
      return;
    }

    console.log('📋 Current users:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name || 'Unknown'} (${user.email}) - Role: ${user.role} - Active: ${user.isActive}`);
    });

    // Find current user (most recent active user)
    const currentUser = users.find(u => u.isActive) || users[0];
    
    console.log(`\n🎯 Current user: ${currentUser.name || 'Unknown'} (${currentUser.email})`);
    console.log(`📋 Current role: ${currentUser.role}`);

    if (currentUser.role === 'ADMIN') {
      console.log('✅ You already have ADMIN role! You should be able to access /admin');
    } else {
      console.log('\n🔧 Updating role to ADMIN...');
      
      await prisma.user.update({
        where: { id: currentUser.id },
        data: { role: 'ADMIN' },
      });

      console.log('✅ Role updated to ADMIN!');
      console.log('🚀 You should now be able to access /admin');
      console.log('💡 You may need to sign out and sign back in for the role to take effect');
    }

    // Check if there are any admin users
    const adminUsers = users.filter(u => u.role === 'ADMIN');
    console.log(`\n👑 Total admin users: ${adminUsers.length}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
checkAndUpdateAdminRole();
