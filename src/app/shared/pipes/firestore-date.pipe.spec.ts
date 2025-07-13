import { FirestoreDatePipe } from './firestore-date.pipe';

describe('FirestoreDatePipe', () => {
  let pipe: FirestoreDatePipe;
  const testDate = new Date('2024-01-15T10:30:00.000Z');

  beforeEach(() => {
    pipe = new FirestoreDatePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('Date object input', () => {
    it('should transform Date object with default format (short)', () => {
      const result = pipe.transform(testDate);

      expect(result).toContain(testDate.toLocaleDateString());
      expect(result).toContain(testDate.toLocaleTimeString());
    });

    it('should transform Date object with short format', () => {
      const result = pipe.transform(testDate, 'short');

      expect(result).toBe(
        testDate.toLocaleDateString() + ' ' + testDate.toLocaleTimeString(),
      );
    });

    it('should transform Date object with date format', () => {
      const result = pipe.transform(testDate, 'date');

      expect(result).toBe(testDate.toLocaleDateString());
    });

    it('should transform Date object with time format', () => {
      const result = pipe.transform(testDate, 'time');

      expect(result).toBe(testDate.toLocaleTimeString());
    });

    it('should transform Date object with full format', () => {
      const result = pipe.transform(testDate, 'full');

      expect(result).toBe(testDate.toLocaleString());
    });

    it('should transform Date object with unknown format (default to short)', () => {
      const result = pipe.transform(testDate, 'unknown');

      expect(result).toBe(
        testDate.toLocaleDateString() + ' ' + testDate.toLocaleTimeString(),
      );
    });
  });

  describe('Firestore Timestamp input', () => {
    let mockTimestamp: any;

    beforeEach(() => {
      mockTimestamp = {
        toDate: jasmine.createSpy('toDate').and.returnValue(testDate),
      };
    });

    it('should transform Firestore Timestamp with default format', () => {
      const result = pipe.transform(mockTimestamp);

      expect(mockTimestamp.toDate).toHaveBeenCalled();
      expect(result).toBe(
        testDate.toLocaleDateString() + ' ' + testDate.toLocaleTimeString(),
      );
    });

    it('should transform Firestore Timestamp with date format', () => {
      const result = pipe.transform(mockTimestamp, 'date');

      expect(mockTimestamp.toDate).toHaveBeenCalled();
      expect(result).toBe(testDate.toLocaleDateString());
    });

    it('should transform Firestore Timestamp with time format', () => {
      const result = pipe.transform(mockTimestamp, 'time');

      expect(mockTimestamp.toDate).toHaveBeenCalled();
      expect(result).toBe(testDate.toLocaleTimeString());
    });

    it('should transform Firestore Timestamp with full format', () => {
      const result = pipe.transform(mockTimestamp, 'full');

      expect(mockTimestamp.toDate).toHaveBeenCalled();
      expect(result).toBe(testDate.toLocaleString());
    });
  });

  describe('String input', () => {
    it('should transform valid date string', () => {
      const dateString = '2024-01-15T10:30:00.000Z';
      const result = pipe.transform(dateString);

      const expectedDate = new Date(dateString);
      expect(result).toBe(
        expectedDate.toLocaleDateString() +
          ' ' +
          expectedDate.toLocaleTimeString(),
      );
    });

    it('should transform date string with different format', () => {
      const dateString = '2024-01-15T10:30:00.000Z';
      const result = pipe.transform(dateString, 'date');

      const expectedDate = new Date(dateString);
      expect(result).toBe(expectedDate.toLocaleDateString());
    });

    it('should handle invalid date string', () => {
      const result = pipe.transform('invalid-date');

      // Should return some result, but it might be "Invalid Date" or similar
      expect(typeof result).toBe('string');
    });
  });

  describe('Edge cases', () => {
    it('should return empty string for null input', () => {
      const result = pipe.transform(null);

      expect(result).toBe('');
    });

    it('should return empty string for undefined input', () => {
      const result = pipe.transform(undefined);

      expect(result).toBe('');
    });

    it('should return empty string for empty string input', () => {
      const result = pipe.transform('');

      expect(result).toBe('');
    });

    it('should return empty string for number input that cannot be converted to date', () => {
      const result = pipe.transform(123456);

      expect(result).toBe('');
    });

    it('should return empty string for boolean input', () => {
      const result = pipe.transform(true);

      expect(result).toBe('');
    });

    it('should return empty string for object without toDate method', () => {
      const result = pipe.transform({ someProperty: 'value' });

      expect(result).toBe('');
    });

    it('should handle Timestamp with toDate method that throws error', () => {
      const mockTimestamp = {
        toDate: jasmine.createSpy('toDate').and.throwError('Conversion error'),
      };

      expect(() => {
        pipe.transform(mockTimestamp);
      }).toThrow();
    });
  });

  describe('Format variations', () => {
    it('should handle case sensitivity in format parameter', () => {
      const result1 = pipe.transform(testDate, 'SHORT');
      const result2 = pipe.transform(testDate, 'Date');
      const result3 = pipe.transform(testDate, 'TIME');

      // Should default to short format for unrecognized cases
      expect(result1).toBe(
        testDate.toLocaleDateString() + ' ' + testDate.toLocaleTimeString(),
      );
      expect(result2).toBe(
        testDate.toLocaleDateString() + ' ' + testDate.toLocaleTimeString(),
      );
      expect(result3).toBe(
        testDate.toLocaleDateString() + ' ' + testDate.toLocaleTimeString(),
      );
    });

    it('should handle whitespace in format parameter', () => {
      const result = pipe.transform(testDate, ' date ');

      // Should default to short format for unrecognized format
      expect(result).toBe(
        testDate.toLocaleDateString() + ' ' + testDate.toLocaleTimeString(),
      );
    });

    it('should handle empty format parameter', () => {
      const result = pipe.transform(testDate, '');

      // Should default to short format
      expect(result).toBe(
        testDate.toLocaleDateString() + ' ' + testDate.toLocaleTimeString(),
      );
    });
  });

  describe('Real-world scenarios', () => {
    it('should consistently format the same date', () => {
      const result1 = pipe.transform(testDate, 'date');
      const result2 = pipe.transform(testDate, 'date');

      expect(result1).toBe(result2);
    });

    it('should handle different timezones consistently', () => {
      const utcDate = new Date('2024-01-15T10:30:00.000Z');
      const result = pipe.transform(utcDate, 'date');

      expect(result).toBe(utcDate.toLocaleDateString());
    });

    it('should handle future dates', () => {
      const futureDate = new Date('2030-12-31T23:59:59.999Z');
      const result = pipe.transform(futureDate, 'full');

      expect(result).toBe(futureDate.toLocaleString());
    });

    it('should handle past dates', () => {
      const pastDate = new Date('1990-01-01T00:00:00.000Z');
      const result = pipe.transform(pastDate, 'short');

      expect(result).toBe(
        pastDate.toLocaleDateString() + ' ' + pastDate.toLocaleTimeString(),
      );
    });
  });
});
