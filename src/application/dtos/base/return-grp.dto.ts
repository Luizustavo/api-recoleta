export class ReturnGrpcDTO<T> {
  success: boolean
  message: string
  code: string
  data?: T
}
