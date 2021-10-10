import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthenticationGuard } from '../authentication/guards/jwt-authentication.guard';
import { CreateRFPDto } from './DTOs/create-rfp.dto';
import { RFPService } from './RFP.service';

@Controller('rfp')
export class RFPController {
  constructor(private readonly rfpService: RFPService) {}
  @UseGuards(JwtAuthenticationGuard)
  @Post()
  createRFP(@Body() createRFPDto: CreateRFPDto) {
    return this.rfpService.createOne(createRFPDto);
  }
}
