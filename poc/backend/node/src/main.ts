import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';

dotenv.config({ path: '../.env' });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: () => new BadRequestException({ error: 'Invalid request' }),
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('AREA Backend API')
    .setDescription('Simple backend API for AREA POC.')
    .setVersion('1.0.0')
    .addTag('health', 'Service health checks.')
    .addTag('users', 'User listing.')
    .addTag('auth', 'Authentication and token generation.')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, swaggerDocument);

  const port = parseInt(process.env.PORT || '8080', 10);
  await app.listen(port, '0.0.0.0');
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
