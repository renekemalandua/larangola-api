import { PrismaClient, PlanType } from '@prisma/client';

export async function seedPlans(prisma: PrismaClient) {
  console.log('📦 Seeding Plans...');

  const basicPlan = await prisma.agentPlan.upsert({
    where: { type: PlanType.basic },
    update: {},
    create: {
      type: PlanType.basic,
      name: 'Plano Básico',
      price: 0,
      pricePeriod: 'month',
      description: 'Plano gratuito para começar',
    },
  });

  const premiumPlan = await prisma.agentPlan.upsert({
    where: { type: PlanType.premium },
    update: {},
    create: {
      type: PlanType.premium,
      name: 'Plano Premium',
      price: 15000,
      pricePeriod: 'month',
      description: 'Destaque nos anúncios e suporte prioritário',
      isPopular: true,
    },
  });

  console.log('✅ Plans created');
  return { basicPlan, premiumPlan };
}
