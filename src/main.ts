import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('DELSOS')
    .setDescription('DELSOS API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const corsOptions={
    origin: ['http://localhost:4200']
  };
  app.enableCors(corsOptions);
  app.use(morgan('dev'));
  await app.listen(3000);
}

bootstrap();
