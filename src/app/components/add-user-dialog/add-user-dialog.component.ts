import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User, UserRole } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { duplicateNameValidator } from '../../shared/validators/custom-validators';
import { take } from 'rxjs';

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrl: './add-user-dialog.component.scss',
  standalone: false,
})
export class AddUserDialogComponent implements OnInit {
  userForm: FormGroup;
  roles = Object.values(UserRole);
  allNames: string[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddUserDialogComponent>,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.userForm = this.fb.group({
      name: [
        '',
        {
          validators: [Validators.required, Validators.minLength(2)],
          asyncValidators: [duplicateNameValidator(() => this.allNames)],
          updateOn: 'blur',
        },
      ],
      role: ['', Validators.required],
      isActive: [true],
    });
  }

  ngOnInit(): void {
    this.userService
      .getUsers$()
      .pipe(take(1))
      .subscribe((users) => {
        this.allNames = users.map((u) => u.name.toLowerCase());
      });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = {
        name: this.userForm.value.name,
        role: this.userForm.value.role,
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
