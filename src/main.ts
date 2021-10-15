import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ExceptionsLoggerFilter, HttpExceptionFilter } from '@app/filters';
import { ValidationPipe } from '@nestjs/common';
// import { ExcludeNullInterceptor } from '@app/interceptors';
import { config as AWSConfig } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const appConfigService = app.get(ConfigService);
  AWSConfig.update({
    accessKeyId: appConfigService.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: appConfigService.get('AWS_SECRET_ACCESS_KEY'),
    region: appConfigService.get('AWS_REGION'),
  });

  // Filters
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new ExceptionsLoggerFilter(httpAdapter),
    new HttpExceptionFilter(),
  );

  // Validation
  // Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // skipMissingProperties: true,
    }),
  );

  // Serializing
  // Interceptors
  // app
  //   .useGlobalInterceptors
  // new ClassSerializerInterceptor(app.get(Reflector)),
  // new ExcludeNullInterceptor(),
  // ();

  // Auth
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
