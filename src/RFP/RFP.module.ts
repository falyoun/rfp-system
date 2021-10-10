import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RFPService } from './RFP.service';
import { RFPController } from './RFP.controller';
import { RFPEntity } from './entities/RFP.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RFPEntity])],
  providers: [RFPService],
  controllers: [RFPController],
})
export class RFPModule {}
