"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    await prisma.task.deleteMany();
    const tasks = await prisma.task.createMany({
        data: [
            {
                title: 'Setup project structure',
                description: 'Initialize the full-stack CRUD application with NestJS backend and Next.js frontend',
                status: client_1.TaskStatus.DONE,
            },
            {
                title: 'Implement user authentication',
                description: 'Add login and registration functionality with JWT tokens',
                status: client_1.TaskStatus.IN_PROGRESS,
            },
            {
                title: 'Create task management UI',
                description: 'Build responsive task cards with modern Polish-style design using Tailwind CSS',
                status: client_1.TaskStatus.TODO,
            },
            {
                title: 'Add dark mode toggle',
                description: 'Implement theme switching functionality for better user experience',
                status: client_1.TaskStatus.TODO,
            },
            {
                title: 'Write unit tests',
                description: 'Add comprehensive test coverage for both frontend and backend components',
                status: client_1.TaskStatus.TODO,
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
//# sourceMappingURL=seed.js.map