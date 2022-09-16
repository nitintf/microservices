import { NestFactory } from '@nestjs/core';
import { AuthzModule } from './authz.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthzModule);
  await app.listen(3333);
}
bootstrap();
