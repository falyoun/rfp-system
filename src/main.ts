import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ExceptionsLoggerFilter, HttpExceptionFilter } from '@app/filters';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ExcludeNullInterceptor } from '@app/interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
      skipMissingProperties: true,
    }),
  );

  // Serializing
  // Interceptors
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new ExcludeNullInterceptor(),
  );

  // Auth
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
