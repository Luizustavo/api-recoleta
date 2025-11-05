import { Test, TestingModule } from '@nestjs/testing'
import { CreateUserUseCase } from './create-user.use-case'
import { IUserRepository } from '@/domain/repositories/user-repository.interface'
import { CreateUserDto } from '@/application/dtos/user/create-user.dto'
import { ReturnCodeEnum } from '@/domain/enums/return-code.enum'
import * as bcrypt from 'bcrypt'

// Mock bcrypt
jest.mock('bcrypt')

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase

  const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  }

  const mockUserRepository = {
    saveAsync: jest.fn(),
    findAsync: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findAll: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: 'winston',
          useValue: mockLogger,
        },
        {
          provide: IUserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile()

    useCase = module.get<CreateUserUseCase>(CreateUserUseCase)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(useCase).toBeDefined()
  })

  describe('execute', () => {
    it('should create user successfully', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      }

      const hashedPassword = 'hashed_password_123'
      ;(bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword)
      mockUserRepository.saveAsync.mockResolvedValue(undefined)

      const result = await useCase.execute(createUserDto)

      expect(result.success).toBe(true)
      expect(result.code).toBe(ReturnCodeEnum.Success)
      expect(result.message).toBe('User created successfully')
      expect(result.data).toBeDefined()
      expect(result.data.name).toBe('John Doe')
      expect(result.data.email).toBe('john@example.com')
      expect(result.data).not.toHaveProperty('password')

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10)
      expect(mockUserRepository.saveAsync).toHaveBeenCalledTimes(1)
      expect(mockLogger.info).toHaveBeenCalledWith(
        '[User] CreateUserUseCase.execute - request',
        expect.objectContaining({
          request: expect.objectContaining({
            name: 'John Doe',
            email: 'john@example.com',
            password: '***',
          }),
        }),
      )
    })

    it('should handle repository errors', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      }

      const hashedPassword = 'hashed_password_123'
      ;(bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword)

      const error = new Error('Database error')
      mockUserRepository.saveAsync.mockRejectedValue(error)

      const result = await useCase.execute(createUserDto)

      expect(result.success).toBe(false)
      expect(result.code).toBe(ReturnCodeEnum.InternalError)
      expect(result.message).toBe('Error creating user')
      expect(result.data).toBeUndefined()

      expect(mockLogger.error).toHaveBeenCalledWith(
        '[User] CreateUserUseCase.error',
        { error },
      )
    })

    it('should hash password before saving', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'mySecretPassword',
      }

      const hashedPassword = 'super_hashed_password'
      ;(bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword)
      mockUserRepository.saveAsync.mockResolvedValue(undefined)

      await useCase.execute(createUserDto)

      expect(bcrypt.hash).toHaveBeenCalledWith('mySecretPassword', 10)

      const saveCall = mockUserRepository.saveAsync.mock.calls[0][0]
      expect(saveCall.password).toBe(hashedPassword)
      expect(saveCall.password).not.toBe('mySecretPassword')
    })

    it('should log success with masked password', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'testPassword',
      }

      ;(bcrypt.hash as jest.Mock).mockResolvedValue('hashed')
      mockUserRepository.saveAsync.mockResolvedValue(undefined)

      await useCase.execute(createUserDto)

      expect(mockLogger.info).toHaveBeenCalledWith(
        '[User] CreateUserUseCase.execute - request',
        {
          request: {
            name: 'Test User',
            email: 'test@example.com',
            password: '***',
          },
        },
      )

      expect(mockLogger.info).toHaveBeenCalledWith(
        '[User] CreateUserUseCase.success',
        expect.objectContaining({
          user: expect.objectContaining({
            name: 'Test User',
            email: 'test@example.com',
          }),
        }),
      )
    })
  })
})
