import { PrismaClient } from '@prisma/client';

export async function seedPayments(
  prisma: PrismaClient,
  agentUserId: string,
  premiumPlanPrice: number,
  premiumPlanId: string
) {
  console.log('💳 Seeding Payments...');

  // 1. Pending (Normal)
  await prisma.payment.upsert({
    where: { id: 'pay-1001' },
    update: {},
    create: {
      id: 'pay-1001',
      userId: agentUserId,
      type: 'subscription',
      amount: premiumPlanPrice,
      status: 'pending',
      reference: 'TRX-88219482',
      proofImageUrl: 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?auto=format&fit=crop&q=80&w=400&h=600',
      relatedId: premiumPlanId,
    }
  });

  // 2. Approved
  await prisma.payment.upsert({
    where: { id: 'pay-1002' },
    update: {},
    create: {
      id: 'pay-1002',
      userId: agentUserId,
      type: 'subscription',
      amount: premiumPlanPrice * 2, // Arbitrary different amount
      status: 'paid',
      reference: 'TRX-11239988',
      proofImageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400&h=600',
      relatedId: premiumPlanId,
    }
  });

  // 3. Pending (Duplicate Reference for Radar)
  await prisma.payment.upsert({
    where: { id: 'pay-1003' },
    update: {},
    create: {
      id: 'pay-1003',
      userId: agentUserId,
      type: 'subscription',
      amount: premiumPlanPrice,
      status: 'pending',
      reference: 'TRX-88219482', // Duplicate reference
      proofImageUrl: 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?auto=format&fit=crop&q=80&w=400&h=600',
      relatedId: premiumPlanId,
    }
  });

  // 4. Rejected
  await prisma.payment.upsert({
    where: { id: 'pay-1004' },
    update: {},
    create: {
      id: 'pay-1004',
      userId: agentUserId,
      type: 'subscription',
      amount: 10000,
      status: 'rejected',
      reference: 'TRX-44552211',
      proofImageUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&q=80&w=400&h=600',
      rejectionReason: 'Motivos da Rejeição:\n- O comprovativo anexado está ilegível ou cortado. Por favor submeta uma imagem clara de todo o documento.\n- O valor transferido (10.000 AOA) não corresponde ao valor do plano selecionado.\n\nNotas do Auditor: Tentativa de pagar menos que o valor tabelado.',
      relatedId: premiumPlanId,
    }
  });

  // 5. Pending (PDF)
  await prisma.payment.upsert({
    where: { id: 'pay-1005' },
    update: {},
    create: {
      id: 'pay-1005',
      userId: agentUserId,
      type: 'subscription',
      amount: premiumPlanPrice,
      status: 'pending',
      reference: 'TRX-PDF-TESTE',
      proofImageUrl: '/Nota_Pagamento_AT-2026-0001.pdf',
      relatedId: premiumPlanId,
    }
  });

  console.log('✅ Payments created');
}
