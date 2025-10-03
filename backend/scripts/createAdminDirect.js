const { PrismaClient } = require('../generated/prisma');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Admin user details
const ADMIN_DETAILS = {
  name: 'Abdelhadi Zabin',
  email: 'abdelhadi.zabin@gmail.com',
  password: 'Test123!'
};

async function createAdmin() {
  try {
    console.log('\n🔐 Creating SkyLens Admin User...\n');
    console.log(`Name: ${ADMIN_DETAILS.name}`);
    console.log(`Email: ${ADMIN_DETAILS.email}`);
    console.log('');

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: ADMIN_DETAILS.email }
    });

    if (existing) {
      console.log(`⚠️  User with email ${ADMIN_DETAILS.email} already exists!`);
      
      if (existing.isAdmin) {
        console.log('✅ User is already an admin. No changes needed.');
      } else {
        console.log('📝 Updating user to admin...');
        await prisma.user.update({
          where: { email: ADMIN_DETAILS.email },
          data: { isAdmin: true }
        });
        console.log('✅ User updated to admin successfully!');
      }
      
      await prisma.$disconnect();
      return;
    }

    // Hash password
    console.log('🔒 Hashing password...');
    const hashedPassword = await bcrypt.hash(ADMIN_DETAILS.password, 10);

    // Create admin user
    console.log('👤 Creating admin user...');
    const admin = await prisma.user.create({
      data: {
        name: ADMIN_DETAILS.name,
        email: ADMIN_DETAILS.email,
        password: hashedPassword,
        isAdmin: true
      }
    });

    console.log('\n✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📧 Email: ${admin.email}`);
    console.log(`👤 Name: ${admin.name}`);
    console.log(`🆔 ID: ${admin.id}`);
    console.log(`🔑 Password: ${ADMIN_DETAILS.password}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🎉 You can now sign in at your Railway frontend URL!\n');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();

