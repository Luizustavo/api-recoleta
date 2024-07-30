import { Global, Module } from '@nestjs/common'
import { TraceService } from './trace.service'

@Global()
@Module({
  controllers: [],
  providers: [TraceService],
  exports: [TraceService],
})
export class TelemetryModule {}
