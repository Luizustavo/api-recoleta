import { UserEntity } from '@/domain/entities/user.entity'
import { CreateUserDto } from '../dtos/user/create-user.dto'
import { UserDto } from '../dtos/user/user.dto'

export class UserMapper {
  private constructor() {
    throw new Error(
      'UserMapper is a static class and should not be instantiated',
    )
  }

  public static toDto(entity: UserEntity): UserDto {
    const dto: UserDto = {
      id: entity.id,
      name: entity.name,
      email: entity.email,
    }
    return dto
  }

  public static toEntity(request: CreateUserDto): UserEntity {
    return new UserEntity({
      name: request.name,
      email: request.email,
      password: request.password,
    })
  }
}
