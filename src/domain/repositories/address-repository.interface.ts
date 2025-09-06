import { AddressEntity } from '../entities/address.entity'

export interface AddressRepositoryInterface {
  create(address: AddressEntity): Promise<AddressEntity>
  findAllByUserId(userId: string): Promise<AddressEntity[]>
  findById(id: string): Promise<AddressEntity | null>
  update(id: string, address: Partial<AddressEntity>): Promise<AddressEntity>
  delete(id: string): Promise<void>
}
