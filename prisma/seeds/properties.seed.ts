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

  // Property 1: Published Vivenda
  await prisma.property.upsert({
    where: { id: 'seed-prop-1' },
    update: {
      title: 'Excelente Vivenda T4 com Piscina e Anexo — Talatona',
      description: 'Espectacular vivenda familiar T4 de alto padrão localizada numa das zonas mais nobres e seguras de Talatona. O imóvel conta com 4 suítes espaçosas com roupeiros embutidos, sala ampla para dois ambientes com excelente iluminação natural, cozinha moderna totalmente equipada com despensa, e área de serviço completa. A área exterior oferece um maravilhoso espaço de lazer privativo com piscina com cascata, churrasqueira integrada, garagem coberta para 3 viaturas e um anexo T1 com entrada independente.',
      address: 'Rua do Centro de Convenções de Talatona, Condomínio Quinta do Lago',
      city: 'Luanda',
      state: 'Luanda',
      country: 'Angola',
      latitude: -8.922432,
      longitude: 13.181298,
      bedrooms: 4,
      bathrooms: 5,
      area: 350,
      propertyType: 'house',
      amenities: [
        'Piscina', 
        'Segurança Garantida', 
        'Internet Pronta', 
        'Estacionamento Privado', 
        'Churrasqueira', 
        'Gerador de Energia', 
        'Reservatório de Água'
      ],
      images: [
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80', 
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80', 
        'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80'
      ],
      rules: [
        'Não é permitido fumar no interior da vivenda', 
        'Animais de estimação de pequeno porte autorizados', 
        'Eventos e festas sujeitos a aprovação prévia', 
        'Respeitar as horas de silêncio a partir das 22:00'
      ],
      listingType: ListingType.rent,
      price: 1200000,
      status: PropertyStatus.published,
      reviewedBy: adminId,
      reviewedAt: new Date(),
    },
    create: {
      id: 'seed-prop-1',
      agentId: agentData.agent.id,
      categoryId: catHouseId,
      title: 'Excelente Vivenda T4 com Piscina e Anexo — Talatona',
      description: 'Espectacular vivenda familiar T4 de alto padrão localizada numa das zonas mais nobres e seguras de Talatona. O imóvel conta com 4 suítes espaçosas com roupeiros embutidos, sala ampla para dois ambientes com excelente iluminação natural, cozinha moderna totalmente equipada com despensa, e área de serviço completa. A área exterior oferece um maravilhoso espaço de lazer privativo com piscina com cascata, churrasqueira integrada, garagem coberta para 3 viaturas e um anexo T1 com entrada independente.',
      address: 'Rua do Centro de Convenções de Talatona, Condomínio Quinta do Lago',
      city: 'Luanda',
      state: 'Luanda',
      country: 'Angola',
      latitude: -8.922432,
      longitude: 13.181298,
      bedrooms: 4,
      bathrooms: 5,
      area: 350,
      propertyType: 'house',
      amenities: [
        'Piscina', 
        'Segurança Garantida', 
        'Internet Pronta', 
        'Estacionamento Privado', 
        'Churrasqueira', 
        'Gerador de Energia', 
        'Reservatório de Água'
      ],
      images: [
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80', 
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80', 
        'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80'
      ],
      rules: [
        'Não é permitido fumar no interior da vivenda', 
        'Animais de estimação de pequeno porte autorizados', 
        'Eventos e festas sujeitos a aprovação prévia', 
        'Respeitar as horas de silêncio a partir das 22:00'
      ],
      listingType: ListingType.rent,
      price: 1200000,
      status: PropertyStatus.published,
      reviewedBy: adminId,
      reviewedAt: new Date(),
    }
  });

  // Property 2: Published Apartment (Vista Mar)
  await prisma.property.upsert({
    where: { id: 'seed-prop-2' },
    update: {
      title: 'Apartamento T2 Mobiliado com Vista Mar — Baía de Luanda',
      description: 'Moderno apartamento T2 finamente mobiliado e decorado, situado na prestigiada zona da Marginal de Luanda. Dispõe de uma suíte master com closet, quarto secundário espaçoso, casa de banho social completa, sala de estar e jantar integrada com varanda ampla que oferece uma vista panorâmica deslumbrante sobre a Baía de Luanda. Cozinha americana planejada com eletrodomésticos embutidos, ar condicionado central em todas as divisões e sistema inteligente de iluminação.',
      address: 'Avenida 4 de Fevereiro, Edifício Baía',
      city: 'Luanda',
      state: 'Luanda',
      country: 'Angola',
      latitude: -8.811562,
      longitude: 13.242738,
      bedrooms: 2,
      bathrooms: 2,
      area: 120,
      propertyType: 'apartment',
      amenities: [
        'Vista Mar', 
        'Segurança Garantida', 
        'Internet Pronta', 
        'Estacionamento Privado', 
        'Academia no Condomínio', 
        'Elevador', 
        'Portaria 24h'
      ],
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80', 
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80', 
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'
      ],
      rules: [
        'Não é permitido fumar nas áreas comuns do edifício', 
        'Animais de estimação sob consulta prévia com o agente', 
        'Capacidade máxima de ocupação de 4 pessoas', 
        'Regras estritas de condomínio sobre barulho após 22:00'
      ],
      listingType: ListingType.buy,
      price: 85000000,
      status: PropertyStatus.published,
      reviewedBy: adminId,
      reviewedAt: new Date(),
    },
    create: {
      id: 'seed-prop-2',
      agentId: agentData.agent.id,
      categoryId: catAptId,
      title: 'Apartamento T2 Mobiliado com Vista Mar — Baía de Luanda',
      description: 'Moderno apartamento T2 finamente mobiliado e decorado, situado na prestigiada zona da Marginal de Luanda. Dispõe de uma suíte master com closet, quarto secundário espaçoso, casa de banho social completa, sala de estar e jantar integrada com varanda ampla que oferece uma vista panorâmica deslumbrante sobre a Baía de Luanda. Cozinha americana planejada com eletrodomésticos embutidos, ar condicionado central em todas as divisões e sistema inteligente de iluminação.',
      address: 'Avenida 4 de Fevereiro, Edifício Baía',
      city: 'Luanda',
      state: 'Luanda',
      country: 'Angola',
      latitude: -8.811562,
      longitude: 13.242738,
      bedrooms: 2,
      bathrooms: 2,
      area: 120,
      propertyType: 'apartment',
      amenities: [
        'Vista Mar', 
        'Segurança Garantida', 
        'Internet Pronta', 
        'Estacionamento Privado', 
        'Academia no Condomínio', 
        'Elevador', 
        'Portaria 24h'
      ],
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80', 
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80', 
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'
      ],
      rules: [
        'Não é permitido fumar nas áreas comuns do edifício', 
        'Animais de estimação sob consulta prévia com o agente', 
        'Capacidade máxima de ocupação de 4 pessoas', 
        'Regras estritas de condomínio sobre barulho após 22:00'
      ],
      listingType: ListingType.buy,
      price: 85000000,
      status: PropertyStatus.published,
      reviewedBy: adminId,
      reviewedAt: new Date(),
    }
  });

  console.log('✅ Properties created');
}
