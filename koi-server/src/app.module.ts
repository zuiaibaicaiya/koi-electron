import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './api/user/user.module';
import { InitModule } from './api/init/init.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '@/config/configuration';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'node:path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'sqlite',
          database: join(
            configService.get('storage') as string,
            'koi-electron.sqlite',
          ),
          autoLoadEntities: true,
          synchronize: true,
        } as TypeOrmModuleOptions;
      },
      inject: [ConfigService],
    }),
    UserModule,
    InitModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
