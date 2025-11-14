/**
 * Utility functions for coordinate operations
 */

/**
 * Converts a coordinate string to number for mathematical calculations
 * @param coordinate - The coordinate as string (e.g., "-23.5505")
 * @param type - Type of coordinate (latitude or longitude) for error messages
 * @returns The coordinate as number
 * @throws Error if coordinate is invalid
 */
export function coordinateToNumber(
  coordinate: string | undefined,
  type: 'latitude' | 'longitude',
): number {
  if (!coordinate) {
    throw new Error(`${type} is required`)
  }

  const numCoordinate = Number.parseFloat(coordinate)

  if (Number.isNaN(numCoordinate)) {
    throw new Error(`Invalid ${type}: must be a valid number`)
  }

  // Validate bounds
  if (type === 'latitude' && (numCoordinate < -90 || numCoordinate > 90)) {
    throw new Error(`Invalid ${type}: must be between -90 and 90`)
  }

  if (type === 'longitude' && (numCoordinate < -180 || numCoordinate > 180)) {
    throw new Error(`Invalid ${type}: must be between -180 and 180`)
  }

  return numCoordinate
}

/**
 * Calculate the distance between two points using Haversine formula
 * @param lat1 - Latitude of first point (as string)
 * @param lon1 - Longitude of first point (as string)
 * @param lat2 - Latitude of second point (as string)
 * @param lon2 - Longitude of second point (as string)
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: string,
  lon1: string,
  lat2: string,
  lon2: string,
): number {
  const lat1Num = coordinateToNumber(lat1, 'latitude')
  const lon1Num = coordinateToNumber(lon1, 'longitude')
  const lat2Num = coordinateToNumber(lat2, 'latitude')
  const lon2Num = coordinateToNumber(lon2, 'longitude')

  const R = 6371 // Earth's radius in kilometers
  const dLat = toRadians(lat2Num - lat1Num)
  const dLon = toRadians(lon2Num - lon1Num)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1Num)) *
      Math.cos(toRadians(lat2Num)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return distance
}

/**
 * Convert degrees to radians
 * @param degrees - Degrees to convert
 * @returns Radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Check if coordinates are valid format (for validation only)
 * @param latitude - Latitude as string
 * @param longitude - Longitude as string
 * @returns Object with validity and error messages
 */
export function validateCoordinateFormat(
  latitude?: string,
  longitude?: string,
): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  try {
    if (latitude) coordinateToNumber(latitude, 'latitude')
  } catch (error) {
    errors.push((error as Error).message)
  }

  try {
    if (longitude) coordinateToNumber(longitude, 'longitude')
  } catch (error) {
    errors.push((error as Error).message)
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
