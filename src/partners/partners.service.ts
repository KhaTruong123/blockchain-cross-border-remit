import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PartnersService {
  constructor(private readonly prisma: PrismaService) {}
  
  async getPartnerBanks() {
    // Return mock partner banks for development
    return [
      {
        id: 'bank-001',
        name: 'VietComBank',
        publicKey: 'mock-public-key-1',
        walletAddress: 'mock-wallet-1',
      },
      {
        id: 'bank-002',
        name: 'Techcombank',
        publicKey: 'mock-public-key-2',
        walletAddress: 'mock-wallet-2',
      },
      {
        id: 'bank-003',
        name: 'VPBank',
        publicKey: 'mock-public-key-3',
        walletAddress: 'mock-wallet-3',
      },
    ];
  }
} 