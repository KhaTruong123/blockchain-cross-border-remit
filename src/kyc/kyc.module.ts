import { Module } from '@nestjs/common';
import { KycService } from './services/kyc.service';

@Module({
  providers: [KycService],
  exports: [KycService],
})
export class KycModule {} 