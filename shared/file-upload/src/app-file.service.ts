import { Injectable } from '@nestjs/common';
import { AppFileEntity } from './app-file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
@Injectable()
export class AppFileService {
  constructor(
    @InjectRepository(AppFileEntity)
    private appFilesRepository: Repository<AppFileEntity>,
    private readonly configService: ConfigService,
  ) {}
  async uploadPublicFile(dataBuffer: Buffer, filename: string) {
    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Body: dataBuffer,
        Key: `${uuid()}-${filename}`,
      })
      .promise();

    const newFile = this.appFilesRepository.create({
      key: uploadResult.Key,
      url: uploadResult.Location,
    });
    return this.appFilesRepository.save(newFile);
  }
}
