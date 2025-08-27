import { PrismaClient, TaskStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.task.deleteMany();

  // Create sample tasks
  const tasks = await prisma.task.createMany({
    data: [
      {
        title: 'Setup project structure',
        description: 'Initialize the full-stack CRUD application with NestJS backend and Next.js frontend',
        status: TaskStatus.DONE,
      },
      {
        title: 'Implement user authentication',
        description: 'Add login and registration functionality with JWT tokens',
        status: TaskStatus.IN_PROGRESS,
      },
      {
        title: 'Create task management UI',
        description: 'Build responsive task cards with modern Polish-style design using Tailwind CSS',
        status: TaskStatus.TODO,
      },
      {
        title: 'Add dark mode toggle',
        description: 'Implement theme switching functionality for better user experience',
        status: TaskStatus.TODO,
      },
      {
        title: 'Write unit tests',
        description: 'Add comprehensive test coverage for both frontend and backend components',
        status: TaskStatus.TODO,
      },
    ],
  });

  console.log(`✅ Seeded ${tasks.count} tasks successfully`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
