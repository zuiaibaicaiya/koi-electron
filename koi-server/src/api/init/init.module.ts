import { Module } from '@nestjs/common';
import { InitService } from './init.service';
import { InitController } from './init.controller';
import { UserModule } from '@/api/user/user.module';
import { RoleModule } from '@/api/role/role.module';

@Module({
  imports: [UserModule, RoleModule],
  controllers: [InitController],
  providers: [InitService],
})
export class InitModule {}
