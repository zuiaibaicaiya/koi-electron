import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './api/user/user.module';
import { InitModule } from './api/init/init.module';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '@/config/configuration';
import { join } from 'node:path';
import { PermissionModule } from './api/permission/permission.module';
import { jwtConstants } from '@/constants';
import { JwtModule } from '@nestjs/jwt';
import { RoleModule } from '@/api/role/role.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@/guards/auth/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60d' },
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
    RoleModule,
    PermissionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
