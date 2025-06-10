import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      username: 'ramsharan',
      email: 'ram@example.com',
      phone: '9800000000',
      firstName: 'Ram',
      middleName: 'Sharan',
      lastName: 'Sapkota',
      fullName: 'Ram Sharan Sapkota',
      passwordHash: '$2b$10$examplehash',
      isVerified: true,
    },
  });

  console.log('✅ Seeded user');
}

main()
  .catch(e => {
    console.error('Error seeding data:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
