import { Global, Module } from '@nestjs/common';
import { AppFileService } from './app-file.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppFileEntity } from './app-file.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([AppFileEntity])],
  controllers: [],
  providers: [AppFileService],
  exports: [AppFileService],
})
export class FileUploadModule {}
