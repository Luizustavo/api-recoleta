import { CollectionEntity } from '../../domain/entities/collection.entity'
import { CollectionDto } from '../dtos/collection/collection.dto'
import { UserMapper } from './user.mapper'
import { WasteMapper } from './waste.mapper'

export class CollectionMapper {
  private constructor() {}

  public static toDto(entity: CollectionEntity): CollectionDto {
    return {
      id: entity.id,
      collectorId: entity.collectorId,
      wasteId: entity.wasteId,
      status: entity.status,
      signedAt: entity.signedAt.toISOString(),
      collectedAt: entity.collectedAt?.toISOString(),
      collector: entity.collector
        ? UserMapper.toDto(entity.collector)
        : undefined,
      waste: entity.waste ? WasteMapper.toDto(entity.waste) : undefined,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }
  }

  public static toEntity(dto: Partial<CollectionDto>): CollectionEntity {
    return new CollectionEntity(
      {
        collectorId: dto.collectorId!,
        wasteId: dto.wasteId!,
        status: dto.status || 'SIGNED',
        signedAt: dto.signedAt ? new Date(dto.signedAt) : new Date(),
        collectedAt: dto.collectedAt ? new Date(dto.collectedAt) : undefined,
        createdAt: dto.createdAt,
        updatedAt: dto.updatedAt,
      },
      dto.id,
    )
  }
}
