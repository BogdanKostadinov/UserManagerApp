import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { AddUserDialogComponent } from '../add-user-dialog/add-user-dialog.component';
import { EditUserDialogComponent } from '../edit-user-dialog/edit-user-dialog.component';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.scss',
  standalone: false,
})
export class ManageUsersComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'name',
    'role',
    'isActive',
    'createdAt',
    'updatedAt',
    'actions',
  ];
  dataSource = new MatTableDataSource<User>();

  // Stats properties
  totalUsers = 0;
  activeUsers = 0;
  inactiveUsers = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUsers(): void {
    this.userService
      .getUsers$()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users) => {
          this.dataSource.data = users;
          this.updateStats(users);
        },
        error: (error) => {
          console.error('Error loading users:', error);
          this.snackBar.open('Error loading users', 'Close', {
            duration: 3000,
          });
        },
      });
  }

  /**
   * Apply filter to the table
   */
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  toggleUserStatus(user: User): void {
    if (!user.id) return;

    this.userService.toggleUserStatus$(user.id, user.isActive).subscribe({
      next: () => {
        // Reload users to get updated data
        this.loadUsers();
        this.snackBar.open(`User status updated successfully`, 'Close', {
          duration: 3000,
        });
      },
      error: (error) => {
        console.error('Error updating user status:', error);
        this.snackBar.open('Error updating user status', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  deleteUser(user: User): void {
    if (!user.id) return;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      height: 'auto',
      data: {
        title: 'Delete User',
        description: `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.userService
          .deleteUser$(user.id!)
          .pipe(take(1))
          .subscribe({
            next: () => {
              // Reload users to get updated data
              this.loadUsers();
              this.snackBar.open('User deleted successfully', 'Close', {
                duration: 3000,
              });
            },
            error: (error) => {
              console.error('Error deleting user:', error);
              this.snackBar.open('Error deleting user', 'Close', {
                duration: 3000,
              });
            },
          });
      }
    });
  }

  editUser(user: User): void {
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      width: '500px',
      disableClose: true,
      data: { user: user },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && user.id) {
        this.userService.updateUser$(user.id, result).subscribe({
          next: () => {
            // Reload users to get updated data
            this.loadUsers();
            this.snackBar.open('User updated successfully!', 'Close', {
              duration: 3000,
            });
          },
          error: (error) => {
            console.error('Error updating user:', error);
            this.snackBar.open('Error updating user', 'Close', {
              duration: 3000,
            });
          },
        });
      }
    });
  }

  addUser(): void {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '500px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.addUser$(result).subscribe({
          next: (newUser) => {
            // Reload users to include the new user
            this.loadUsers();
            this.snackBar.open('User added successfully!', 'Close', {
              duration: 3000,
            });
          },
          error: (error) => {
            console.error('Error adding user:', error);
            this.snackBar.open('Error adding user', 'Close', {
              duration: 3000,
            });
          },
        });
      }
    });
  }

  getRoleBadgeColor(role: string): string {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'warn';
      case 'moderator':
        return 'accent';
      default:
        return 'primary';
    }
  }

  /**
   * Update statistics based on users data
   */
  private updateStats(users: User[]): void {
    this.totalUsers = users.length;
    this.activeUsers = users.filter((user) => user.isActive).length;
    this.inactiveUsers = users.filter((user) => !user.isActive).length;
  }
}
