import { Component, Input, Output, EventEmitter, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.scss',
  standalone: false,
})
export class UsersTableComponent implements OnInit, AfterViewInit {
  @Input() dataSource!: MatTableDataSource<User>;
  @Input() loading = false;
  @Input() displayedColumns: string[] = [];

  @Output() editUser = new EventEmitter<User>();
  @Output() deleteUser = new EventEmitter<User>();
  @Output() toggleUserStatus = new EventEmitter<User>();
  @Output() addUser = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();
  @Output() export = new EventEmitter<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    // Initialize component
  }

  ngAfterViewInit(): void {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  onEditUser(user: User): void {
    this.editUser.emit(user);
  }

  onDeleteUser(user: User): void {
    this.deleteUser.emit(user);
  }

  onToggleUserStatus(user: User): void {
    this.toggleUserStatus.emit(user);
  }

  onAddUser(): void {
    this.addUser.emit();
  }

  onRefresh(): void {
    this.refresh.emit();
  }

  onExport(): void {
    this.export.emit();
  }

  /**
   * Get role icon based on role
   */
  getRoleIcon(role: string): string {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'admin_panel_settings';
      case 'moderator':
        return 'verified_user';
      case 'editor':
        return 'edit';
      case 'viewer':
        return 'visibility';
      default:
        return 'person';
    }
  }
}
