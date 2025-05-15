import { Controller, Get } from '@nestjs/common';
import { PartnersService } from './partners.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('partners')
@Controller('partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Get('banks')
  @ApiOperation({ summary: 'Get list of partner banks' })
  async getPartnerBanks() {
    return await this.partnersService.getPartnerBanks();
  }
} 