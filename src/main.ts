import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const hostDomain = AppModule.isDev
    ? `${AppModule.host}: ${AppModule.port}`
    : AppModule.host;

  const options = new DocumentBuilder()
    .setTitle('shop api')
    .setDescription('The SHOP API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerUrl: `${hostDomain}/api/docs`,
    swaggerOptions: {
      filter: true,
    },
  });

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(AppModule.port);
}
bootstrap();
