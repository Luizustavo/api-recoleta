import { AddressDto } from '../address/address.dto'
import { UserDto } from '../user/user.dto'

export class WasteDto {
  id: string
  wasteType: string
  weight: number
  quantity: number
  unit: string
  condition: string
  hasPackaging: boolean
  discardDate: string
  status: string
  additionalDescription?: string
  images?: string[]
  userId: string
  addressId: string
  user?: UserDto
  address: AddressDto
  createdAt: Date
  updatedAt: Date
}
