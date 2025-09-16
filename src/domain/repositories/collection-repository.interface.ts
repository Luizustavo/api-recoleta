import { CollectionEntity } from '../entities/collection.entity'

export interface CollectionRepositoryInterface {
  create(collection: CollectionEntity): Promise<CollectionEntity>
  findById(id: string): Promise<CollectionEntity | null>
  findByWasteId(wasteId: string): Promise<CollectionEntity[]>
  findByCollectorId(collectorId: string): Promise<CollectionEntity[]>
  findByCollectorIdAndWasteId(
    collectorId: string,
    wasteId: string,
  ): Promise<CollectionEntity | null>
  findAllByCollectorId(
    collectorId: string,
    filters?: {
      status?: string
      page?: number
      limit?: number
    },
  ): Promise<CollectionEntity[]>
  update(
    id: string,
    collection: Partial<CollectionEntity>,
  ): Promise<CollectionEntity>
  updateStatus(
    id: string,
    status: string,
    collectedAt?: Date,
  ): Promise<CollectionEntity>
  delete(id: string): Promise<void>
}
