import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Backfilling missing data...');
  
  const allRequests = await prisma.propertyAuditRequest.findMany();
  
  for (const req of allRequests) {
    if (!req.images || !req.description) {
      const type = req.propertyType || 'house';
      await prisma.propertyAuditRequest.update({
        where: { id: req.id },
        data: {
          description: req.description || `Excelente ${type === 'house' ? 'vivenda' : type === 'apartment' ? 'apartamento' : 'imóvel'} muito bem localizado. Oportunidade única para negócio rápido. O imóvel encontra-se em excelente estado de conservação, pronto a entrar.`,
          images: req.images || [
            `https://source.unsplash.com/random/800x600/?${type},interior`,
            `https://source.unsplash.com/random/800x600/?${type},kitchen`,
            `https://source.unsplash.com/random/800x600/?${type},bathroom`
          ]
        }
      });
    }
  }
  
  console.log('Done!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
