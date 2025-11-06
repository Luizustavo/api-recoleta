import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { JwtService } from '@nestjs/jwt'
import { IUserRepository } from '@/domain/repositories/user-repository.interface'
import * as bcrypt from 'bcrypt'
import { LoginDto } from '@/application/dtos/auth/login.dto'

describe('AuthService', () => {
  let service: AuthService
  let userRepository: IUserRepository

  const mockUserRepository = {
    findAsync: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
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
        AuthService,
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

    service = module.get<AuthService>(AuthService)
    userRepository = module.get<IUserRepository>(IUserRepository)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('validateUser', () => {
    it('should return user data when credentials are valid', async () => {
      const email = 'test@example.com'
      const password = 'password123'
      const hashedPassword = await bcrypt.hash(password, 10)

      const mockUser = {
        id: '1',
        email,
        password: hashedPassword,
        name: 'Test User',
        cpf: '12345678900',
        phone: '11999999999',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockUserRepository.findAsync.mockResolvedValue(mockUser)

      const result = await service.validateUser(email, password)

      expect(result).toBeDefined()
      expect(result.email).toBe(email)
      expect(mockUserRepository.findAsync).toHaveBeenCalledWith(email)
    })

    it('should return null when user is not found', async () => {
      mockUserRepository.findAsync.mockResolvedValue(null)

      const result = await service.validateUser(
        'test@example.com',
        'password123',
      )

      expect(result).toBeNull()
    })

    it('should return null when password is invalid', async () => {
      const hashedPassword = await bcrypt.hash('correctPassword', 10)

      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test User',
        cpf: '12345678900',
        phone: '11999999999',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockUserRepository.findAsync.mockResolvedValue(mockUser)

      const result = await service.validateUser(
        'test@example.com',
        'wrongPassword',
      )

      expect(result).toBeNull()
    })
  })

  describe('login', () => {
    it('should return access token when login is successful', async () => {
      const password = 'password123'
      const hashedPassword = await bcrypt.hash(password, 10)

      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        password: hashedPassword,
        cpf: '12345678900',
        phone: '11999999999',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const loginDto: LoginDto = {
        email: 'test@example.com',
        password,
      }

      const mockToken = 'jwt-token-123'
      mockUserRepository.findAsync.mockResolvedValue(mockUser)
      mockJwtService.signAsync.mockResolvedValue(mockToken)

      const result = await service.login(loginDto)

      expect(result).toBeDefined()
      expect(result.access_token).toBe(mockToken)
      expect(result.user).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
      })
    })

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongPassword',
      }

      mockUserRepository.findAsync.mockResolvedValue(null)

      await expect(service.login(loginDto)).rejects.toThrow(
        'Credenciais inválidas',
      )
    })
  })
})
