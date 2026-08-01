import { PrismaClient } from '@prisma/client';

export async function seedCategories(prisma: PrismaClient) {
  console.log('🏷️ Seeding Categories...');

  const catHouse = await prisma.propertyCategory.upsert({
    where: { id: 'cat-house' },
    update: {},
    create: {
      id: 'cat-house',
      name: 'Casa / Vivenda',
      description: 'Casas independentes',
    },
  });

  const catApt = await prisma.propertyCategory.upsert({
    where: { id: 'cat-apt' },
    update: {},
    create: {
      id: 'cat-apt',
      name: 'Apartamento',
      description: 'Apartamentos em condomínios ou edifícios',
    },
  });

  console.log('✅ Categories created');
  return { catHouse, catApt };
}
