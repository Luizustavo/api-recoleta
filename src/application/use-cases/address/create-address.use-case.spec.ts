import { Test, TestingModule } from '@nestjs/testing'
import { CreateAddressUseCase } from './create-address.use-case'
import { CreateAddressDto } from '@/application/dtos/address/create-address.dto'
import { ReturnCodeEnum } from '@/domain/enums/return-code.enum'
import { ADDRESS_REPOSITORY_TOKEN } from '@/infrastructure/persistence/constants'
import { AddressEntity } from '@/domain/entities/address.entity'

describe('CreateAddressUseCase', () => {
  let useCase: CreateAddressUseCase

  const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  }

  const mockAddressRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateAddressUseCase,
        {
          provide: 'winston',
          useValue: mockLogger,
        },
        {
          provide: ADDRESS_REPOSITORY_TOKEN,
          useValue: mockAddressRepository,
        },
      ],
    }).compile()

    useCase = module.get<CreateAddressUseCase>(CreateAddressUseCase)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(useCase).toBeDefined()
  })

  describe('execute', () => {
    it('should create address successfully', async () => {
      const createAddressDto: CreateAddressDto = {
        street: 'Rua das Flores',
        number: '123',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567',
        latitude: '-23.5505',
        longitude: '-46.6333',
      }

      const userId = 'user-123'

      const createdAddress = new AddressEntity(
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

      mockAddressRepository.create.mockResolvedValue(createdAddress)

      const result = await useCase.execute({
        createAddressDto,
        userId,
      })

      expect(result.success).toBe(true)
      expect(result.code).toBe(ReturnCodeEnum.Success)
      expect(result.message).toBe('Address created successfully')
      expect(result.data).toBeDefined()
      expect(result.data?.id).toBe('address-123')
      expect(result.data?.street).toBe('Rua das Flores')
      expect(result.data?.city).toBe('São Paulo')
      expect(result.data?.latitude).toBe(-23.5505)
      expect(result.data?.longitude).toBe(-46.6333)

      expect(mockAddressRepository.create).toHaveBeenCalledTimes(1)
      expect(mockLogger.info).toHaveBeenCalledWith(
        '[Address] CreateAddressUseCase.success',
        expect.objectContaining({
          address: expect.objectContaining({
            id: 'address-123',
            street: 'Rua das Flores',
          }),
        }),
      )
    })

    it('should use default country when not provided', async () => {
      const createAddressDto: CreateAddressDto = {
        street: 'Av. Paulista',
        number: '1000',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01310-100',
        latitude: '-23.5618',
        longitude: '-46.6565',
      }

      const userId = 'user-456'

      const createdAddress = new AddressEntity(
        {
          street: 'Av. Paulista',
          number: '1000',
          city: 'São Paulo',
          state: 'SP',
          country: 'Brasil',
          zipCode: '01310-100',
          latitude: '-23.5618',
          longitude: '-46.6565',
          userId,
        },
        'address-456',
      )

      mockAddressRepository.create.mockResolvedValue(createdAddress)

      const result = await useCase.execute({
        createAddressDto,
        userId,
      })

      expect(result.success).toBe(true)
      expect(result.data?.country).toBe('Brasil')
    })

    it('should handle repository errors', async () => {
      const createAddressDto: CreateAddressDto = {
        street: 'Rua das Flores',
        number: '123',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567',
        latitude: '-23.5505',
        longitude: '-46.6333',
      }

      const userId = 'user-123'
      const error = new Error('Database error')

      mockAddressRepository.create.mockRejectedValue(error)

      const result = await useCase.execute({
        createAddressDto,
        userId,
      })

      expect(result.success).toBe(false)
      expect(result.code).toBe(ReturnCodeEnum.InternalError)
      expect(result.message).toBe('Error creating address')
      expect(result.data).toBeUndefined()

      expect(mockLogger.error).toHaveBeenCalledWith(
        '[Address] CreateAddressUseCase.error',
        { error },
      )
    })

    it('should log request with userId', async () => {
      const createAddressDto: CreateAddressDto = {
        street: 'Test Street',
        number: '999',
        city: 'Test City',
        state: 'TC',
        zipCode: '99999-999',
        latitude: '-23.5505',
        longitude: '-46.6333',
      }

      const userId = 'test-user-id'

      mockAddressRepository.create.mockRejectedValue(new Error('Test error'))

      await useCase.execute({
        createAddressDto,
        userId,
      })

      expect(mockLogger.info).toHaveBeenCalledWith(
        '[Address] CreateAddressUseCase.execute - request',
        expect.objectContaining({
          request: expect.objectContaining({
            userId: 'test-user-id',
          }),
        }),
      )
    })
  })
})
