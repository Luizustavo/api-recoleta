interface Props {
  name: string
  email: string
  password?: string
}

export class UserEntity {
  private props: Props
  private _id: string

  constructor(props: Props, id?: string) {
    this.props = props
    if (id) this._id = id
  }

  get id(): string {
    return this._id
  }

  get name(): string {
    return this.props.name
  }

  get email(): string {
    return this.props.email
  }

  get password(): string | undefined {
    return this.props.password
  }
}
