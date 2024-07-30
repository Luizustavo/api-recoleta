import { WinstonInstrumentation } from '@opentelemetry/instrumentation-winston'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-grpc'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc'
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core'
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http'
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express'

import {
  BatchSpanProcessor,
  NodeTracerProvider,
} from '@opentelemetry/sdk-trace-node'
import {
  LoggerProvider,
  SimpleLogRecordProcessor,
} from '@opentelemetry/sdk-logs'

import { registerInstrumentations } from '@opentelemetry/instrumentation'
import { logs } from '@opentelemetry/api-logs'
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api'

import { SEMRESATTRS_SERVICE_NAME } from '@opentelemetry/semantic-conventions'
import { Resource } from '@opentelemetry/resources'
import 'dotenv/config'
import {
  CompositePropagator,
  W3CBaggagePropagator,
  W3CTraceContextPropagator,
} from '@opentelemetry/core'
import { B3Propagator, B3InjectEncoding } from '@opentelemetry/propagator-b3'
import { GrpcInstrumentation } from '@opentelemetry/instrumentation-grpc'

if (process.env.OTLP_LOGS === 'true') {
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ALL)
}
const logExporter = new OTLPLogExporter({
  url: process.env.OTLP_ENDPOINT,
})

const traceExporter = new OTLPTraceExporter({
  url: process.env.OTLP_ENDPOINT,
})

const resource = new Resource({
  [SEMRESATTRS_SERVICE_NAME]: 'ms-tkpp-merchant',
})

function telemetry() {
  const tracerProvider = new NodeTracerProvider({
    resource: resource,
  })

  tracerProvider.register({
    propagator: new CompositePropagator({
      propagators: [
        new W3CTraceContextPropagator(),
        new W3CBaggagePropagator(),
        new B3Propagator(),
        new B3Propagator({ injectEncoding: B3InjectEncoding.MULTI_HEADER }),
      ],
    }),
  })
  tracerProvider.addSpanProcessor(new BatchSpanProcessor(traceExporter))

  const loggerProvider = new LoggerProvider({
    resource: resource,
  })

  logs.setGlobalLoggerProvider(loggerProvider)
  loggerProvider.addLogRecordProcessor(
    new SimpleLogRecordProcessor(logExporter),
  )

  registerInstrumentations({
    instrumentations: [
      new ExpressInstrumentation(),
      new NestInstrumentation(),
      new GrpcInstrumentation(),
      new HttpInstrumentation(),
      new WinstonInstrumentation({
        enabled: true,
      }),
    ],
  })
}

export default telemetry
