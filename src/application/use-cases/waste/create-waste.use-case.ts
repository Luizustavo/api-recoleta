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
          addr.street === createWasteDto.address.rua &&
          addr.number === createWasteDto.address.numero &&
          addr.city === createWasteDto.address.cidade &&
          addr.state === createWasteDto.address.estado &&
          addr.zipCode === createWasteDto.address.cep,
      )

      if (!address) {
        // Create address if not exists
        const addressEntity = new AddressEntity({
          street: createWasteDto.address.rua,
          number: createWasteDto.address.numero,
          city: createWasteDto.address.cidade,
          state: createWasteDto.address.estado,
          country: 'Brasil',
          zipCode: createWasteDto.address.cep,
          userId,
        })

        address = await this.addressRepository.create(addressEntity)
        this.logger.log(`Created new address with ID: ${address.id}`)
      } else {
        this.logger.log(`Using existing address with ID: ${address.id}`)
      }

      // Create waste entity
      const discardDateTime = new Date(
        `${createWasteDto.waste.dataDescarte}T${createWasteDto.waste.horaDescarte}`,
      )

      const wasteEntity = new WasteEntity({
        wasteType: createWasteDto.waste.tipoResiduo,
        weight: createWasteDto.waste.peso,
        quantity: createWasteDto.waste.quantidade,
        unit: createWasteDto.waste.unidade,
        condition: createWasteDto.waste.condicao,
        hasPackaging: createWasteDto.waste.embalagem === 'sim',
        discardDate: discardDateTime,
        additionalDescription: createWasteDto.waste.descricaoAdicional,
        images: createWasteDto.waste.imagens || [],
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
