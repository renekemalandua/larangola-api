import { PrismaClient, ReviewRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export async function seedReviews(prisma: PrismaClient) {
  console.log('   -> Seeding reviews for agent@larangola.co.ao...');

  const agentUser = await prisma.user.findUnique({
    where: { email: 'agent@larangola.co.ao' },
  });

  if (!agentUser) {
    console.log('   -> Agent not found. Skipping reviews seed.');
    return;
  }

  const hashedPassword = await bcrypt.hash('password123', 10);

  const mockClientsData = [
    { name: 'João Silva', email: 'cliente1@mock.com', rating: 5, comment: 'Agente muito atencioso, ajudou-me a encontrar a casa perfeita!' },
    { name: 'Maria Santos', email: 'cliente2@mock.com', rating: 5, comment: 'Excelente profissional. Recomendo vivamente.' },
    { name: 'Pedro Costa', email: 'cliente3@mock.com', rating: 4, comment: 'Bom serviço, mas demorou um pouco a responder aos e-mails.' },
    { name: 'Ana Oliveira', email: 'cliente4@mock.com', rating: 5, comment: 'Acompanhamento 5 estrelas do início ao fim.' },
    { name: 'Carlos Ferreira', email: 'cliente5@mock.com', rating: 4, comment: 'Tudo correu bem, processo transparente.' },
    { name: 'Sara Mendes', email: 'cliente6@mock.com', rating: 5, comment: 'Muito profissional e conhecedor do mercado de Luanda.' },
    { name: 'Rui Almeida', email: 'cliente7@mock.com', rating: 3, comment: 'O agente foi simpático, mas a casa não estava nas melhores condições.' },
    { name: 'Teresa Gomes', email: 'cliente8@mock.com', rating: 5, comment: 'Impecável! Fechámos negócio muito rapidamente.' },
    { name: 'Miguel Cardoso', email: 'cliente9@mock.com', rating: 4, comment: 'Boa experiência geral.' },
  ];

  for (const clientData of mockClientsData) {
    let client = await prisma.user.findUnique({
      where: { email: clientData.email },
    });

    if (!client) {
      client = await prisma.user.create({
        data: {
          email: clientData.email,
          password: hashedPassword,
          name: clientData.name,
          phone: '+24494000000' + mockClientsData.indexOf(clientData),
          isActive: true,
        },
      });
    }

    // Check if review already exists
    const existingReview = await prisma.review.findFirst({
      where: {
        fromUserId: client.id,
        toUserId: agentUser.id,
        role: ReviewRole.AGENT,
      },
    });

    if (!existingReview) {
      await prisma.review.create({
        data: {
          fromUserId: client.id,
          toUserId: agentUser.id,
          role: ReviewRole.AGENT,
          rating: clientData.rating,
          comment: clientData.comment,
        },
      });
    }
  }

  console.log(`   -> Created 9 mock clients and reviews for ${agentUser.email}`);
}
