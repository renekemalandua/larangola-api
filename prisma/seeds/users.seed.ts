import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export async function seedUsers(prisma: PrismaClient) {
  console.log('👤 Seeding Users...');

  const passwordAdmin = await bcrypt.hash('admin123', 10);
  const passwordAgent = await bcrypt.hash('agent123', 10);
  const passwordClient = await bcrypt.hash('client123', 10);

  // 1. Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@larangola.co.ao' },
    update: {
      adminRole: 'ADMIN',
    },
    create: {
      email: 'admin@larangola.co.ao',
      phone: '+244900000000',
      password: passwordAdmin,
      name: 'Administrador Larangola',
      isActive: true,
      adminRole: 'ADMIN',
    },
  });
  console.log('✅ Admin user created');

  // 2. Agent
  const agent = await prisma.user.upsert({
    where: { email: 'agent@larangola.co.ao' },
    update: {},
    create: {
      email: 'agent@larangola.co.ao',
      phone: '+244920000001',
      password: passwordAgent,
      name: 'Agente Larangola',
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
  console.log('✅ Agent user created');

  // 3. Client
  const client = await prisma.user.upsert({
    where: { email: 'client@larangola.co.ao' },
    update: {},
    create: {
      email: 'client@larangola.co.ao',
      phone: '+244930000001',
      password: passwordClient,
      name: 'Cliente Larangola',
      isActive: true,
    },
  });
  console.log('✅ Client user created');

  // 4. Unverified Agent
  const unverifiedAgent = await prisma.user.upsert({
    where: { email: 'agent_unverified@larangola.co.ao' },
    update: {},
    create: {
      email: 'agent_unverified@larangola.co.ao',
      phone: '+244920000002',
      password: passwordAgent,
      name: 'Agente Larangola (Não Verificado)',
      isActive: true,
      agent: {
        create: {
          profession: 'Corretor Independente',
          isVerified: false,
        }
      }
    },
    include: { agent: true }
  });
  console.log('✅ Unverified Agent user created');

  return { admin, agent, client, unverifiedAgent };
}
