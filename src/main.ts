import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { config as awsConfig } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const logger = new Logger('bootstrap');

    const api = await NestFactory.create(AppModule);

    api.setGlobalPrefix('/api');
    // app.useGlobalInterceptors(new ResponseTimeInterceptor());

    const configService = api.get(ConfigService);

    awsConfig.update({
        accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
        region: configService.get('AWS_REGION'),
    });

    api.useGlobalPipes(new ValidationPipe({
        whitelist: true,            // strip request json to match dto (remove access properties)
        forbidNonWhitelisted: true, // if json doesn't match dto exactly then fobid request
        transform: true,            // transorm request json to match types (dto, param, body etc) [slight performance tradeoff]
    }));

    const port = configService.get('PORT');
    await api.listen(port);
    logger.log(`Application started listening on port ${port}`);
}
bootstrap();
