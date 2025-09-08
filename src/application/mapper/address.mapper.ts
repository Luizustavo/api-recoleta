import { AddressEntity } from '../../domain/entities/address.entity'
import { CreateAddressDto } from '../dtos/address/create-address.dto'
import { UpdateAddressDto } from '../dtos/address/update-address.dto'
import { AddressDto } from '../dtos/address/address.dto'

export class AddressMapper {
  private constructor() {
    throw new Error(
      'AddressMapper is a static class and should not be instantiated',
    )
  }

  public static toDto(entity: AddressEntity): AddressDto {
    const dto: AddressDto = {
      id: entity.id,
      street: entity.street,
      number: entity.number,
      city: entity.city,
      state: entity.state,
      country: entity.country,
      zipCode: entity.zipCode,
      longitude: entity.longitude ? parseFloat(entity.longitude) : undefined,
      latitude: entity.latitude ? parseFloat(entity.latitude) : undefined,
      userId: entity.userId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }
    return dto
  }

  public static toEntity(
    request: CreateAddressDto,
    userId: string,
  ): AddressEntity {
    return new AddressEntity({
      street: request.street,
      number: request.number,
      city: request.city,
      state: request.state,
      country: request.country || 'Brasil',
      zipCode: request.zipCode,
      longitude: request.longitude,
      latitude: request.latitude,
      userId,
    })
  }

  public static toUpdateData(
    request: UpdateAddressDto,
    userId: string,
  ): AddressEntity {
    return new AddressEntity({
      city: request.city,
      country: request.country,
      number: request.number,
      state: request.state,
      street: request.street,
      zipCode: request.zipCode,
      latitude: request.latitude,
      longitude: request.longitude,
      userId,
    })
  }
}
