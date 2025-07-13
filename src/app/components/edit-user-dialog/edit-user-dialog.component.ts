import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrl: './edit-user-dialog.component.scss',
  standalone: false,
})
export class EditUserDialogComponent {
  userForm: FormGroup;
  roles = ['Admin', 'Moderator', 'User'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User }
  ) {
    this.userForm = this.fb.group({
      name: [data.user.name, [Validators.required, Validators.minLength(2)]],
      role: [data.user.role, Validators.required],
      isActive: [data.user.isActive]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const userData: Partial<User> = {
        name: this.userForm.value.name,
        role: this.userForm.value.role,
        isActive: this.userForm.value.isActive
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
    return '';
  }
}
