interface Props {
  wasteType: string
  weight: number
  quantity: number
  unit: string
  condition: string
  hasPackaging: boolean
  discardDate: Date
  additionalDescription?: string
  images?: string[]
  status?: string
  userId: string
  addressId: string
  createdAt?: Date
  updatedAt?: Date
}

export class WasteEntity {
  private props: Props
  private _id: string

  constructor(props: Props, id?: string) {
    this.props = {
      ...props,
      status: props.status || 'AVAILABLE',
      images: props.images || [],
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    }
    if (id) this._id = id
  }

  get id(): string {
    return this._id
  }

  get wasteType(): string {
    return this.props.wasteType
  }

  get weight(): number {
    return this.props.weight
  }

  get quantity(): number {
    return this.props.quantity
  }

  get unit(): string {
    return this.props.unit
  }

  get condition(): string {
    return this.props.condition
  }

  get hasPackaging(): boolean {
    return this.props.hasPackaging
  }

  get discardDate(): Date {
    return this.props.discardDate
  }

  get additionalDescription(): string | undefined {
    return this.props.additionalDescription
  }

  get images(): string[] {
    return this.props.images!
  }

  get status(): string {
    return this.props.status!
  }

  get userId(): string {
    return this.props.userId
  }

  get addressId(): string {
    return this.props.addressId
  }

  get createdAt(): Date {
    return this.props.createdAt!
  }

  get updatedAt(): Date {
    return this.props.updatedAt!
  }
}
