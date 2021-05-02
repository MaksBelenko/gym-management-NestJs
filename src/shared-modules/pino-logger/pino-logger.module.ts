import { Module } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { ASYNC_STORAGE } from './logger.constants';
import { PinoLoggerService } from './pino-logger.service';

const asyncLocalStorage = new AsyncLocalStorage();

@Module({
  providers: [
    PinoLoggerService,
    {
      provide: ASYNC_STORAGE,
      useValue: asyncLocalStorage,
    }
  ],
  exports: [PinoLoggerService],
})
export class PinoLoggerModule {}

// ----- Usage in main.ts -------------
// app.use((req, res, next) => {
//   const asyncLocalStorage = app.get(ASYNC_STORAGE);
//   const traceId = req.headers['x-request-id'] || uuidv4();
//   const store = new Map().set('traceId', traceId);
//   asyncLocalStorage.run(store, () => {
//       next();
//   })
// })
// app.useLogger(app.get(PinoLoggerService));