import { PrismaClient, PlanType } from '@prisma/client';

export async function seedPlans(prisma: PrismaClient) {
  console.log('📦 Seeding Plans...');

  const basicPlan = await prisma.agentPlan.upsert({
    where: { type: PlanType.basic },
    update: {
      price: 8000,
      description: 'Até 12 anúncios por semana. Ideal para iniciantes.',
      features: [
        '12 Anúncios por semana',
        'Gestão de visitas e chat interno',
        'Visibilidade normal',
        'Dashboard básico'
      ],
      isPopular: false,
    },
    create: {
      type: PlanType.basic,
      name: 'Plano Básico',
      price: 8000,
      pricePeriod: 'month',
      description: 'Até 12 anúncios por semana. Ideal para iniciantes.',
      features: [
        '12 Anúncios por semana',
        'Gestão de visitas e chat interno',
        'Visibilidade normal',
        'Dashboard básico'
      ],
      isPopular: false,
    },
  });

  const professionalPlan = await prisma.agentPlan.upsert({
    where: { type: PlanType.professional },
    update: {
      price: 17000,
      description: 'Até 30 anúncios, Contacto Direto e Solicitações.',
      features: [
        'Tudo do Básico',
        '30 Anúncios por semana',
        'Contacto direto no perfil público',
        'Acesso a Solicitações de Clientes',
        'Selo de Agente Verificado',
        'Dashboard Profissional'
      ],
      isPopular: true,
      badge: 'MAIS ESCOLHIDO'
    },
    create: {
      type: PlanType.professional,
      name: 'Plano Profissional',
      price: 17000,
      pricePeriod: 'month',
      description: 'Até 30 anúncios, Contacto Direto e Solicitações.',
      features: [
        'Tudo do Básico',
        '30 Anúncios por semana',
        'Contacto direto no perfil público',
        'Acesso a Solicitações de Clientes',
        'Selo de Agente Verificado',
        'Dashboard Profissional'
      ],
      isPopular: true,
      badge: 'MAIS ESCOLHIDO'
    },
  });

  const premiumPlan = await prisma.agentPlan.upsert({
    where: { type: PlanType.premium },
    update: {
      price: 28000,
      description: 'Publicação Ilimitada, Destaques Ilimitados e AI Insights.',
      features: [
        'Tudo do Profissional',
        'Publicação Ilimitada',
        'Destaques Ilimitados',
        'Prioridade alta nas pesquisas',
        'LarAngola Insights (AI)'
      ],
      isPopular: false,
    },
    create: {
      type: PlanType.premium,
      name: 'Plano Premium',
      price: 28000,
      pricePeriod: 'month',
      description: 'Publicação Ilimitada, Destaques Ilimitados e AI Insights.',
      features: [
        'Tudo do Profissional',
        'Publicação Ilimitada',
        'Destaques Ilimitados',
        'Prioridade alta nas pesquisas',
        'LarAngola Insights (AI)'
      ],
      isPopular: false,
    },
  });

  const enterprisePlan = await prisma.agentPlan.upsert({
    where: { type: PlanType.enterprise },
    update: {
      price: 42000,
      description: 'Para imobiliárias. Gestão de Sub-Agentes (até 6).',
      features: [
        'Tudo do Premium',
        'Gestão de até 6 sub-agentes',
        'Dashboard Enterprise Global',
        'Atribuição e Routing de Leads',
        'Leaderboard interno da equipa',
        'Perfil corporativo da imobiliária'
      ],
      isPopular: false,
    },
    create: {
      type: PlanType.enterprise,
      name: 'Plano Enterprise',
      price: 42000,
      pricePeriod: 'month',
      description: 'Para imobiliárias. Gestão de Sub-Agentes (até 6).',
      features: [
        'Tudo do Premium',
        'Gestão de até 6 sub-agentes',
        'Dashboard Enterprise Global',
        'Atribuição e Routing de Leads',
        'Leaderboard interno da equipa',
        'Perfil corporativo da imobiliária'
      ],
      isPopular: false,
    },
  });

  console.log('✅ Plans created successfully');
  return { basicPlan, professionalPlan, premiumPlan, enterprisePlan };
}
