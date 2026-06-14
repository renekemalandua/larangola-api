import { PrismaClient, PlanType, PropertyStatus, ListingType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Admins
  const password = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@larangola.com' },
    update: {},
    create: {
      email: 'admin@larangola.com',
      phone: '+244900000000',
      password,
      name: 'Administrador Principal',
      isActive: true,
    },
  });
  console.log('✅ Admin created');

  // 2. Plans
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

  // 3. Categories
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

  // 4. Agents
  const agentPass = await bcrypt.hash('agent123', 10);
  
  // Agent 1: Verified
  const userAgent1 = await prisma.user.upsert({
    where: { email: 'agent1@larangola.com' },
    update: {},
    create: {
      email: 'agent1@larangola.com',
      phone: '+244920000001',
      password: agentPass,
      name: 'Agente João',
      isActive: true,
      agent: {
        create: {
          profession: 'Corretor Independente',
          isVerified: true,
        }
      }
    },
    include: { agent: true }
  });

  // Agent 2: Pending Verification
  const userAgent2 = await prisma.user.upsert({
    where: { email: 'agent2@larangola.com' },
    update: {},
    create: {
      email: 'agent2@larangola.com',
      phone: '+244920000002',
      password: agentPass,
      name: 'Agente Maria',
      isActive: true,
      agent: {
        create: {
          profession: 'Imobiliária XPTO',
          isVerified: false,
        }
      }
    },
    include: { agent: true }
  });
  console.log('✅ Agents created');

  // 5. Properties
  if (userAgent1.agent) {
    // Property 1: Published
    await prisma.property.create({
      data: {
        agentId: userAgent1.agent.id,
        categoryId: catHouse.id,
        title: 'Vivenda T3 em Talatona',
        description: 'Excelente vivenda com piscina.',
        city: 'Luanda',
        propertyType: 'house',
        listingType: ListingType.rent,
        price: 500000,
        status: PropertyStatus.published,
        reviewedBy: admin.id,
        reviewedAt: new Date(),
      }
    });

    // Property 2: Pending Approval
    await prisma.property.create({
      data: {
        agentId: userAgent1.agent.id,
        categoryId: catApt.id,
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
  }
  console.log('✅ Properties created');

  // 6. Payments
  await prisma.payment.create({
    data: {
      userId: userAgent1.id,
      type: 'subscription',
      amount: premiumPlan.price,
      status: 'pending',
      reference: 'LAR-2026-9999',
      relatedId: premiumPlan.id,
    }
  });
  console.log('✅ Payments created');

  console.log('🌱 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
