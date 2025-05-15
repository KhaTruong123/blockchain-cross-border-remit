import { Module } from '@nestjs/common';
import { SmsService } from './services/sms.service';
import { NotificationsService } from './notifications.service';

@Module({
  providers: [SmsService, NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {} 