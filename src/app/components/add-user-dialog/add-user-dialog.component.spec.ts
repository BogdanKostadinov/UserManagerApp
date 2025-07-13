import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { AddUserDialogComponent } from './add-user-dialog.component';
import { UserService } from '../../services/user.service';
import { User, UserRole } from '../../models/user.model';
import { MaterialModule } from '../../shared/modules/material/material-module';

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    role: UserRole.Admin,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Jane Smith',
    role: UserRole.User,
    isActive: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe('AddUserDialogComponent', () => {
  let component: AddUserDialogComponent;
  let fixture: ComponentFixture<AddUserDialogComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<AddUserDialogComponent>>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUsers$']);
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [AddUserDialogComponent],
      imports: [ReactiveFormsModule, MaterialModule, NoopAnimationsModule],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();

    mockUserService = TestBed.inject(
      UserService,
    ) as jasmine.SpyObj<UserService>;
    mockDialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<
      MatDialogRef<AddUserDialogComponent>
    >;
    mockUserService.getUsers$.and.returnValue(of(mockUsers));

    fixture = TestBed.createComponent(AddUserDialogComponent);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize form with correct default values', () => {
      fixture.detectChanges();

      expect(component.userForm).toBeDefined();
      expect(component.userForm.get('name')?.value).toBe('');
      expect(component.userForm.get('role')?.value).toBe('');
      expect(component.userForm.get('isActive')?.value).toBe(true);
    });

    it('should populate roles array with UserRole values', () => {
      fixture.detectChanges();

      expect(component.roles).toEqual(Object.values(UserRole));
      expect(component.roles).toContain(UserRole.Admin);
      expect(component.roles).toContain(UserRole.Moderator);
      expect(component.roles).toContain(UserRole.User);
    });

    it('should load existing user names on init', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      expect(mockUserService.getUsers$).toHaveBeenCalled();
      expect(component.allNames).toEqual(['john doe', 'jane smith']);
    }));
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should require name field', () => {
      const nameControl = component.userForm.get('name');

      nameControl?.setValue('');
      nameControl?.markAsTouched();

      expect(nameControl?.hasError('required')).toBeTruthy();
      expect(component.userForm.valid).toBeFalsy();
    });

    it('should require minimum length for name', () => {
      const nameControl = component.userForm.get('name');

      nameControl?.setValue('A');
      nameControl?.markAsTouched();

      expect(nameControl?.hasError('minlength')).toBeTruthy();
      expect(component.userForm.valid).toBeFalsy();
    });

    it('should accept valid name with minimum length', () => {
      const nameControl = component.userForm.get('name');

      nameControl?.setValue('AB');
      nameControl?.markAsTouched();

      expect(nameControl?.hasError('minlength')).toBeFalsy();
      expect(nameControl?.hasError('required')).toBeFalsy();
    });

    it('should require role field', () => {
      const roleControl = component.userForm.get('role');

      roleControl?.setValue('');
      roleControl?.markAsTouched();

      expect(roleControl?.hasError('required')).toBeTruthy();
      expect(component.userForm.valid).toBeFalsy();
    });

    it('should validate duplicate names', fakeAsync(() => {
      const nameControl = component.userForm.get('name');

      // Wait for ngOnInit to complete
      tick();

      nameControl?.setValue('John Doe');
      nameControl?.markAsTouched();
      tick();

      expect(nameControl?.hasError('duplicateName')).toBeTruthy();
    }));

    it('should allow non-duplicate names', fakeAsync(() => {
      const nameControl = component.userForm.get('name');

      // Wait for ngOnInit to complete
      tick();

      nameControl?.setValue('New User');
      nameControl?.markAsTouched();
      tick();

      expect(nameControl?.hasError('duplicateName')).toBeFalsy();
    }));

    it('should be case insensitive for duplicate validation', fakeAsync(() => {
      const nameControl = component.userForm.get('name');

      // Wait for ngOnInit to complete
      tick();

      nameControl?.setValue('JOHN DOE');
      nameControl?.markAsTouched();
      tick();

      expect(nameControl?.hasError('duplicateName')).toBeTruthy();
    }));
  });

  describe('Error Messages', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should return required error message for name', () => {
      const nameControl = component.userForm.get('name');
      nameControl?.setValue('');
      nameControl?.setErrors({ required: true });

      const errorMessage = component.getErrorMessage('name');
      expect(errorMessage).toBe('Name is required');
    });

    it('should return minlength error message for name', () => {
      const nameControl = component.userForm.get('name');
      nameControl?.setValue('A');
      nameControl?.setErrors({ minlength: true });

      const errorMessage = component.getErrorMessage('name');
      expect(errorMessage).toBe('Name must be at least 2 characters');
    });

    it('should return duplicate name error message', () => {
      const nameControl = component.userForm.get('name');
      nameControl?.setValue('John Doe');
      nameControl?.setErrors({ duplicateName: true });

      const errorMessage = component.getErrorMessage('name');
      expect(errorMessage).toBe('This name already exists.');
    });

    it('should return required error message for role', () => {
      const roleControl = component.userForm.get('role');
      roleControl?.setValue('');
      roleControl?.setErrors({ required: true });

      const errorMessage = component.getErrorMessage('role');
      expect(errorMessage).toBe('Role is required');
    });

    it('should return empty string when no errors', () => {
      const nameControl = component.userForm.get('name');
      nameControl?.setValue('Valid Name');
      nameControl?.setErrors(null);

      const errorMessage = component.getErrorMessage('name');
      expect(errorMessage).toBe('');
    });

    it('should capitalize field name in error messages', () => {
      const nameControl = component.userForm.get('name');
      nameControl?.setValue('');
      nameControl?.setErrors({ required: true });

      const errorMessage = component.getErrorMessage('name');
      expect(errorMessage).toContain('Name');

      const roleControl = component.userForm.get('role');
      roleControl?.setValue('');
      roleControl?.setErrors({ required: true });

      const roleErrorMessage = component.getErrorMessage('role');
      expect(roleErrorMessage).toContain('Role');
    });
  });

  describe('Dialog Actions', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should close dialog on cancel', () => {
      component.onCancel();

      expect(mockDialogRef.close).toHaveBeenCalledWith();
    });

    it('should not submit invalid form', () => {
      // Form is invalid by default (required fields empty)
      component.onSubmit();

      expect(mockDialogRef.close).not.toHaveBeenCalled();
    });

    it('should submit valid form with user data', fakeAsync(() => {
      // Wait for ngOnInit to complete
      tick();

      // Fill form with valid data
      component.userForm.patchValue({
        name: 'New User',
        role: UserRole.User,
        isActive: true,
      });

      // Mark form as valid
      component.userForm.get('name')?.setErrors(null);
      component.userForm.get('role')?.setErrors(null);

      component.onSubmit();

      const expectedUserData = {
        name: 'New User',
        role: UserRole.User,
        isActive: true,
      };

      expect(mockDialogRef.close).toHaveBeenCalledWith(expectedUserData);
    }));

    it('should submit with correct user data structure', fakeAsync(() => {
      tick();

      component.userForm.patchValue({
        name: 'Test Admin',
        role: UserRole.Admin,
        isActive: false,
      });

      component.userForm.get('name')?.setErrors(null);
      component.userForm.get('role')?.setErrors(null);

      component.onSubmit();

      const submittedData = mockDialogRef.close.calls.mostRecent().args[0];

      expect(submittedData).toEqual({
        name: 'Test Admin',
        role: UserRole.Admin,
        isActive: false,
      });

      // Ensure it doesn't include id, createdAt, updatedAt
      expect(submittedData.id).toBeUndefined();
      expect(submittedData.createdAt).toBeUndefined();
      expect(submittedData.updatedAt).toBeUndefined();
    }));
  });

  describe('Integration Tests', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should handle complete user creation workflow', fakeAsync(() => {
      tick();

      expect(component.userForm.valid).toBeFalsy();
      expect(component.allNames).toEqual(['john doe', 'jane smith']);

      // Fill form with valid, non-duplicate data
      const nameControl = component.userForm.get('name');
      const roleControl = component.userForm.get('role');
      const isActiveControl = component.userForm.get('isActive');

      nameControl?.setValue('Unique User');
      roleControl?.setValue(UserRole.Moderator);
      isActiveControl?.setValue(true);

      // Trigger validation
      nameControl?.markAsTouched();
      roleControl?.markAsTouched();
      tick();

      // Verify form is valid
      expect(component.userForm.valid).toBeTruthy();
      expect(nameControl?.hasError('duplicateName')).toBeFalsy();
      
      component.onSubmit();

      // Verify dialog closes with correct data
      expect(mockDialogRef.close).toHaveBeenCalledWith({
        name: 'Unique User',
        role: UserRole.Moderator,
        isActive: true,
      });
    }));

    it('should prevent submission with duplicate name', fakeAsync(() => {
      tick();

      const nameControl = component.userForm.get('name');
      const roleControl = component.userForm.get('role');

      nameControl?.setValue('John Doe'); // Duplicate name
      roleControl?.setValue(UserRole.User);

      nameControl?.markAsTouched();
      roleControl?.markAsTouched();
      tick();

      // Form should be invalid due to duplicate name
      expect(component.userForm.valid).toBeFalsy();
      expect(nameControl?.hasError('duplicateName')).toBeTruthy();

      // Submit should not close dialog
      component.onSubmit();
      expect(mockDialogRef.close).not.toHaveBeenCalled();
    }));
  });
});
