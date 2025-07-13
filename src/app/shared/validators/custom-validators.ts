import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Observable, of } from 'rxjs';

/**
 * Async validator to check for duplicate names in a list.
 * @param getNamesFn Function that returns the list of names (lowercase) to check against.
 * @param excludeName Optionally exclude a name (e.g., the current user's name when editing)
 */
export function duplicateNameValidator(
  getNamesFn: () => string[],
  excludeName?: string,
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) return of(null);
    const value = control.value.trim().toLowerCase();
    const names = getNamesFn();
    if (excludeName && value === excludeName.trim().toLowerCase()) {
      return of(null);
    }
    const exists = names.includes(value);
    return of(exists ? { duplicateName: true } : null);
  };
}
