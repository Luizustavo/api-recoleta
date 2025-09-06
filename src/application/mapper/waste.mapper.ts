import { WasteEntity } from '../../domain/entities/waste.entity'
import { WasteDto } from '../dtos/waste/waste.dto'

export class WasteMapper {
  private constructor() {}

  public static toDto(waste: WasteEntity): WasteDto {
    const dto = new WasteDto()

    dto.id = waste.id
    dto.tipoResiduo = waste.wasteType
    dto.peso = waste.weight
    dto.quantidade = waste.quantity
    dto.unidade = waste.unit
    dto.condicao = waste.condition
    dto.embalagem = waste.hasPackaging ? 'sim' : 'não'
    dto.dataDescarte = waste.discardDate.toISOString().split('T')[0]
    dto.horaDescarte = waste.discardDate.toTimeString().split(' ')[0]
    dto.status = waste.status
    dto.descricaoAdicional = waste.additionalDescription
    dto.imagens = waste.images
    dto.userId = waste.userId
    dto.addressId = waste.addressId
    dto.createdAt = waste.createdAt
    dto.updatedAt = waste.updatedAt

    return dto
  }

  public static toEntity(dto: Partial<WasteDto>): WasteEntity {
    const discardDateTime = new Date(`${dto.dataDescarte}T${dto.horaDescarte}`)

    return new WasteEntity(
      {
        wasteType: dto.tipoResiduo!,
        weight: dto.peso!,
        quantity: dto.quantidade!,
        unit: dto.unidade!,
        condition: dto.condicao!,
        hasPackaging: dto.embalagem === 'sim',
        discardDate: discardDateTime,
        additionalDescription: dto.descricaoAdicional,
        images: dto.imagens,
        status: dto.status,
        userId: dto.userId!,
        addressId: dto.addressId!,
        createdAt: dto.createdAt,
        updatedAt: dto.updatedAt,
      },
      dto.id,
    )
  }
}
