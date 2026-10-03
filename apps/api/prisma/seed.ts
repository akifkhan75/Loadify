import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  const password = await argon2.hash('password123');

  // Create standard user
  const user = await prisma.account.upsert({
    where: { mobile: '1234567890' },
    update: {},
    create: {
      mobile: '1234567890',
      password,
      role: 'USER',
      firstName: 'Test',
      lastName: 'User',
      userProfile: { create: {} }
    },
  });

  // Create standard driver
  const driver = await prisma.account.upsert({
    where: { mobile: '0987654321' },
    update: {},
    create: {
      mobile: '0987654321',
      password,
      role: 'DRIVER',
      firstName: 'Test',
      lastName: 'Driver',
      driverProfile: {
        create: {
          isOnline: true,
          vehicleType: 'TRUCK'
        }
      }
    },
  });

  console.log({ user, driver });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
