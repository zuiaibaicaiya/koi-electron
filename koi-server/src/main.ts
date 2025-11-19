import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cluster from 'node:cluster';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { InitModule } from './api/init/init.module';
import { InitController } from './api/init/init.controller';

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
async function init() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const initController = app.select(InitModule).get(InitController);
  initController.create({});
  await app.close();
}
if (cluster.isPrimary) {
  void init();
  cluster.fork();
  cluster.on('exit', (worker) => {
    cluster.fork();
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  void bootstrap();
}
