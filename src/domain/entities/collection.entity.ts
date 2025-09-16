import { UserEntity } from './user.entity'
import { WasteEntity } from './waste.entity'

interface Props {
  collectorId: string
  wasteId: string
  status: string
  signedAt: Date
  collectedAt?: Date
  collector?: UserEntity
  waste?: WasteEntity
  createdAt?: Date
  updatedAt?: Date
}

export class CollectionEntity {
  private props: Props
  private _id: string

  constructor(props: Props, id?: string) {
    this.props = {
      ...props,
      status: props.status || 'SIGNED',
      signedAt: props.signedAt || new Date(),
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    }
    if (id) this._id = id
  }

  get id(): string {
    return this._id
  }

  get collectorId(): string {
    return this.props.collectorId
  }

  get wasteId(): string {
    return this.props.wasteId
  }

  get status(): string {
    return this.props.status
  }

  get signedAt(): Date {
    return this.props.signedAt
  }

  get collectedAt(): Date | undefined {
    return this.props.collectedAt
  }

  get collector(): UserEntity | undefined {
    return this.props.collector
  }

  get waste(): WasteEntity | undefined {
    return this.props.waste
  }

  get createdAt(): Date {
    return this.props.createdAt!
  }

  get updatedAt(): Date {
    return this.props.updatedAt!
  }

  updateStatus(status: string, collectedAt?: Date): void {
    this.props.status = status
    if (collectedAt) {
      this.props.collectedAt = collectedAt
    }
    this.props.updatedAt = new Date()
  }
}
