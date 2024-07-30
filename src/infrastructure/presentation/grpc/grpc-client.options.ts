import { ReflectionService } from '@grpc/reflection'
import { ClientOptions, Transport } from '@nestjs/microservices'

export const grpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: ['user'],
    protoPath: ['proto/user.proto'],
    keepalive: {
      keepaliveTimeMs: 60000,
      keepalivePermitWithoutCalls: 1,
    },
    loader: {
      json: true,
      objects: true,
      arrays: true,
    },
    url: `0.0.0.0:${Number(process.env.GRPC_PORT) || 50051}`,
    onLoadPackageDefinition: (pkg, server) => {
      new ReflectionService(pkg).addToServer(server)
    },
  },
}
