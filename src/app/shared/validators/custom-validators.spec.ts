import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { duplicateNameValidator } from './custom-validators';
import { ValidationErrors } from '@angular/forms';

describe('CustomValidators', () => {
  describe('duplicateNameValidator', () => {
    let mockGetNamesFn: jasmine.Spy;

    beforeEach(() => {
      mockGetNamesFn = jasmine.createSpy('getNamesFn');
    });

    it('should return null for empty control value', (done) => {
      mockGetNamesFn.and.returnValue(['john doe', 'jane smith']);
      const validator = duplicateNameValidator(mockGetNamesFn);
      const control = new FormControl('');

      const result = validator(control) as Observable<ValidationErrors | null>;
      result.subscribe((validationResult: ValidationErrors | null) => {
        expect(validationResult).toBeNull();
        done();
      });
    });

    it('should return null for null control value', (done) => {
      mockGetNamesFn.and.returnValue(['john doe', 'jane smith']);
      const validator = duplicateNameValidator(mockGetNamesFn);
      const control = new FormControl(null);

      const result = validator(control) as Observable<ValidationErrors | null>;
      result.subscribe((validationResult: ValidationErrors | null) => {
        expect(validationResult).toBeNull();
        done();
      });
    });

    it('should return null for unique name', (done) => {
      mockGetNamesFn.and.returnValue(['john doe', 'jane smith']);
      const validator = duplicateNameValidator(mockGetNamesFn);
      const control = new FormControl('unique name');

      const result = validator(control) as Observable<ValidationErrors | null>;
      result.subscribe((validationResult: ValidationErrors | null) => {
        expect(validationResult).toBeNull();
        done();
      });
    });

    it('should return duplicateName error for existing name', (done) => {
      mockGetNamesFn.and.returnValue(['john doe', 'jane smith']);
      const validator = duplicateNameValidator(mockGetNamesFn);
      const control = new FormControl('John Doe');

      const result = validator(control) as Observable<ValidationErrors | null>;
      result.subscribe((validationResult: ValidationErrors | null) => {
        expect(validationResult).toEqual({ duplicateName: true });
        done();
      });
    });

    it('should be case insensitive', (done) => {
      mockGetNamesFn.and.returnValue(['john doe', 'jane smith']);
      const validator = duplicateNameValidator(mockGetNamesFn);
      const control = new FormControl('JOHN DOE');

      const result = validator(control) as Observable<ValidationErrors | null>;
      result.subscribe((validationResult: ValidationErrors | null) => {
        expect(validationResult).toEqual({ duplicateName: true });
        done();
      });
    });

    it('should trim whitespace before comparison', (done) => {
      mockGetNamesFn.and.returnValue(['john doe', 'jane smith']);
      const validator = duplicateNameValidator(mockGetNamesFn);
      const control = new FormControl('  John Doe  ');

      const result = validator(control) as Observable<ValidationErrors | null>;
      result.subscribe((validationResult: ValidationErrors | null) => {
        expect(validationResult).toEqual({ duplicateName: true });
        done();
      });
    });

    it('should handle empty names array', (done) => {
      mockGetNamesFn.and.returnValue([]);
      const validator = duplicateNameValidator(mockGetNamesFn);
      const control = new FormControl('any name');

      const result = validator(control) as Observable<ValidationErrors | null>;
      result.subscribe((validationResult: ValidationErrors | null) => {
        expect(validationResult).toBeNull();
        done();
      });
    });

    it('should exclude specified name from validation', (done) => {
      mockGetNamesFn.and.returnValue(['john doe', 'jane smith']);
      const validator = duplicateNameValidator(mockGetNamesFn, 'John Doe');
      const control = new FormControl('John Doe');

      const result = validator(control) as Observable<ValidationErrors | null>;
      result.subscribe((validationResult: ValidationErrors | null) => {
        expect(validationResult).toBeNull();
        done();
      });
    });

    it('should still validate against other names when excluding one', (done) => {
      mockGetNamesFn.and.returnValue(['john doe', 'jane smith']);
      const validator = duplicateNameValidator(mockGetNamesFn, 'John Doe');
      const control = new FormControl('Jane Smith');

      const result = validator(control) as Observable<ValidationErrors | null>;
      result.subscribe((validationResult: ValidationErrors | null) => {
        expect(validationResult).toEqual({ duplicateName: true });
        done();
      });
    });

    it('should handle special characters in names', (done) => {
      mockGetNamesFn.and.returnValue(['john-doe', 'jane.smith', "o'connor"]);
      const validator = duplicateNameValidator(mockGetNamesFn);
      const control = new FormControl("O'Connor");

      const result = validator(control) as Observable<ValidationErrors | null>;
      result.subscribe((validationResult: ValidationErrors | null) => {
        expect(validationResult).toEqual({ duplicateName: true });
        done();
      });
    });

    it('should handle getNamesFn returning undefined', (done) => {
      mockGetNamesFn.and.returnValue(undefined);
      const validator = duplicateNameValidator(mockGetNamesFn);
      const control = new FormControl('test');

      const result = validator(control) as Observable<ValidationErrors | null>;
      result.subscribe((validationResult: ValidationErrors | null) => {
        expect(validationResult).toBeNull();
        done();
      });
    });

    describe('Integration with FormControl', () => {
      it('should work with reactive forms for invalid input', (done) => {
        mockGetNamesFn.and.returnValue(['existing user']);
        const validator = duplicateNameValidator(mockGetNamesFn);
        const formControl = new FormControl('', {
          asyncValidators: [validator],
          updateOn: 'blur',
        });

        formControl.setValue('Existing User');
        formControl.markAsTouched();

        // Wait for async validation
        setTimeout(() => {
          expect(formControl.hasError('duplicateName')).toBe(true);
          expect(formControl.valid).toBe(false);
          done();
        }, 100);
      });

      it('should work with reactive forms for valid input', (done) => {
        mockGetNamesFn.and.returnValue(['existing user']);
        const validator = duplicateNameValidator(mockGetNamesFn);
        const formControl = new FormControl('', {
          asyncValidators: [validator],
          updateOn: 'blur',
        });

        formControl.setValue('New User');
        formControl.markAsTouched();

        // Wait for async validation
        setTimeout(() => {
          expect(formControl.hasError('duplicateName')).toBe(false);
          expect(formControl.valid).toBe(true);
          done();
        }, 100);
      });
    });

    describe('Edge Cases', () => {
      it('should handle empty string names in array', (done) => {
        mockGetNamesFn.and.returnValue(['', 'john doe']);
        const validator = duplicateNameValidator(mockGetNamesFn);
        const control = new FormControl('');

        const result = validator(
          control,
        ) as Observable<ValidationErrors | null>;
        result.subscribe((validationResult: ValidationErrors | null) => {
          expect(validationResult).toBeNull(); // Empty control value should return null
          done();
        });
      });

      it('should handle whitespace-only names', (done) => {
        mockGetNamesFn.and.returnValue(['', 'john doe']); // Empty string after trim
        const validator = duplicateNameValidator(mockGetNamesFn);
        const control = new FormControl('   '); // This trims to empty string

        const result = validator(
          control,
        ) as Observable<ValidationErrors | null>;
        result.subscribe((validationResult: ValidationErrors | null) => {
          expect(validationResult).toEqual({ duplicateName: true });
          done();
        });
      });

      it('should call getNamesFn every time validator is executed', (done) => {
        const validator = duplicateNameValidator(mockGetNamesFn);
        mockGetNamesFn.and.returnValue(['john doe']);

        const control = new FormControl('test');

        const result = validator(
          control,
        ) as Observable<ValidationErrors | null>;
        result.subscribe(() => {
          expect(mockGetNamesFn).toHaveBeenCalledTimes(1);
          done();
        });
      });
    });
  });
});
