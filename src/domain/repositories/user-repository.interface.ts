import { UserEntity } from '../entities/user.entity'

export abstract class IUserRepository {
  abstract saveAsync(entity: UserEntity): Promise<void>
  abstract findAsync(email: string): Promise<UserEntity>

  abstract findByIdAsync(id: string): Promise<UserEntity | null>
  abstract findAllAsync(skip?: number, take?: number): Promise<UserEntity[]>
  abstract updateAsync(
    id: string,
    data: Partial<UserEntity>,
  ): Promise<UserEntity | null>
  abstract deleteAsync(id: string): Promise<boolean>
}
