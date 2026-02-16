import bcrypt from 'bcryptjs';
import { PrismaClient, Role, Category } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@icespot.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@icespot.com',
      passwordHash,
      role: Role.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: 'staff@icespot.com' },
    update: {},
    create: {
      name: 'Counter Staff',
      email: 'staff@icespot.com',
      passwordHash,
      role: Role.STAFF,
    },
  });

  const items = [
    { name: 'Vanilla Cone', category: Category.CONE, price: 40, stock: 80, lowStockLevel: 15 },
    { name: 'Chocolate Cone', category: Category.CONE, price: 50, stock: 70, lowStockLevel: 12 },
    { name: 'Strawberry Cup', category: Category.CUP, price: 60, stock: 60, lowStockLevel: 10 },
    { name: 'Mango Cup', category: Category.CUP, price: 65, stock: 50, lowStockLevel: 10 },
    { name: 'Brownie Sundae', category: Category.SUNDAE, price: 120, stock: 40, lowStockLevel: 8 },
    { name: 'Choco Blast Sundae', category: Category.SUNDAE, price: 140, stock: 35, lowStockLevel: 7 }
  ];

  for (const item of items) {
    await prisma.item.upsert({
      where: { id: items.indexOf(item) + 1 },
      update: item,
      create: item,
    });
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
