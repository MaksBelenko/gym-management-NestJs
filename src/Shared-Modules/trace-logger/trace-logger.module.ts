import { Module } from '@nestjs/common';
import { TraceLoggerService } from './trace-logger.service';

@Module({
  providers: [TraceLoggerService],
  exports: [TraceLoggerService]
})
export class TraceLoggerModule {}
