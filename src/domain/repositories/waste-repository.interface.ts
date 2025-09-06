import { WasteEntity } from '../entities/waste.entity'

export interface WasteRepositoryInterface {
  create(waste: WasteEntity): Promise<WasteEntity>
  findAllByUserId(userId: string): Promise<WasteEntity[]>
  findById(id: string): Promise<WasteEntity | null>
  findAvailable(filters?: {
    city?: string
    state?: string
    wasteType?: string
    maxDistance?: number
    latitude?: number
    longitude?: number
    page?: number
    limit?: number
  }): Promise<WasteEntity[]>
  update(id: string, waste: Partial<WasteEntity>): Promise<WasteEntity>
  delete(id: string): Promise<void>
}
