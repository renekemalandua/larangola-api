import { PrismaClient, AuditStatus } from '@prisma/client';

export async function seedPropertyAudits(prisma: PrismaClient) {
  console.log('📝 Seeding Property Audit Requests (Mercado de Angariação)...');

  // Fetch all agents
  const agents = await prisma.agent.findMany();
  if (agents.length === 0) {
    console.log('   -> No agents found. Skipping property audits seed.');
    return;
  }

  // Find the primary agent for the UI demo (agent@larangola.co.ao)
  const primaryAgentUser = await prisma.user.findUnique({
    where: { email: 'agent@larangola.co.ao' },
    include: { agent: true }
  });
  const primaryAgent = primaryAgentUser?.agent;

  // Fetch all clients (users without agent profile)
  const clients = await prisma.user.findMany({
    where: { agent: null, adminRole: 'NONE' },
    take: 10
  });

  if (clients.length === 0) {
    console.log('   -> No clients found. Skipping property audits seed.');
    return;
  }

  // Common property data pool
  const propertiesData = [
    { title: 'Vivenda T3 em Talatona', type: 'house', price: 150000000, city: 'Luanda' },
    { title: 'Apartamento T2 no Maculusso', type: 'apartment', price: 85000000, city: 'Luanda' },
    { title: 'Terreno 50x50 em Viana', type: 'land', price: 15000000, city: 'Luanda' },
    { title: 'Loja Comercial no Nova Vida', type: 'commercial', price: 45000000, city: 'Luanda' },
    { title: 'Vivenda T4 no Patriota', type: 'house', price: 210000000, city: 'Luanda' },
    { title: 'Anexo T1 no Kilamba', type: 'apartment', price: 3500000, city: 'Luanda' },
    { title: 'Armazém no Cacuaco', type: 'commercial', price: 350000000, city: 'Luanda' },
    { title: 'Apartamento T3 na Ilha', type: 'apartment', price: 500000000, city: 'Luanda' },
    { title: 'Vivenda T5 em Condomínio', type: 'house', price: 450000000, city: 'Luanda' },
    { title: 'Escritório no Kinaxixi', type: 'commercial', price: 65000000, city: 'Luanda' },
  ];

  // 1. Create 10 PENDING audits (Pool de Oportunidades)
  console.log('   -> Creating PENDING audits (Pool)...');
  for (let i = 0; i < 10; i++) {
    const client = clients[i % clients.length];
    const pData = propertiesData[i % propertiesData.length];

    // Check if it already exists to avoid duplicates on re-seed
    const exists = await prisma.propertyAuditRequest.findFirst({
      where: { userId: client.id, title: `${pData.title} (Pool ${i})` }
    });

    if (!exists) {
      await prisma.propertyAuditRequest.create({
        data: {
          userId: client.id,
          title: `${pData.title} (Pool ${i})`,
          propertyType: pData.type,
          listingType: 'buy',
          price: pData.price,
          city: pData.city,
          status: AuditStatus.PENDING,
          area: Math.floor(Math.random() * 200) + 50,
          bedrooms: pData.type === 'house' || pData.type === 'apartment' ? Math.floor(Math.random() * 4) + 1 : null,
          bathrooms: pData.type === 'house' || pData.type === 'apartment' ? Math.floor(Math.random() * 3) + 1 : null,
          description: `Excelente ${pData.type === 'house' ? 'vivenda' : pData.type === 'apartment' ? 'apartamento' : 'imóvel'} muito bem localizado. Oportunidade única para negócio rápido. O imóvel encontra-se em excelente estado de conservação, pronto a entrar.`,
          images: [
            `https://source.unsplash.com/random/800x600/?${pData.type},interior`,
            `https://source.unsplash.com/random/800x600/?${pData.type},kitchen`,
            `https://source.unsplash.com/random/800x600/?${pData.type},bathroom`
          ]
        }
      });
    }
  }

  // 2. Create 15 VALIDATING audits (Minhas Validações - Claimed by Agents)
  console.log('   -> Creating VALIDATING audits (Claimed)...');
  for (let i = 0; i < 15; i++) {
    const client = clients[i % clients.length];
    const pData = propertiesData[(i + 5) % propertiesData.length];
    
    // Assign 8 to the primary agent for UI testing, the rest to random agents
    let claimedBy = primaryAgent;
    if (i > 7 || !primaryAgent) {
      claimedBy = agents[i % agents.length];
    }

    const exists = await prisma.propertyAuditRequest.findFirst({
      where: { userId: client.id, title: `${pData.title} (Active ${i})` }
    });

    if (!exists) {
      await prisma.propertyAuditRequest.create({
        data: {
          userId: client.id,
          title: `${pData.title} (Active ${i})`,
          propertyType: pData.type,
          listingType: 'buy',
          price: pData.price,
          city: pData.city,
          status: AuditStatus.VALIDATING,
          claimedByAgentId: claimedBy!.id,
          claimedAt: new Date(),
          area: Math.floor(Math.random() * 200) + 50,
          bedrooms: pData.type === 'house' || pData.type === 'apartment' ? Math.floor(Math.random() * 4) + 1 : null,
          bathrooms: pData.type === 'house' || pData.type === 'apartment' ? Math.floor(Math.random() * 3) + 1 : null,
          description: `Maravilhoso espaço com excelente exposição solar. A localização é privilegiada com acesso rápido às principais vias da cidade. \n\nMotivo da venda: mudança de país.`,
          images: [
            `https://source.unsplash.com/random/800x600/?${pData.type},livingroom`,
            `https://source.unsplash.com/random/800x600/?${pData.type},bedroom`,
            `https://source.unsplash.com/random/800x600/?${pData.type},facade`
          ]
        }
      });
    }
  }

  console.log('✅ Property Audit Requests seeded successfully!');
}
