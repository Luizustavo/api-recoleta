import { UserEntity } from '../entities/user.entity'

export abstract class IUserRepository {
  abstract saveAsync(entity: UserEntity): Promise<void>
  abstract findAsync(email: string): Promise<UserEntity>
}
