import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { TransferStatus } from '@prisma/client';

@Injectable()
export class TransfersService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('transfers') private transfersQueue: Queue,
  ) {}

  async createTransfer(createTransferDto: CreateTransferDto) {
    const { txHash, amount, recipientAccountNo, memo } = createTransferDto;

    // Find recipient bank account
    const bankAccount = await this.prisma.bankAccount.findFirst({
      where: { accountNo: recipientAccountNo },
    });

    if (!bankAccount) {
      throw new Error('Bank account not found');
    }

    // Create transfer record
    const transfer = await this.prisma.transfer.create({
      data: {
        senderWalletId: '', // Will be set after validation
        recipientBankAccountId: bankAccount.id,
        amountUsd: amount,
        fxRate: 0, // Will be set during processing
        fee: 0, // Will be set during processing
        status: TransferStatus.PENDING,
        memo,
      },
    });

    // Queue validation job
    await this.transfersQueue.add('ValidateTransaction', {
      transferId: transfer.id,
      txHash,
    });

    return transfer;
  }

  async getTransfer(id: string) {
    const transfer = await this.prisma.transfer.findUnique({
      where: { id },
      include: {
        senderWallet: true,
        recipientBankAccount: true,
        offrampTransactions: true,
        kycVerifications: true,
      },
    });

    if (!transfer) {
      return null;
    }

    // Get latest FX quote
    const fxQuote = await this.prisma.fxQuote.findFirst({
      where: {
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      transfer,
      fxQuote,
    };
  }
} 