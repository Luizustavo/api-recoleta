import { isValidCoordinate } from './coordinate.validator'

describe('Coordinate Validator', () => {
  describe('isValidCoordinate', () => {
    describe('latitude validation', () => {
      it('should return true for valid latitudes', () => {
        expect(isValidCoordinate('0', 'latitude')).toBe(true)
        expect(isValidCoordinate('45.5', 'latitude')).toBe(true)
        expect(isValidCoordinate('-45.5', 'latitude')).toBe(true)
        expect(isValidCoordinate('90', 'latitude')).toBe(true)
        expect(isValidCoordinate('-90', 'latitude')).toBe(true)
      })

      it('should return false for invalid latitudes', () => {
        expect(isValidCoordinate('91', 'latitude')).toBe(false)
        expect(isValidCoordinate('-91', 'latitude')).toBe(false)
        expect(isValidCoordinate('100', 'latitude')).toBe(false)
        expect(isValidCoordinate('-100', 'latitude')).toBe(false)
      })

      it('should return false for non-numeric string values', () => {
        expect(isValidCoordinate('abc', 'latitude')).toBe(false)
        expect(isValidCoordinate('', 'latitude')).toBe(false)
        expect(isValidCoordinate('not a number', 'latitude')).toBe(false)
      })
    })

    describe('longitude validation', () => {
      it('should return true for valid longitudes', () => {
        expect(isValidCoordinate('0', 'longitude')).toBe(true)
        expect(isValidCoordinate('90.5', 'longitude')).toBe(true)
        expect(isValidCoordinate('-90.5', 'longitude')).toBe(true)
        expect(isValidCoordinate('180', 'longitude')).toBe(true)
        expect(isValidCoordinate('-180', 'longitude')).toBe(true)
      })

      it('should return false for invalid longitudes', () => {
        expect(isValidCoordinate('181', 'longitude')).toBe(false)
        expect(isValidCoordinate('-181', 'longitude')).toBe(false)
        expect(isValidCoordinate('200', 'longitude')).toBe(false)
        expect(isValidCoordinate('-200', 'longitude')).toBe(false)
      })

      it('should return false for non-numeric string values', () => {
        expect(isValidCoordinate('abc', 'longitude')).toBe(false)
        expect(isValidCoordinate('', 'longitude')).toBe(false)
        expect(isValidCoordinate('not a number', 'longitude')).toBe(false)
      })
    })

    describe('edge cases', () => {
      it('should handle boundary values correctly', () => {
        expect(isValidCoordinate('90.0', 'latitude')).toBe(true)
        expect(isValidCoordinate('-90.0', 'latitude')).toBe(true)
        expect(isValidCoordinate('180.0', 'longitude')).toBe(true)
        expect(isValidCoordinate('-180.0', 'longitude')).toBe(true)
      })

      it('should reject values just outside boundaries', () => {
        expect(isValidCoordinate('90.0001', 'latitude')).toBe(false)
        expect(isValidCoordinate('-90.0001', 'latitude')).toBe(false)
        expect(isValidCoordinate('180.0001', 'longitude')).toBe(false)
        expect(isValidCoordinate('-180.0001', 'longitude')).toBe(false)
      })
    })
  })
})
