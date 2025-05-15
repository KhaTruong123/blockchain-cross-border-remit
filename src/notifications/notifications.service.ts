import { Injectable, Logger } from '@nestjs/common';
import { SmsService } from './services/sms.service';
import { NotificationChannel } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

interface NotificationOptions {
  userId: string;
  templateId: string;
  channel: NotificationChannel;
  payload: Record<string, any>;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly smsService: SmsService,
    private readonly prisma: PrismaService,
  ) {}

  async sendNotification(options: NotificationOptions): Promise<boolean> {
    try {
      // Log notification information
      this.logger.log(`Sending notification to user ${options.userId} via ${options.channel}`);
      
      // Save notification to database
      const notification = await this.prisma.notification.create({
        data: {
          userId: options.userId,
          templateId: options.templateId,
          channel: options.channel,
          payload: options.payload,
        },
      });
      
      // Send notification through appropriate channel
      let success = false;
      
      if (options.channel === NotificationChannel.SMS) {
        // Get phone number from user
        const user = await this.prisma.user.findUnique({
          where: { id: options.userId },
          select: { phone: true },
        });
        
        if (!user) {
          throw new Error(`User ${options.userId} not found`);
        }
        
        // Process template and payload to create SMS content
        const message = this.formatTemplateMessage(options.templateId, options.payload);
        
        // Send SMS
        success = await this.smsService.sendSms({
          to: user.phone,
          body: message,
        });
      } else if (options.channel === NotificationChannel.EMAIL) {
        // TODO: Implement email service
        this.logger.log('Email service not implemented yet');
        success = true; // Mock success
      }
      
      // Update notification sent timestamp
      if (success) {
        await this.prisma.notification.update({
          where: { id: notification.id },
          data: { sentAt: new Date() },
        });
      }
      
      return success;
    } catch (error) {
      this.logger.error(`Failed to send notification: ${error.message}`, error.stack);
      return false;
    }
  }
  
  private formatTemplateMessage(templateId: string, payload: Record<string, any>): string {
    // Mock templates
    const templates = {
      'transfer_initiated': 'Transfer of ${amount} USD initiated. Tracking ID: ${transferId}',
      'transfer_completed': 'Your transfer of ${amount} USD (${amountInVnd} VND) has been completed!',
      'transfer_failed': 'Your transfer of ${amount} USD has failed. Reason: ${reason}',
      'kyc_required': 'Please complete KYC verification for your recent transfer.',
    };
    
    // Get template
    let message = templates[templateId] || 'Notification from Vikki Remit';
    
    // Replace variables in template
    Object.entries(payload).forEach(([key, value]) => {
      message = message.replace(`\${${key}}`, value);
    });
    
    return message;
  }
} 