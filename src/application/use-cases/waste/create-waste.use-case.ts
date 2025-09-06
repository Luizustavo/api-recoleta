import { Inject, Injectable, Logger } from '@nestjs/common'

import { ReturnBaseDTO } from '../../dtos/base/return-base.dto'
import { CreateWasteDto } from '../../dtos/waste/create-waste.dto'
import { WasteDto } from '../../dtos/waste/waste.dto'
import { WasteMapper } from '../../mapper/waste.mapper'

import { WasteEntity } from '../../../domain/entities/waste.entity'
import { AddressEntity } from '../../../domain/entities/address.entity'
import { ReturnCodeEnum } from '../../../domain/enums/return-code.enum'
import { WasteRepositoryInterface } from '../../../domain/repositories/waste-repository.interface'
import { AddressRepositoryInterface } from '../../../domain/repositories/address-repository.interface'
import {
  ADDRESS_REPOSITORY_TOKEN,
  WASTE_REPOSITORY_TOKEN,
} from '../../../infrastructure/persistence/constants'

interface CreateWasteRequest {
  createWasteDto: CreateWasteDto
  userId: string
}

@Injectable()
export class CreateWasteUseCase {
  private readonly logger = new Logger(CreateWasteUseCase.name)

  constructor(
    @Inject(WASTE_REPOSITORY_TOKEN)
    private readonly wasteRepository: WasteRepositoryInterface,
    @Inject(ADDRESS_REPOSITORY_TOKEN)
    private readonly addressRepository: AddressRepositoryInterface,
  ) {}

  async execute(request: CreateWasteRequest): Promise<ReturnBaseDTO<WasteDto>> {
    try {
      const { createWasteDto, userId } = request
      this.logger.log(`Creating waste for user ${userId}`)

      // Find existing addresses for the user
      const existingAddresses =
        await this.addressRepository.findAllByUserId(userId)

      // Check if we have a similar address
      let address = existingAddresses.find(
        (addr) =>
          addr.street === createWasteDto.address.street &&
          addr.number === createWasteDto.address.number &&
          addr.city === createWasteDto.address.city &&
          addr.state === createWasteDto.address.state &&
          addr.zipCode === createWasteDto.address.zipCode,
      )

      if (!address) {
        // Create address if not exists
        const addressEntity = new AddressEntity({
          street: createWasteDto.address.street,
          number: createWasteDto.address.number,
          city: createWasteDto.address.city,
          state: createWasteDto.address.state,
          country: 'Brasil',
          zipCode: createWasteDto.address.zipCode,
          latitude: createWasteDto.address.latitude,
          longitude: createWasteDto.address.longitude,
          userId,
        })

        address = await this.addressRepository.create(addressEntity)
        this.logger.log(`Created new address with ID: ${address.id}`)
      } else {
        this.logger.log(`Using existing address with ID: ${address.id}`)
      }

      // Create waste entity
      const discardDateTime = new Date(createWasteDto.waste.discardDate)

      const wasteEntity = new WasteEntity({
        wasteType: createWasteDto.waste.wasteType,
        weight: createWasteDto.waste.weight,
        quantity: createWasteDto.waste.quantity,
        unit: createWasteDto.waste.unit,
        condition: createWasteDto.waste.condition,
        hasPackaging: createWasteDto.waste.hasPackaging,
        discardDate: discardDateTime,
        additionalDescription: createWasteDto.waste.additionalDescription,
        images: createWasteDto.waste.images || [],
        userId,
        addressId: address.id,
      })

      const createdWaste = await this.wasteRepository.create(wasteEntity)

      this.logger.log(`Created waste with ID: ${createdWaste.id}`)

      const wasteDto = WasteMapper.toDto(createdWaste)

      return {
        success: true,
        data: wasteDto,
        message: 'Resíduo criado com sucesso',
        code: ReturnCodeEnum.Success,
      }
    } catch (error) {
      this.logger.error(`Error creating waste: ${error}`)

      return {
        success: false,
        data: null,
        message: 'Erro interno do servidor',
        code: ReturnCodeEnum.InternalError,
      }
    }
  }
}
