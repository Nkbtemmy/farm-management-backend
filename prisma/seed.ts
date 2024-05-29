import { PrismaClient } from '@prisma/client';
import logger from '../src/config/logger';
import { encryptPassword } from '../src/utils/encryption';

const prisma = new PrismaClient();

async function main() {
  logger.info('Seeding database...');
  try {
    const admin = await prisma.user.findFirst({
      where: { email: 'admin@farmflow.com' },
    });

    if (admin) {
      await prisma.user.delete({
        where: { id: admin.id },
      });
    }
    await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@farmflow.com',
        role: 'ADMIN',
        password: await encryptPassword('Admin123'),
      },
    });

    const farmer = await prisma.user.findFirst({
      where: { email: 'gatera@example.com' },
    });

    if (farmer) {
      await prisma.user.delete({
        where: { id: farmer.id },
      });
    }
    await prisma.user.create({
      data: {
        name: 'Edmond Gatera',
        email: 'gatera@example.com',
        role: 'USER',
        password: await encryptPassword('Gatera123'),
      },
    });

    const agro = await prisma.user.findFirst({
      where: { email: 'john12@farmflow.com' },
    });

    if (agro) {
      await prisma.user.delete({
        where: { id: agro.id },
      });
    }
    await prisma.user.create({
      data: {
        name: 'John Kabera',
        email: 'john12@farmflow.com',
        role: 'STORE',
        password: await encryptPassword('John123'),
      },
    });

    logger.info('Seeding completed!');
  } catch (error) {
    logger.error(error);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    logger.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
