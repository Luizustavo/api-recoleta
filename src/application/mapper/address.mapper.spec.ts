import { AddressMapper } from './address.mapper'
import { AddressEntity } from '@/domain/entities/address.entity'
import { CreateAddressDto } from '../dtos/address/create-address.dto'

describe('AddressMapper', () => {
  const userId = 'user-123'

  describe('toDto', () => {
    it('should map AddressEntity to AddressDto', () => {
      const entity = new AddressEntity(
        {
          street: 'Rua das Flores',
          number: '123',
          city: 'São Paulo',
          state: 'SP',
          country: 'Brasil',
          zipCode: '01234-567',
          latitude: '-23.5505',
          longitude: '-46.6333',
          userId,
        },
        'address-123',
      )

      const result = AddressMapper.toDto(entity)

      expect(result).toBeDefined()
      expect(result.id).toBe('address-123')
      expect(result.street).toBe('Rua das Flores')
      expect(result.number).toBe('123')
      expect(result.city).toBe('São Paulo')
      expect(result.state).toBe('SP')
      expect(result.country).toBe('Brasil')
      expect(result.zipCode).toBe('01234-567')
      expect(result.latitude).toBe(-23.5505)
      expect(result.longitude).toBe(-46.6333)
      expect(result.userId).toBe(userId)
      expect(result.createdAt).toBeDefined()
      expect(result.updatedAt).toBeDefined()
    })

    it('should handle undefined coordinates', () => {
      const entity = new AddressEntity(
        {
          street: 'Rua das Flores',
          number: '123',
          city: 'São Paulo',
          state: 'SP',
          country: 'Brasil',
          zipCode: '01234-567',
          userId,
        },
        'address-123',
      )

      const result = AddressMapper.toDto(entity)

      expect(result.latitude).toBeUndefined()
      expect(result.longitude).toBeUndefined()
    })
  })

  describe('toEntity', () => {
    it('should map CreateAddressDto to AddressEntity', () => {
      const createDto: CreateAddressDto = {
        street: 'Av. Paulista',
        number: '1000',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01310-100',
        latitude: '-23.5618',
        longitude: '-46.6565',
      }

      const result = AddressMapper.toEntity(createDto, userId)

      expect(result).toBeInstanceOf(AddressEntity)
      expect(result.street).toBe('Av. Paulista')
      expect(result.number).toBe('1000')
      expect(result.city).toBe('São Paulo')
      expect(result.state).toBe('SP')
      expect(result.country).toBe('Brasil')
      expect(result.zipCode).toBe('01310-100')
      expect(result.latitude).toBe('-23.5618')
      expect(result.longitude).toBe('-46.6565')
      expect(result.userId).toBe(userId)
    })

    it('should use default country when not provided', () => {
      const createDto: CreateAddressDto = {
        street: 'Av. Paulista',
        number: '1000',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01310-100',
        latitude: '-23.5618',
        longitude: '-46.6565',
      }

      const result = AddressMapper.toEntity(createDto, userId)

      expect(result.country).toBe('Brasil')
    })

    it('should use provided country when specified', () => {
      const createDto: CreateAddressDto = {
        street: 'Main Street',
        number: '100',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        latitude: '40.7128',
        longitude: '-74.0060',
      }

      const result = AddressMapper.toEntity(createDto, userId)

      expect(result.country).toBe('USA')
    })
  })

  describe('constructor', () => {
    it('should throw error when trying to instantiate', () => {
      expect(() => new (AddressMapper as any)()).toThrow(
        'AddressMapper is a static class and should not be instantiated',
      )
    })
  })
})
