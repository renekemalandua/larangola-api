import { PrismaClient } from '@prisma/client';

export async function seedPayments(
  prisma: PrismaClient,
  agentUserId: string,
  premiumPlanPrice: number,
  premiumPlanId: string
) {
  console.log('💳 Seeding Payments...');

  await prisma.payment.create({
    data: {
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
