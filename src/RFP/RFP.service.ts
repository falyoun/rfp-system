import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { GlobalErrors } from '@app/errors';
import { CreateRFPDto } from './DTOs/create-rfp.dto';
import { RFPEntity } from './entities/RFP.entity';
import { UpdateRFPDto } from './DTOs/update-rfp.dto';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable({})
export class RFPService {
  constructor(
    @InjectRepository(RFPEntity)
    private readonly rfpRepository: Repository<RFPEntity>,
  ) {}

  async createOne(createRFPDto: CreateRFPDto) {
    const created = this.rfpRepository.create(createRFPDto);
    return this.rfpRepository.save(created);
  }
  async findOne(findOneOptions: FindOneOptions<RFPEntity>) {
    const rfp = await this.rfpRepository.findOne(findOneOptions);
    if (rfp) return rfp;
    throw new HttpException(GlobalErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
  }
  findAll(findOptions: FindManyOptions<RFPEntity> = {}) {
    return this.rfpRepository.find(findOptions);
  }
  async replace(
    findOneOptions: FindOneOptions<RFPEntity> = {},
    data: QueryDeepPartialEntity<UpdateRFPDto>,
  ) {
    const rfp = await this.findOne(findOneOptions);
    return this.rfpRepository.update(rfp.id, data);
  }

  async deleteOne(findOneOptions: FindOneOptions<RFPEntity>) {
    const rfp = await this.findOne(findOneOptions);
    return this.rfpRepository.delete(rfp.id);
  }
}
