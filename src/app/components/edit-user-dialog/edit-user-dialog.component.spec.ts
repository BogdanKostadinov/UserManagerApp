import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { EditUserDialogComponent } from './edit-user-dialog.component';
import { UserService } from '../../services/user.service';
import { User, UserRole } from '../../models/user.model';
import { MaterialModule } from '../../shared/modules/material/material-module';

describe('EditUserDialogComponent', () => {
  let component: EditUserDialogComponent;
  let fixture: ComponentFixture<EditUserDialogComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<EditUserDialogComponent>>;

  const mockUser: User = {
    id: '1',
    name: 'John Doe',
    role: UserRole.Admin,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUsers: User[] = [
    mockUser,
    {
      id: '2',
      name: 'Jane Smith',
      role: UserRole.User,
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      name: 'Bob Wilson',
      role: UserRole.Moderator,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUsers$']);
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [EditUserDialogComponent],
      imports: [ReactiveFormsModule, MaterialModule, NoopAnimationsModule],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { user: mockUser } },
      ],
    }).compileComponents();

    mockUserService = TestBed.inject(
      UserService,
    ) as jasmine.SpyObj<UserService>;
    mockDialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<
      MatDialogRef<EditUserDialogComponent>
    >;

    // Setup default mock behavior
    mockUserService.getUsers$.and.returnValue(of(mockUsers));

    fixture = TestBed.createComponent(EditUserDialogComponent);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize form with user data', () => {
      fixture.detectChanges();

      expect(component.userForm.get('name')?.value).toBe(mockUser.name);
      expect(component.userForm.get('role')?.value).toBe(mockUser.role);
      expect(component.userForm.get('isActive')?.value).toBe(mockUser.isActive);
    });

    it('should populate roles array with UserRole values', () => {
      fixture.detectChanges();

      expect(component.roles).toEqual(Object.values(UserRole));
    });

    it('should load existing user names excluding current user', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      expect(mockUserService.getUsers$).toHaveBeenCalled();
      // Should exclude current user (John Doe) from names list
      expect(component.allNames).toEqual(['jane smith', 'bob wilson']);
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

    it('should require role field', () => {
      const roleControl = component.userForm.get('role');

      roleControl?.setValue('');
      roleControl?.markAsTouched();

      expect(roleControl?.hasError('required')).toBeTruthy();
      expect(component.userForm.valid).toBeFalsy();
    });

    it('should validate duplicate names but allow current user name', fakeAsync(() => {
      const nameControl = component.userForm.get('name');

      // Wait for ngOnInit to complete
      tick();

      // Should allow keeping the same name
      nameControl?.setValue('John Doe');
      nameControl?.markAsTouched();
      tick();

      expect(nameControl?.hasError('duplicateName')).toBeFalsy();
    }));

    it('should validate duplicate names for other users', fakeAsync(() => {
      const nameControl = component.userForm.get('name');

      // Wait for ngOnInit to complete
      tick();

      nameControl?.setValue('Jane Smith');
      nameControl?.markAsTouched();
      tick();

      expect(nameControl?.hasError('duplicateName')).toBeTruthy();
    }));

    it('should allow unique names', fakeAsync(() => {
      const nameControl = component.userForm.get('name');

      // Wait for ngOnInit to complete
      tick();

      nameControl?.setValue('New Unique Name');
      nameControl?.markAsTouched();
      tick();

      expect(nameControl?.hasError('duplicateName')).toBeFalsy();
    }));

    it('should be case insensitive for duplicate validation', fakeAsync(() => {
      const nameControl = component.userForm.get('name');

      // Wait for ngOnInit to complete
      tick();

      nameControl?.setValue('JANE SMITH');
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
      nameControl?.setValue('Jane Smith');
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

    it('should handle form control not found', () => {
      const errorMessage = component.getErrorMessage('nonexistent');
      expect(errorMessage).toBe('');
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
      // Make form invalid
      component.userForm.get('name')?.setValue('');

      component.onSubmit();

      expect(mockDialogRef.close).not.toHaveBeenCalled();
    });

    it('should submit valid form with updated user data', fakeAsync(() => {
      // Wait for ngOnInit to complete
      tick();

      // Update form with valid data
      component.userForm.patchValue({
        name: 'Updated Name',
        role: UserRole.Moderator,
        isActive: false,
      });

      // Mark form as valid
      component.userForm.get('name')?.setErrors(null);
      component.userForm.get('role')?.setErrors(null);

      component.onSubmit();

      const expectedUserData = {
        name: 'Updated Name',
        role: UserRole.Moderator,
        isActive: false,
      };

      expect(mockDialogRef.close).toHaveBeenCalledWith(expectedUserData);
    }));

    it('should submit with correct data structure', fakeAsync(() => {
      tick();

      component.userForm.patchValue({
        name: 'Test User',
        role: UserRole.User,
        isActive: true,
      });

      component.userForm.get('name')?.setErrors(null);
      component.userForm.get('role')?.setErrors(null);

      component.onSubmit();

      const submittedData = mockDialogRef.close.calls.mostRecent().args[0];

      expect(submittedData).toEqual({
        name: 'Test User',
        role: UserRole.User,
        isActive: true,
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

    it('should handle complete user edit workflow', fakeAsync(() => {
      // Wait for initialization
      tick();

      // Verify initial state with user data
      expect(component.userForm.get('name')?.value).toBe('John Doe');
      expect(component.userForm.get('role')?.value).toBe(UserRole.Admin);
      expect(component.userForm.get('isActive')?.value).toBe(true);

      // Update form with new data
      const nameControl = component.userForm.get('name');
      const roleControl = component.userForm.get('role');
      const isActiveControl = component.userForm.get('isActive');

      nameControl?.setValue('Updated User Name');
      roleControl?.setValue(UserRole.User);
      isActiveControl?.setValue(false);

      // Trigger validation
      nameControl?.markAsTouched();
      roleControl?.markAsTouched();
      tick();

      // Verify form is valid
      expect(component.userForm.valid).toBeTruthy();
      expect(nameControl?.hasError('duplicateName')).toBeFalsy();

      // Submit form
      component.onSubmit();

      // Verify dialog closes with correct data
      expect(mockDialogRef.close).toHaveBeenCalledWith({
        name: 'Updated User Name',
        role: UserRole.User,
        isActive: false,
      });
    }));

    it('should prevent submission with duplicate name from other user', fakeAsync(() => {
      tick();

      const nameControl = component.userForm.get('name');
      const roleControl = component.userForm.get('role');

      nameControl?.setValue('Jane Smith'); // Duplicate name
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

  describe('Edge Cases', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should handle empty user list from service', fakeAsync(() => {
      mockUserService.getUsers$.and.returnValue(of([]));

      // Re-initialize component
      component.ngOnInit();
      tick();

      expect(component.allNames).toEqual([]);
    }));

    it('should handle user data changes', () => {
      const newUser: User = {
        id: '999',
        name: 'Test User',
        role: UserRole.Moderator,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Simulate changing the dialog data
      component.data.user = newUser;

      // Re-initialize form
      component.userForm.patchValue({
        name: newUser.name,
        role: newUser.role,
        isActive: newUser.isActive,
      });

      expect(component.userForm.get('name')?.value).toBe(newUser.name);
      expect(component.userForm.get('role')?.value).toBe(newUser.role);
      expect(component.userForm.get('isActive')?.value).toBe(newUser.isActive);
    });
  });
});
