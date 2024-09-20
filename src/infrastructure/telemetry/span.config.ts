import {
  Span as ApiSpan,
  SpanOptions,
  SpanStatusCode,
  trace,
} from '@opentelemetry/api'

const recordException = (span: ApiSpan, error: any) => {
  span.recordException(error)
  span.setStatus({ code: SpanStatusCode.ERROR, message: error.message })
}

function objectToAttr(tag: string, span: ApiSpan, value: any) {
  if (typeof value !== 'object' || value === null) {
    // Verifica se o valor é um objeto simples ou null antes de prosseguir
    span.setAttribute(tag, value)
    return
  }

  for (const key of Object.keys(value)) {
    const attrValue = value[key]
    // Verifica se o valor da chave é um tipo suportado antes de definir como atributo
    if (
      typeof attrValue === 'string' ||
      typeof attrValue === 'number' ||
      typeof attrValue === 'boolean'
    ) {
      span.setAttribute(`${tag}.${key}`, attrValue)
    } else {
      // Se não for um tipo suportado, tenta converter o valor para string
      try {
        span.setAttribute(`${tag}.${key}`, JSON.stringify(attrValue))
      } catch (e) {
        span.recordException(e)
        // Se não for possível converter para string, define o valor como "unknown"
        span.setAttribute(`${tag}.${key}`, 'unknown')
      }
    }
  }
}

const recordRequestAndResponse = (
  span: ApiSpan,
  request: any,
  response: any,
) => {
  if (request) {
    objectToAttr('request', span, request)
  }

  if (response) {
    objectToAttr('response', span, response)
  }
}

export function Span(name?: string, options: SpanOptions = {}) {
  return (
    target: any,
    propertyKey: PropertyKey,
    propertyDescriptor: PropertyDescriptor,
  ) => {
    const originalFunction = propertyDescriptor.value
    const wrappedFunction = function PropertyDescriptor(...args: any[]) {
      const tracer = trace.getTracer('default')
      const spanName =
        name || `${target.constructor.name}.${String(propertyKey)}`
      return tracer.startActiveSpan(spanName, options, (span) => {
        let request: any
        if (args.length) {
          request = args[0]
        }

        if (originalFunction.constructor.name === 'AsyncFunction') {
          return originalFunction
            .apply(this, args)
            .then((resp) => {
              recordRequestAndResponse(span, request, resp)
              return resp
            })
            .catch((error) => {
              recordException(span, error)
              throw error
            })
            .finally(() => {
              span.end()
            })
        }

        try {
          const resp = originalFunction.apply(this, args)
          recordRequestAndResponse(span, request, resp)
          return resp
        } catch (error) {
          recordException(span, error)
          throw error
        } finally {
          span.end()
        }
      })
    }

    propertyDescriptor.value = wrappedFunction

    copyMetadataFromFunctionToFunction(originalFunction, wrappedFunction)
  }
}
const copyMetadataFromFunctionToFunction = (
  originalFunction: () => void,
  newFunction: () => void,
): void => {
  // Get the current metadata and set onto the wrapper
  // to ensure other decorators ( ie: NestJS EventPattern / RolesGuard )
  // won't be affected by the use of this instrumentation
  Reflect.getMetadataKeys(originalFunction).forEach((metadataKey) => {
    Reflect.defineMetadata(
      metadataKey,
      Reflect.getMetadata(metadataKey, originalFunction),
      newFunction,
    )
  })
}
