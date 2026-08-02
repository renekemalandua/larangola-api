import { PrismaClient, ListingType, PropertyStatus } from '@prisma/client';

const LUANDA_ZONES = [
  {
    grupo: 1,
    nome: "Centro histórico e baixa de Luanda",
    municipios: ["Luanda", "Ingombota", "Maianga", "Rangel"],
    prices: [15000, 25000, 45000, 80000, 150000, 300000, 600000],
    types: ['apartment', 'studio']
  },
  {
    grupo: 2,
    nome: "Zona sul e expansão moderna",
    municipios: ["Belas", "Talatona", "Kilamba", "Samba"],
    prices: [18000, 35000, 60000, 95000, 180000, 450000, 850000],
    types: ['house', 'apartment']
  },
  {
    grupo: 3,
    nome: "Eixo norte urbano",
    municipios: ["Sambizanga", "Cazenga", "Hoji Ya Henda", "Ngola Kiluanje"],
    prices: [10000, 15000, 30000, 45000, 80000, 150000, 250000],
    types: ['house', 'apartment']
  },
  {
    grupo: 4,
    nome: "Eixo leste e norte de expansão",
    municipios: ["Viana", "Mulenvos", "Cacuaco"],
    prices: [8000, 12000, 25000, 40000, 75000, 120000, 210000],
    types: ['house', 'land']
  },
  {
    grupo: 5,
    nome: "Municípios mais afastados",
    municipios: ["Icolo e Bengo", "Quiçama"],
    prices: [5000, 9000, 18000, 35000, 60000, 90000, 150000],
    types: ['house', 'land']
  }
];

const PHOTOS = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600607687931-cebf0746e48e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
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
