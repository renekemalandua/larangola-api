import { PrismaClient, ListingType, PropertyStatus } from '@prisma/client';

export async function seedProperties(
  prisma: PrismaClient, 
  adminId: string, 
  agentData: any, 
  catHouseId: string, 
  catAptId: string
) {
  console.log('🏠 Seeding Properties...');

  if (!agentData || !agentData.agent) {
    console.log('⚠️ Skipping property creation: Agent data not found');
    return;
  }

  // Property 1: Published
  await prisma.property.upsert({
    where: { id: 'seed-prop-1' },
    update: {
      title: 'Vivenda T3 em Talatona',
      price: 500000,
    },
    create: {
      id: 'seed-prop-1',
      agentId: agentData.agent.id,
      categoryId: catHouseId,
      title: 'Vivenda T3 em Talatona',
      description: 'Excelente vivenda com piscina.',
      city: 'Luanda',
      propertyType: 'house',
      listingType: ListingType.rent,
      price: 500000,
      status: PropertyStatus.published,
      reviewedBy: adminId,
      reviewedAt: new Date(),
    }
  });

  // Property 2: Pending Approval
  await prisma.property.upsert({
    where: { id: 'seed-prop-2' },
    update: {
      title: 'Apartamento T2 na Mutamba',
      price: 35000000,
    },
    create: {
      id: 'seed-prop-2',
      agentId: agentData.agent.id,
      categoryId: catAptId,
      title: 'Apartamento T2 na Mutamba',
      description: 'Apartamento recém reformado.',
      city: 'Luanda',
      propertyType: 'apartment',
      listingType: ListingType.buy,
      price: 35000000,
      status: PropertyStatus.pending_approval,
      submittedForApprovalAt: new Date(),
    }
  });

  console.log('✅ Properties created');
}
