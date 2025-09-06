interface Props {
  street: string
  number: string
  city: string
  state: string
  country: string
  zipCode: string
  longitude?: number
  latitude?: number
  userId: string
  createdAt?: Date
  updatedAt?: Date
}

export class AddressEntity {
  private props: Props
  private _id: string

  constructor(props: Props, id?: string) {
    this.props = {
      ...props,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    }
    if (id) this._id = id
  }

  get id(): string {
    return this._id
  }

  get street(): string {
    return this.props.street
  }

  get number(): string {
    return this.props.number
  }

  get city(): string {
    return this.props.city
  }

  get state(): string {
    return this.props.state
  }

  get country(): string {
    return this.props.country
  }

  get zipCode(): string {
    return this.props.zipCode
  }

  get longitude(): number | undefined {
    return this.props.longitude
  }

  get latitude(): number | undefined {
    return this.props.latitude
  }

  get userId(): string {
    return this.props.userId
  }

  get createdAt(): Date {
    return this.props.createdAt!
  }

  get updatedAt(): Date {
    return this.props.updatedAt!
  }
}
