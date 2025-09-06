import { registerDecorator, ValidationOptions } from 'class-validator'

export function IsCoordinate(
  type: 'latitude' | 'longitude',
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCoordinate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') {
            return false
          }

          const numValue = parseFloat(value)

          if (isNaN(numValue)) {
            return false
          }

          if (type === 'latitude') {
            return numValue >= -90 && numValue <= 90
          } else if (type === 'longitude') {
            return numValue >= -180 && numValue <= 180
          }

          return false
        },
        defaultMessage() {
          if (type === 'latitude') {
            return 'Latitude must be a valid number between -90 and 90'
          } else if (type === 'longitude') {
            return 'Longitude must be a valid number between -180 and 180'
          }
          return 'Invalid coordinate'
        },
      },
    })
  }
}

/**
 * Converte string de coordenada para número, validando os limites
 */
export function parseCoordinate(
  value: string,
  type: 'latitude' | 'longitude',
): number {
  const numValue = parseFloat(value)

  if (isNaN(numValue)) {
    throw new Error(`Invalid ${type}: must be a valid number`)
  }

  if (type === 'latitude' && (numValue < -90 || numValue > 90)) {
    throw new Error('Latitude must be between -90 and 90')
  }

  if (type === 'longitude' && (numValue < -180 || numValue > 180)) {
    throw new Error('Longitude must be between -180 and 180')
  }

  return numValue
}
