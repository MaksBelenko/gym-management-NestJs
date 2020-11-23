import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { config as awsConfig } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const logger = new Logger('bootstrap');

    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('/api');
    // app.useGlobalInterceptors(new ResponseTimeInterceptor());

    const configService = app.get(ConfigService);

    awsConfig.update({
        accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
        region: configService.get('AWS_REGION'),
    });

    // doesn't allow more fields than provided in DTO
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true
    }));

    const port = configService.get('PORT');
    await app.listen(port);
    logger.log(`Application started listening on port ${port}`);
}
bootstrap();
