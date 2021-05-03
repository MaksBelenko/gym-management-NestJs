import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { config as awsConfig } from 'aws-sdk';
import { v4 as uuidv4} from 'uuid';
import * as httpContext from 'express-http-context'
import * as helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { TraceLoggerService } from './shared-modules/trace-logger/trace-logger.service'
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
    const logger = new Logger('bootstrap');    

    const app = await NestFactory.create<NestExpressApplication>(
        AppModule, 
        { logger: true, }
    );

    /* Adding request identifier to logger */
    app.use(httpContext.middleware)
    app.use((req, res, next) => {
        httpContext.set('traceId', uuidv4());
        next();
    })

    app.useLogger(app.get(TraceLoggerService));

    /* Helmet and Cors */
    if (process.env.NODE_ENV !== 'dev') {
        app.use(helmet());
        app.enableCors();
    }

    /* Views setup */
    // app.useStaticAssets(join(__dirname, '..', 'public'));
    app.setBaseViewsDir(join(__dirname, '..', 'views'));
    app.setViewEngine('hbs');


    app.setGlobalPrefix('/api');
    // app.useGlobalInterceptors(new ResponseTimeInterceptor());

    const configService = app.get(ConfigService);

    awsConfig.update({
        accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
        region: configService.get('AWS_REGION'),
    });

    app.useGlobalPipes(new ValidationPipe({
        transform: true,            // transorm request json to match types (dto, param, body etc) [slight performance tradeoff]
        whitelist: true,            // strip request json to match dto (remove access properties)
        forbidNonWhitelisted: true, // if json doesn't match dto exactly then fobid request
    }));


    const port = process.env.PORT;
    await app.listen(port);
    logger.log(`Application started listening on port ${port}`);
}
bootstrap();
