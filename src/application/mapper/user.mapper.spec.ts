import { UserMapper } from './user.mapper'
import { UserEntity } from '@/domain/entities/user.entity'
import { CreateUserDto } from '../dtos/user/create-user.dto'

describe('UserMapper', () => {
  describe('toDto', () => {
    it('should map UserEntity to UserDto', () => {
      const userEntity = new UserEntity(
        {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'hashedPassword',
        },
        '123',
      )

      const result = UserMapper.toDto(userEntity)

      expect(result).toBeDefined()
      expect(result.id).toBe('123')
      expect(result.name).toBe('John Doe')
      expect(result.email).toBe('john@example.com')
    })

    it('should not include password in DTO', () => {
      const userEntity = new UserEntity(
        {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'hashedPassword',
        },
        '123',
      )

      const result = UserMapper.toDto(userEntity)

      expect(result).not.toHaveProperty('password')
    })
  })

  describe('toEntity', () => {
    it('should map CreateUserDto to UserEntity', () => {
      const createUserDto: CreateUserDto = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123',
      }

      const result = UserMapper.toEntity(createUserDto)

      expect(result).toBeInstanceOf(UserEntity)
      expect(result.name).toBe('Jane Doe')
      expect(result.email).toBe('jane@example.com')
      expect(result.password).toBe('password123')
    })

    it('should create entity without id', () => {
      const createUserDto: CreateUserDto = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123',
      }

      const result = UserMapper.toEntity(createUserDto)

      expect(result.id).toBeUndefined()
    })
  })
})
