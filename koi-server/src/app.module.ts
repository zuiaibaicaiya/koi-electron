import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InitModule } from '@/init/init.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@/guards/auth/auth.guard';

@Module({
  imports: [InitModule],
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
