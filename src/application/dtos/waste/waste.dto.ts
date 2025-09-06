import { AddressDto } from '../address/address.dto'

export class WasteDto {
  id: string
  tipoResiduo: string
  peso: number
  quantidade: number
  unidade: string
  condicao: string
  embalagem: string
  dataDescarte: string
  horaDescarte: string
  status: string
  descricaoAdicional?: string
  imagens?: string[]
  userId: string
  addressId: string
  address?: AddressDto
  createdAt: Date
  updatedAt: Date
}
