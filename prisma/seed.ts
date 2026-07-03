import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seeds/users.seed';
import { seedPlans } from './seeds/plans.seed';
import { seedCategories } from './seeds/categories.seed';
import { seedProperties } from './seeds/properties.seed';
import { seedPayments } from './seeds/payments.seed';
import { seedReviews } from './seeds/reviews.seed';
import { seedPropertyAudits } from './seeds/property-audits.seed';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  try {
    // 1. Independent entities (Plans & Categories)
    const { premiumPlan } = await seedPlans(prisma);
    const { catHouse, catApt } = await seedCategories(prisma);

    // 2. Base dependent entities (Users/Agents)
    const { admin, agent } = await seedUsers(prisma);

    // 3. Dependent entities (Properties & Payments)
    await seedProperties(prisma, admin.id, agent, catHouse.id, catApt.id);
    
    await seedPayments(prisma, agent.id, premiumPlan.price, premiumPlan.id);

    // 4. Auxiliary entities (Reviews)
    await seedReviews(prisma);

    // 5. Market entities (Property Audits)
    await seedPropertyAudits(prisma);

    console.log('🌱 Seed completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
