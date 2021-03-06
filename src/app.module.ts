import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

import { MailModule } from './mail/mail.module';
import { UtilsModule } from './utils/utils.module';
import { ShopperModule } from './shopper/shopper.module';
import { StoreModule } from './store/store.module';
import { DeliveryModule } from './delivery/delivery.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AdminModule } from './admin/admin.module';
import { RolesGuard } from './utils/guards/role.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      // load: [
      //   process.env.NODE_ENV == 'development'
      //     ? configuration
      //     : prodConfiguration,
      // ],
    }),
    MongooseModule.forRoot(process.env.CONNECTION_STRING),
    MailModule,
    UtilsModule,
    AuthModule,
    ShopperModule,
    StoreModule,
    DeliveryModule,
    AdminModule,

  ],
  controllers: [AppController],
  providers: [AppService,  ],
})
export class AppModule {}
