import { Injectable, Logger } from '@nestjs/common';

interface OfframpRequest {
  transferId: string;
  amount: number;  // Changed from amountVnd to amount
  recipientBank: string;
  recipientAccount: string;
}

@Injectable()
export class OfframpService {
  private readonly logger = new Logger(OfframpService.name);
  
  async initiateOfframp(data: OfframpRequest): Promise<any> {
    this.logger.log(`[MOCK] Initiating offramp: ${JSON.stringify(data)}`);
    
    // In dev environment, simulate successful offramp
    return {
      success: true,
      externalReference: `mock-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      status: 'PENDING'
    };
  }
} 