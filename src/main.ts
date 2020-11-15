import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ResponseTimeInterceptor } from './Interceptors/response-time.interceptor';
import { appConfig } from './enviroment.consts';

async function bootstrap() {
    const logger = new Logger('bootstrap');

    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('/api');
    // app.useGlobalInterceptors(new ResponseTimeInterceptor());

    const port = appConfig.serverPort;
    await app.listen(port);
    logger.log(`Application started listening on port ${port}`);
}
bootstrap();
