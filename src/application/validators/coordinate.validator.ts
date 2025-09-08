import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator'

/**
 * Custom validator for coordinates (latitude and longitude)
 * Validates string format and bounds without converting to number
 */
export function IsCoordinate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsCoordinate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false
          }

          const coordinate = parseFloat(value)
          if (isNaN(coordinate)) {
            return false
          }

          // Determine if this is latitude or longitude based on property name
          const isLatitude = args.property.toLowerCase().includes('lat')
          const isLongitude = args.property.toLowerCase().includes('lon')

          if (isLatitude) {
            return coordinate >= -90 && coordinate <= 90
          }

          if (isLongitude) {
            return coordinate >= -180 && coordinate <= 180
          }

          // Fallback: assume it's a general coordinate (use longitude bounds)
          return coordinate >= -180 && coordinate <= 180
        },
        defaultMessage(args: ValidationArguments) {
          const isLatitude = args.property.toLowerCase().includes('lat')
          const isLongitude = args.property.toLowerCase().includes('lon')

          if (isLatitude) {
            return 'Latitude deve estar entre -90 e 90'
          }

          if (isLongitude) {
            return 'Longitude deve estar entre -180 e 180'
          }

          return 'Coordenada deve ser um número válido'
        },
      },
    })
  }
}

/**
 * Validates coordinate format without conversion (utility function)
 * @param coordinate - The coordinate string to validate
 * @param type - Type of coordinate for proper bounds checking
 * @returns true if valid, false otherwise
 */
export function isValidCoordinate(
  coordinate: string,
  type: 'latitude' | 'longitude',
): boolean {
  if (typeof coordinate !== 'string') return false

  const num = parseFloat(coordinate)
  if (isNaN(num)) return false

  if (type === 'latitude') {
    return num >= -90 && num <= 90
  } else {
    return num >= -180 && num <= 180
  }
}
