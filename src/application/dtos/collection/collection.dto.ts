import { UserDto } from '../user/user.dto'
import { WasteDto } from '../waste/waste.dto'

export class CollectionDto {
  id: string
  collectorId: string
  wasteId: string
  status: string
  signedAt: string
  collectedAt?: string
  collector?: UserDto
  waste?: WasteDto
  createdAt: Date
  updatedAt: Date
}
