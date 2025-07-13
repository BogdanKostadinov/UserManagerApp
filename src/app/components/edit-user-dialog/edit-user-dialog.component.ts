import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AsyncValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User, UserRole } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { duplicateNameValidator } from '../../shared/validators/custom-validators';

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrl: './edit-user-dialog.component.scss',
  standalone: false,
})
export class EditUserDialogComponent implements OnInit {
  userForm: FormGroup;
  roles = Object.values(UserRole);
  allNames: string[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditUserDialogComponent>,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: { user: User },
  ) {
    this.userForm = this.fb.group({
      name: [
        data.user.name,
        {
          validators: [Validators.required, Validators.minLength(2)],
          asyncValidators: [duplicateNameValidator(() => this.allNames)],
          updateOn: 'blur',
        },
      ],
      role: [data.user.role, Validators.required],
      isActive: [data.user.isActive],
    });
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe((users) => {
      this.allNames = users
        .filter((u) => u.id !== this.data.user.id)
        .map((u) => u.name.toLowerCase());
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const userData: Partial<User> = {
        name: this.userForm.value.name,
        role: this.userForm.value.role as UserRole,
        isActive: this.userForm.value.isActive,
      };
      this.dialogRef.close(userData);
    }
  }

  getErrorMessage(field: string): string {
    const control = this.userForm.get(field);
    if (control?.hasError('required')) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
    if (control?.hasError('minlength')) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least 2 characters`;
    }
    if (control?.hasError('duplicateName')) {
      return 'This name already exists.';
    }
    return '';
  }
}
