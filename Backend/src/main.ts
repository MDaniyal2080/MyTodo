import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';
import compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security & performance middleware
  app.use(helmet());
  app.use(compression());

  // Enable CORS for frontend access (configurable via env)
  const corsOrigins = (
    process.env.CORS_ORIGINS || 'http://localhost:3000,http://127.0.0.1:3000'
  )
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    // Using credentials: false for broader origin handling (no cookies/auth headers)
    credentials: false,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Prisma client will disconnect on module destroy

  const port = Number(process.env.PORT) || 3001;
  const host = process.env.HOST || '0.0.0.0';
  await app.listen(port, host);
  console.log(`🚀 Backend server running on http://${host}:${port}`);
}
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
