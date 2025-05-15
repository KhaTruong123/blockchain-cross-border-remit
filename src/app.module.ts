import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { TransfersModule } from './transfers/transfers.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { OfframpModule } from './offramp/offramp.module';
import { NotificationsModule } from './notifications/notifications.module';
import { KycModule } from './kyc/kyc.module';
import { PartnersModule } from './partners/partners.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
    PrismaModule,
    TransfersModule,
    WebhooksModule,
    OfframpModule,
    NotificationsModule,
    KycModule,
    PartnersModule,
  ],
})
export class AppModule {} 