export class ReturnBaseDTO<T> {
  success: boolean
  message: string
  code?: string
  data?: T
}
