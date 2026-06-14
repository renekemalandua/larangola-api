import { PrismaClient } from '@prisma/client';

export async function seedPayments(
  prisma: PrismaClient,
  agentUserId: string,
  premiumPlanPrice: number,
  premiumPlanId: string
) {
  console.log('💳 Seeding Payments...');

  await prisma.payment.upsert({
    where: { id: 'seed-payment-1' },
    update: {
      amount: premiumPlanPrice,
    },
    create: {
      id: 'seed-payment-1',
      userId: agentUserId,
      type: 'subscription',
      amount: premiumPlanPrice,
      status: 'pending',
      reference: 'LAR-2026-9999',
      relatedId: premiumPlanId,
    }
  });

  console.log('✅ Payments created');
}
