import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Hash the password
  const passwordHash = await bcrypt.hash('admin', 10);

  // Create or update admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {
      passwordHash,
      role: UserRole.ADMIN,
      name: 'Admin User'
    },
    create: {
      email: 'admin@admin.com',
      passwordHash,
      name: 'Admin User',
      role: UserRole.ADMIN
    }
  });

  console.log('✅ Admin user created/updated:');
  console.log(`   Email: ${admin.email}`);
  console.log(`   Name: ${admin.name}`);
  console.log(`   Role: ${admin.role}`);
  console.log(`   ID: ${admin.id}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
