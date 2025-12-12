import { Module } from '@nestjs/common';
import { InitService } from './init.service';
import { InitController } from './init.controller';
import { UserModule } from '@/api/user/user.module';
import { RoleModule } from '@/api/role/role.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '@/config/configuration';
import { TypeOrmModule, type TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'node:path';
import { PermissionModule } from '@/api/permission/permission.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '@/constants';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60d' },
    }),
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
    RoleModule,
    PermissionModule,
  ],
  controllers: [InitController],
  providers: [InitService],
})
export class InitModule {}
