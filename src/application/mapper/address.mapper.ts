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
      longitude: entity.longitude,
      latitude: entity.latitude,
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
  ): Partial<AddressEntity> {
    const updateData: any = {}

    if (request.street !== undefined) updateData.street = request.street
    if (request.number !== undefined) updateData.number = request.number
    if (request.city !== undefined) updateData.city = request.city
    if (request.state !== undefined) updateData.state = request.state
    if (request.country !== undefined) updateData.country = request.country
    if (request.zipCode !== undefined) updateData.zipCode = request.zipCode
    if (request.longitude !== undefined)
      updateData.longitude = request.longitude
    if (request.latitude !== undefined) updateData.latitude = request.latitude

    return updateData
  }
}
