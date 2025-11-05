import {
  coordinateToNumber,
  calculateDistance,
  validateCoordinateFormat,
} from './coordinate.utils'

describe('Coordinate Utils', () => {
  describe('coordinateToNumber', () => {
    describe('latitude conversion', () => {
      it('should convert valid latitude string to number', () => {
        expect(coordinateToNumber('45.5', 'latitude')).toBe(45.5)
        expect(coordinateToNumber('-23.5505', 'latitude')).toBe(-23.5505)
        expect(coordinateToNumber('0', 'latitude')).toBe(0)
      })

      it('should accept boundary values for latitude', () => {
        expect(coordinateToNumber('90', 'latitude')).toBe(90)
        expect(coordinateToNumber('-90', 'latitude')).toBe(-90)
      })

      it('should throw error for latitude out of bounds', () => {
        expect(() => coordinateToNumber('91', 'latitude')).toThrow(
          'Invalid latitude: must be between -90 and 90',
        )
        expect(() => coordinateToNumber('-91', 'latitude')).toThrow(
          'Invalid latitude: must be between -90 and 90',
        )
      })

      it('should throw error for invalid latitude string', () => {
        expect(() => coordinateToNumber('abc', 'latitude')).toThrow(
          'Invalid latitude: must be a valid number',
        )
      })

      it('should throw error for empty latitude string', () => {
        expect(() => coordinateToNumber('', 'latitude')).toThrow(
          'latitude is required',
        )
      })

      it('should throw error for undefined latitude', () => {
        expect(() => coordinateToNumber(undefined, 'latitude')).toThrow(
          'latitude is required',
        )
      })
    })

    describe('longitude conversion', () => {
      it('should convert valid longitude string to number', () => {
        expect(coordinateToNumber('90.5', 'longitude')).toBe(90.5)
        expect(coordinateToNumber('-46.6333', 'longitude')).toBe(-46.6333)
        expect(coordinateToNumber('0', 'longitude')).toBe(0)
      })

      it('should accept boundary values for longitude', () => {
        expect(coordinateToNumber('180', 'longitude')).toBe(180)
        expect(coordinateToNumber('-180', 'longitude')).toBe(-180)
      })

      it('should throw error for longitude out of bounds', () => {
        expect(() => coordinateToNumber('181', 'longitude')).toThrow(
          'Invalid longitude: must be between -180 and 180',
        )
        expect(() => coordinateToNumber('-181', 'longitude')).toThrow(
          'Invalid longitude: must be between -180 and 180',
        )
      })

      it('should throw error for invalid longitude string', () => {
        expect(() => coordinateToNumber('xyz', 'longitude')).toThrow(
          'Invalid longitude: must be a valid number',
        )
      })

      it('should throw error for undefined longitude', () => {
        expect(() => coordinateToNumber(undefined, 'longitude')).toThrow(
          'longitude is required',
        )
      })
    })
  })

  describe('calculateDistance', () => {
    it('should calculate distance between two points', () => {
      // São Paulo to Rio de Janeiro (approximately 357 km)
      const saoPauloLat = '-23.5505'
      const saoPauloLon = '-46.6333'
      const rioLat = '-22.9068'
      const rioLon = '-43.1729'

      const distance = calculateDistance(
        saoPauloLat,
        saoPauloLon,
        rioLat,
        rioLon,
      )

      // Should be approximately 357 km (with some tolerance)
      expect(distance).toBeGreaterThan(350)
      expect(distance).toBeLessThan(365)
    })

    it('should return 0 for same coordinates', () => {
      const distance = calculateDistance(
        '-23.5505',
        '-46.6333',
        '-23.5505',
        '-46.6333',
      )

      expect(distance).toBe(0)
    })

    it('should calculate distance between equator points', () => {
      const distance = calculateDistance('0', '0', '0', '1')

      // 1 degree at equator is approximately 111 km
      expect(distance).toBeGreaterThan(110)
      expect(distance).toBeLessThan(112)
    })

    it('should handle small distances', () => {
      // Two points very close to each other
      const distance = calculateDistance(
        '-23.5505',
        '-46.6333',
        '-23.5506',
        '-46.6334',
      )

      expect(distance).toBeGreaterThan(0)
      expect(distance).toBeLessThan(0.2)
    })

    it('should throw error for invalid coordinates', () => {
      expect(() =>
        calculateDistance('invalid', '-46.6333', '-23.5505', '-46.6333'),
      ).toThrow()

      expect(() =>
        calculateDistance('-23.5505', 'invalid', '-23.5505', '-46.6333'),
      ).toThrow()
    })
  })

  describe('validateCoordinateFormat', () => {
    it('should return valid for correct coordinates', () => {
      const result = validateCoordinateFormat('-23.5505', '-46.6333')

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should return invalid for out of bounds latitude', () => {
      const result = validateCoordinateFormat('91', '-46.6333')

      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0]).toContain('latitude')
    })

    it('should return invalid for out of bounds longitude', () => {
      const result = validateCoordinateFormat('-23.5505', '181')

      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0]).toContain('longitude')
    })

    it('should return multiple errors for both invalid coordinates', () => {
      const result = validateCoordinateFormat('abc', 'xyz')

      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(2)
    })

    it('should validate when only latitude is provided', () => {
      const validResult = validateCoordinateFormat('-23.5505', undefined)
      expect(validResult.isValid).toBe(true)

      const invalidResult = validateCoordinateFormat('91', undefined)
      expect(invalidResult.isValid).toBe(false)
    })

    it('should validate when only longitude is provided', () => {
      const validResult = validateCoordinateFormat(undefined, '-46.6333')
      expect(validResult.isValid).toBe(true)

      const invalidResult = validateCoordinateFormat(undefined, '181')
      expect(invalidResult.isValid).toBe(false)
    })

    it('should return valid when both coordinates are undefined', () => {
      const result = validateCoordinateFormat(undefined, undefined)

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })
  })
})
