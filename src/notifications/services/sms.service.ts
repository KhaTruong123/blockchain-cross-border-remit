import { Injectable, Logger } from '@nestjs/common';

interface SmsOptions {
  to: string;
  body: string;
}

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  async sendSms(options: SmsOptions): Promise<boolean> {
    // Trong môi trường dev, chỉ log message thay vì gửi SMS thật
    this.logger.log(`[MOCK SMS] To: ${options.to}, Message: ${options.body}`);

    // Giả lập thành công
    return true;

    // Khi cần dùng Twilio thật, uncomment code dưới đây:
    /*
    try {
      const twilioClient = require('twilio')(
        process.env.TWILIO_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      
      await twilioClient.messages.create({
        body: options.body,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: options.to
      });
      
      return true;
    } catch (error) {
      this.logger.error(`Failed to send SMS: ${error.message}`, error.stack);
      return false;
    }
    */
  }
} 