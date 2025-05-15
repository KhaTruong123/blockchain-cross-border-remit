import { Controller, Post, Get, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TransfersService } from './transfers.service';
import { CreateTransferDto } from './dto/create-transfer.dto';

@ApiTags('transfers')
@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Post()
  @ApiOperation({ summary: 'Create inbound transfer record on USDC receipt' })
  @ApiResponse({ status: 201, description: 'Transfer created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid txHash, amount, or memo' })
  @ApiResponse({ status: 422, description: 'Bank account not found' })
  async createTransfer(@Body() createTransferDto: CreateTransferDto) {
    try {
      const transfer = await this.transfersService.createTransfer(createTransferDto);
      return { transferId: transfer.id };
    } catch (error) {
      if (error.message === 'Bank account not found') {
        throw new HttpException('Bank account not found', HttpStatus.UNPROCESSABLE_ENTITY);
      }
      throw new HttpException('Invalid transfer data', HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transfer status timeline' })
  @ApiResponse({ status: 200, description: 'Transfer details retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Transfer not found' })
  async getTransfer(@Param('id') id: string) {
    const transfer = await this.transfersService.getTransfer(id);
    if (!transfer) {
      throw new HttpException('Transfer not found', HttpStatus.NOT_FOUND);
    }
    return transfer;
  }
} 