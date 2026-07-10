import { PrismaClient, ListingType, PropertyStatus } from '@prisma/client';

const LUANDA_ZONES = [
  {
    grupo: 1,
    nome: "Centro histórico e baixa de Luanda",
    municipios: ["Luanda", "Ingombota", "Maianga", "Rangel"],
    prices: [800000, 1500000, 2500000, 150000000, 300000000],
    types: ['apartment', 'studio']
  },
  {
    grupo: 2,
    nome: "Zona sul e expansão moderna",
    municipios: ["Belas", "Talatona", "Kilamba", "Samba"],
    prices: [1200000, 3500000, 5000000, 450000000, 800000000],
    types: ['house', 'apartment']
  },
  {
    grupo: 3,
    nome: "Eixo norte urbano",
    municipios: ["Sambizanga", "Cazenga", "Hoji Ya Henda", "Ngola Kiluanje"],
    prices: [150000, 300000, 500000, 45000000, 60000000],
    types: ['house', 'apartment']
  },
  {
    grupo: 4,
    nome: "Eixo leste e norte de expansão",
    municipios: ["Viana", "Mulenvos", "Cacuaco"],
    prices: [120000, 200000, 400000, 35000000, 50000000],
    types: ['house', 'land']
  },
  {
    grupo: 5,
    nome: "Municípios mais afastados",
    municipios: ["Icolo e Bengo", "Quiçama"],
    prices: [80000, 150000, 300000, 25000000, 40000000],
    types: ['house', 'land']
  }
];

const PHOTOS = [
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600607687931-cebf0746e48e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=800&q=80'
];

export async function seedProperties(
  prisma: PrismaClient, 
  adminId: string, 
  agentData: any, 
  catHouseId: string, 
  catAptId: string
) {
  console.log('🏠 Seeding 75 Properties across Luanda Zones...');

  if (!agentData || !agentData.agent) {
    console.log('⚠️ Skipping property creation: Agent data not found');
    return;
  }

  const agentId = agentData.agent.id;
  let propCounter = 1;

  for (const zone of LUANDA_ZONES) {
    console.log(`📍 Generating 15 properties for Zone: ${zone.nome}`);
    
    for (let i = 0; i < 15; i++) {
      const municipio = zone.municipios[Math.floor(Math.random() * zone.municipios.length)];
      const price = zone.prices[Math.floor(Math.random() * zone.prices.length)];
      const type = zone.types[Math.floor(Math.random() * zone.types.length)];
      const isSale = Math.random() > 0.5;
      const bedrooms = Math.floor(Math.random() * 4) + 1;
      const bathrooms = Math.floor(Math.random() * 3) + 1;
      
      const images = [
        PHOTOS[Math.floor(Math.random() * PHOTOS.length)],
        PHOTOS[Math.floor(Math.random() * PHOTOS.length)],
        PHOTOS[Math.floor(Math.random() * PHOTOS.length)]
      ];

      await prisma.property.upsert({
        where: { id: `seed-prop-${propCounter}` },
        update: {},
        create: {
          id: `seed-prop-${propCounter}`,
          agentId: agentId,
          categoryId: type === 'house' ? catHouseId : catAptId,
          title: `${type === 'house' ? 'Vivenda' : 'Apartamento'} T${bedrooms} em ${municipio}`,
          description: `Excelente oportunidade de negócio. ${type === 'house' ? 'Vivenda' : 'Apartamento'} localizado em ${municipio}, perfeito para famílias ou investimento. Inclui ar condicionado e estacionamento.`,
          address: `Rua principal de ${municipio}`,
          city: municipio,
          state: 'Luanda',
          country: 'Angola',
          bedrooms: bedrooms,
          bathrooms: bathrooms,
          area: Math.floor(Math.random() * 200) + 50,
          propertyType: type,
          amenities: ['Estacionamento', 'Segurança', 'Água Canalizada', 'Gerador'],
          images: images,
          listingType: isSale ? ListingType.buy : ListingType.rent,
          price: price,
          status: PropertyStatus.published,
          statusUpdatedAt: new Date(),
          reviewedBy: adminId,
          reviewedAt: new Date(),
          isHighlighted: Math.random() > 0.8,
        }
      });
      
      propCounter++;
    }
  }

  console.log('✅ 75 Properties successfully generated.');
}
