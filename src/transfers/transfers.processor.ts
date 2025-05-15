import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Connection } from '@solana/web3.js';
import { PrismaService } from '../prisma/prisma.service';
import { TransferStatus } from '@prisma/client';

@Processor('transfers')
export class TransfersProcessor {
  private solanaConnection: Connection;

  constructor(private readonly prisma: PrismaService) {
    this.solanaConnection = new Connection(process.env.QUICKNODE_RPC_URL);
  }

  @Process('ValidateTransaction')
  async validateTransaction(job: Job<{ transferId: string; txHash: string }>) {
    const { transferId, txHash } = job.data;

    try {
      // Get transaction details from Solana
      const transaction = await this.solanaConnection.getParsedTransaction(txHash);

      if (!transaction) {
        throw new Error('Transaction not found');
      }

      // Validate USDC transfer
      const isValid = await this.validateUsdcTransfer(transaction);
      
      if (!isValid) {
        await this.prisma.transfer.update({
          where: { id: transferId },
          data: { status: TransferStatus.INVALID },
        });
        return;
      }

      // Update transfer status
      await this.prisma.transfer.update({
        where: { id: transferId },
        data: { status: TransferStatus.VALID },
      });

      // Queue off-ramp process
      // This would be handled by another processor
    } catch (error) {
      console.error('Error validating transaction:', error);
      await this.prisma.transfer.update({
        where: { id: transferId },
        data: { status: TransferStatus.INVALID },
      });
    }
  }

  private async validateUsdcTransfer(transaction: any): Promise<boolean> {
    // Implement USDC transfer validation logic here
    // This is a placeholder - actual implementation would check:
    // - Token program ID
    // - USDC mint address
    // - Amount
    // - Recipient address
    return true;
  }
} 