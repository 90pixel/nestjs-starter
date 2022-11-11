import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  //validation class
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  //swagger config
  const config = new DocumentBuilder()
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
    })
    .setTitle('Live API')
    .setDescription('Corpeo Live API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  //allow any cors
  app.enableCors();

  await app.listen(5656);
}

bootstrap().then((r) =>
  console.log('Server started ' + new Date().toLocaleString()),
);
