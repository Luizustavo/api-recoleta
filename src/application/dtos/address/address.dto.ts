export class AddressDto {
  id: string
  street: string
  number: string
  city: string
  state: string
  country: string
  zipCode: string
  longitude?: number
  latitude?: number
  userId: string
  createdAt: Date
  updatedAt: Date
}
