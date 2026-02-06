import { PrismaClient } from '@prisma/client';
import { hash } from 'argon2';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.session.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.user.deleteMany();

  // Create test user
  const testUser = await prisma.user.create({
    data: {
      name: 'Test User',
      email: 'test@example.com',
      password: await hash('password123'),
      role: 'user',
    },
  });

  // Create sample movies
  await prisma.movie.createMany({
    data: [
      {
        title: 'The Matrix',
        year: '1999',
        imageUrl: 'https://via.placeholder.com/150?text=The+Matrix',
        ownerId: testUser.id,
      },
      {
        title: 'Inception',
        year: '2010',
        imageUrl: 'https://via.placeholder.com/150?text=Inception',
        ownerId: testUser.id,
      },
      {
        title: 'Interstellar',
        year: '2014',
        imageUrl: 'https://via.placeholder.com/150?text=Interstellar',
        ownerId: testUser.id,
      },
    ],
  });

  console.log('Seed data created successfully');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
