import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cluster from 'node:cluster';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('koi-server')
    .setContact('最爱白菜呀', '', '1355081829@qq.com')
    .setDescription('koi-electron API 文档')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  const port = process.env.PORT ?? 5166;
  await app.listen(port, () => {
    console.log(`Listening on http://127.0.0.1:${port}/api`);
  });
}
if (cluster.isPrimary) {
  cluster.fork();
  cluster.on('exit', (worker) => {
    cluster.fork();
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  void bootstrap();
}
