import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTransferDto {
  @ApiProperty({ description: 'Solana transaction hash' })
  @IsString()
  txHash: string;

  @ApiProperty({ description: 'Transfer amount in USDC' })
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Recipient bank account number' })
  @IsString()
  recipientAccountNo: string;

  @ApiPropertyOptional({ description: 'Optional memo for the transfer' })
  @IsOptional()
  @IsString()
  memo?: string;
} 