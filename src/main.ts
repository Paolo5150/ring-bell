import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsService } from './camera/WsService'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const httpServer = app.getHttpServer();
  const wsService = app.get(WsService);
  wsService.init(httpServer);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
