import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Criar SuperAdmin se não existir
  const superAdminPassword = await bcrypt.hash('LarAngola200', 10);
  
  const superAdmin = await prisma.user.upsert({
    where: { email: 'adminkemalandua@larangola.com' },
    update: {},
    create: {
      email: 'adminkemalandua@larangola.com',
      phone: '+244900000001',
      password: superAdminPassword,
      name: 'Admin Kemalandua',
      isActive: true,
    },
  });
  
  console.log('✅ SuperAdmin created/updated:', superAdmin.email);
  
  // Também garantir o admin padrão para compatibilidade
  const defaultPassword = await bcrypt.hash('admin123', 10);
  
  const defaultAdmin = await prisma.user.upsert({
    where: { email: 'admin@larangola.com' },
    update: {},
    create: {
      email: 'admin@larangola.com',
      phone: '+244900000000',
      password: defaultPassword,
      name: 'Administrador',
      isActive: true,
    },
  });
  
  console.log('✅ Default Admin created/updated:', defaultAdmin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
