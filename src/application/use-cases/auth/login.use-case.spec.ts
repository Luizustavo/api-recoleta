import { Test, TestingModule } from '@nestjs/testing'
import { LoginUseCase } from './login.use-case'
import { IUserRepository } from '@/domain/repositories/user-repository.interface'
import { JwtService } from '@nestjs/jwt'
import { LoginDto } from '@/application/dtos/auth/login.dto'
import { ReturnCodeEnum } from '@/domain/enums/return-code.enum'
import * as bcrypt from 'bcrypt'

jest.mock('bcrypt')

describe('LoginUseCase', () => {
  let useCase: LoginUseCase

  const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  }

  const mockUserRepository = {
    findAsync: jest.fn(),
    saveAsync: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findAll: jest.fn(),
  }

  const mockJwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUseCase,
        {
          provide: 'winston',
          useValue: mockLogger,
        },
        {
          provide: IUserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile()

    useCase = module.get<LoginUseCase>(LoginUseCase)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(useCase).toBeDefined()
  })

  describe('execute', () => {
    it('should login successfully with valid credentials', async () => {
      const loginDto: LoginDto = {
        email: 'user@example.com',
        password: 'password123',
      }

      const mockUser = {
        id: 'user-123',
        email: 'user@example.com',
        name: 'John Doe',
        password: 'hashed_password',
      }

      const mockToken = 'jwt_token_123'

      mockUserRepository.findAsync.mockResolvedValue(mockUser)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)
      mockJwtService.signAsync.mockResolvedValue(mockToken)

      const result = await useCase.execute(loginDto)

      expect(result.success).toBe(true)
      expect(result.code).toBe(ReturnCodeEnum.Success)
      expect(result.message).toBe('Login successful')
      expect(result.data).toBeDefined()
      expect(result.data?.access_token).toBe(mockToken)
      expect(result.data?.user).toEqual({
        id: 'user-123',
        email: 'user@example.com',
        name: 'John Doe',
      })

      expect(mockUserRepository.findAsync).toHaveBeenCalledWith(
        'user@example.com',
      )
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'password123',
        'hashed_password',
      )
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        id: 'user-123',
        email: 'user@example.com',
        name: 'John Doe',
      })
      expect(mockLogger.info).toHaveBeenCalledWith(
        '[Auth] LoginUseCase.success',
        { userId: 'user-123' },
      )
    })

    it('should fail when user is not found', async () => {
      const loginDto: LoginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      }

      mockUserRepository.findAsync.mockResolvedValue(null)

      const result = await useCase.execute(loginDto)

      expect(result.success).toBe(false)
      expect(result.code).toBe(ReturnCodeEnum.NotFound)
      expect(result.message).toBe('Credenciais inválidas')
      expect(result.data).toBeUndefined()

      expect(mockLogger.warn).toHaveBeenCalledWith(
        '[Auth] LoginUseCase.userNotFound',
        { email: 'nonexistent@example.com' },
      )
    })

    it('should fail when password is incorrect', async () => {
      const loginDto: LoginDto = {
        email: 'user@example.com',
        password: 'wrong_password',
      }

      const mockUser = {
        id: 'user-123',
        email: 'user@example.com',
        name: 'John Doe',
        password: 'hashed_password',
      }

      mockUserRepository.findAsync.mockResolvedValue(mockUser)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)

      const result = await useCase.execute(loginDto)

      expect(result.success).toBe(false)
      expect(result.code).toBe(ReturnCodeEnum.NotFound)
      expect(result.message).toBe('Credenciais inválidas')
      expect(result.data).toBeUndefined()

      expect(mockLogger.warn).toHaveBeenCalledWith(
        '[Auth] LoginUseCase.invalidPassword',
        { email: 'user@example.com' },
      )
    })

    it('should handle repository errors', async () => {
      const loginDto: LoginDto = {
        email: 'user@example.com',
        password: 'password123',
      }

      const error = new Error('Database connection failed')
      mockUserRepository.findAsync.mockRejectedValue(error)

      const result = await useCase.execute(loginDto)

      expect(result.success).toBe(false)
      expect(result.code).toBe(ReturnCodeEnum.InternalError)
      expect(result.message).toBe('Error during login')
      expect(result.data).toBeUndefined()

      expect(mockLogger.error).toHaveBeenCalledWith(
        '[Auth] LoginUseCase.error',
        { error },
      )
    })

    it('should log request with masked password', async () => {
      const loginDto: LoginDto = {
        email: 'user@example.com',
        password: 'secret_password',
      }

      mockUserRepository.findAsync.mockResolvedValue(null)

      await useCase.execute(loginDto)

      expect(mockLogger.info).toHaveBeenCalledWith(
        '[Auth] LoginUseCase.execute - request',
        {
          request: {
            email: 'user@example.com',
            password: '***',
          },
        },
      )
    })

    it('should handle user without password field', async () => {
      const loginDto: LoginDto = {
        email: 'user@example.com',
        password: 'password123',
      }

      const mockUser = {
        id: 'user-123',
        email: 'user@example.com',
        name: 'John Doe',
        password: undefined,
      }

      mockUserRepository.findAsync.mockResolvedValue(mockUser)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)

      const result = await useCase.execute(loginDto)

      expect(result.success).toBe(false)
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', '')
    })
  })
})
