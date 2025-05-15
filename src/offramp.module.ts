import { Module } from '@nestjs/common';
import { OfframpService } from './offramp.service';

@Module({
  providers: [OfframpService],
  exports: [OfframpService],
})
export class OfframpModule {}
