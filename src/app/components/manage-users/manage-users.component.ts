import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.scss',
  standalone: false,
})
export class ManageUsersComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'role',
    'isActive',
    'createdAt',
    'updatedAt',
    'actions',
  ];
  dataSource = new MatTableDataSource<User>();
  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * Load all users from the service
   */
  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.dataSource.data = users;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.snackBar.open('Error loading users', 'Close', { duration: 3000 });
        this.loading = false;
      },
    });
  }

  /**
   * Apply filter to the table
   */
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Toggle user active status
   */
  toggleUserStatus(user: User): void {
    if (!user.id) return;

    this.userService.toggleUserStatus(user.id).subscribe({
      next: (updatedUser) => {
        if (updatedUser) {
          const index = this.dataSource.data.findIndex((u) => u.id === user.id);
          if (index !== -1) {
            const data = [...this.dataSource.data];
            data[index] = updatedUser;
            this.dataSource.data = data;
          }
          this.snackBar.open(
            `User ${
              updatedUser.isActive ? 'activated' : 'deactivated'
            } successfully`,
            'Close',
            { duration: 3000 },
          );
        }
      },
      error: (error) => {
        console.error('Error updating user status:', error);
        this.snackBar.open('Error updating user status', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  /**
   * Delete user
   */
  deleteUser(user: User): void {
    if (!user.id) return;

    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: (success) => {
          if (success) {
            this.dataSource.data = this.dataSource.data.filter(
              (u) => u.id !== user.id,
            );
            this.snackBar.open('User deleted successfully', 'Close', {
              duration: 3000,
            });
          }
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.snackBar.open('Error deleting user', 'Close', {
            duration: 3000,
          });
        },
      });
    }
  }

  /**
   * Edit user (placeholder for future implementation)
   */
  editUser(user: User): void {
    // TODO: Implement edit user dialog
    this.snackBar.open('Edit functionality coming soon!', 'Close', {
      duration: 3000,
    });
  }

  /**
   * Add new user (placeholder for future implementation)
   */
  addUser(): void {
    // TODO: Implement add user dialog
    this.snackBar.open('Add user functionality coming soon!', 'Close', {
      duration: 3000,
    });
  }

  /**
   * Get role badge color
   */
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
}
