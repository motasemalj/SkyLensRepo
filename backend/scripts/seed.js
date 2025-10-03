const { PrismaClient } = require('../generated/prisma');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  try {
    // Create default admin user
    const hashedPassword = await bcrypt.hash('Admin123!', 10);
    
    const admin = await prisma.user.upsert({
      where: { email: 'admin@skylens.com' },
      update: {
        isAdmin: true,
      },
      create: {
        email: 'admin@skylens.com',
        password: hashedPassword,
        name: 'Admin User',
        isAdmin: true,
      },
    });

    console.log('✅ Admin user created/updated:');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Name: ${admin.name}`);
    console.log(`   Admin: ${admin.isAdmin}`);
    console.log(`   Default Password: Admin123! (Please change after first login)\n`);

    // You can add more seed data here if needed
    // For example, sample orders for testing

    const userCount = await prisma.user.count();
    const orderCount = await prisma.order.count();

    console.log('📊 Database Statistics:');
    console.log(`   Total Users: ${userCount}`);
    console.log(`   Total Orders: ${orderCount}\n`);

    console.log('🎉 Seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

