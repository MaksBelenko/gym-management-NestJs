import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as helmet from 'helmet';
import * as config from 'config';

async function bootstrap() {
    const serverConfig = config.get('server');
    const logger = new Logger('bootstrap');

    const app = await NestFactory.create(AppModule);

    // app.enableCors();
    // app.use(helmet());

    app.setGlobalPrefix('/api');

    // // Convert exceptions to JSON readable format
    // app.useGlobalFilters(new HttpExceptionFilter());

    const port = process.env.PORT || serverConfig.port;
    await app.listen(port);
    logger.log(`Application started listening on port ${port}`);
}
bootstrap();
