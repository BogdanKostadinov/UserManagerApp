import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource } from '@angular/material/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { UsersTableComponent } from './users-table.component';
import { User, UserRole } from '../../models/user.model';

describe('UsersTableComponent', () => {
  let component: UsersTableComponent;
  let fixture: ComponentFixture<UsersTableComponent>;

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsersTableComponent],
      imports: [
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        NoopAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersTableComponent);
    component = fixture.componentInstance;

    // Setup dataSource
    component.dataSource = new MatTableDataSource(mockUsers);
    component.displayedColumns = ['name', 'role', 'isActive', 'actions'];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with provided dataSource', () => {
    expect(component.dataSource).toBeDefined();
    expect(component.dataSource.data).toEqual(mockUsers);
  });

  it('should initialize with provided displayedColumns', () => {
    expect(component.displayedColumns).toEqual([
      'name',
      'role',
      'isActive',
      'actions',
    ]);
  });

  it('should emit editUser event when onEditUser is called', () => {
    spyOn(component.editUser, 'emit');

    component.onEditUser(mockUsers[0]);

    expect(component.editUser.emit).toHaveBeenCalledWith(mockUsers[0]);
  });

  it('should emit deleteUser event when onDeleteUser is called', () => {
    spyOn(component.deleteUser, 'emit');

    component.onDeleteUser(mockUsers[0]);

    expect(component.deleteUser.emit).toHaveBeenCalledWith(mockUsers[0]);
  });

  it('should emit toggleUserStatus event when onToggleUserStatus is called', () => {
    spyOn(component.toggleUserStatus, 'emit');

    component.onToggleUserStatus(mockUsers[0]);

    expect(component.toggleUserStatus.emit).toHaveBeenCalledWith(mockUsers[0]);
  });

  it('should emit addUser event when onAddUser is called', () => {
    spyOn(component.addUser, 'emit');

    component.onAddUser();

    expect(component.addUser.emit).toHaveBeenCalled();
  });

  it('should return correct role icon for admin', () => {
    expect(component.getRoleIcon('admin')).toBe('admin_panel_settings');
    expect(component.getRoleIcon('Admin')).toBe('admin_panel_settings');
  });

  it('should return correct role icon for moderator', () => {
    expect(component.getRoleIcon('moderator')).toBe('verified_user');
    expect(component.getRoleIcon('Moderator')).toBe('verified_user');
  });

  it('should return correct role icon for editor', () => {
    expect(component.getRoleIcon('editor')).toBe('edit');
    expect(component.getRoleIcon('Editor')).toBe('edit');
  });

  it('should return correct role icon for viewer', () => {
    expect(component.getRoleIcon('viewer')).toBe('visibility');
    expect(component.getRoleIcon('Viewer')).toBe('visibility');
  });

  it('should return default role icon for unknown roles', () => {
    expect(component.getRoleIcon('user')).toBe('person');
    expect(component.getRoleIcon('unknown')).toBe('person');
    expect(component.getRoleIcon('')).toBe('person');
  });

  it('should setup paginator and sort after view init', () => {
    component.ngAfterViewInit();

    expect(component.dataSource.paginator).toBeDefined();
    expect(component.dataSource.sort).toBeDefined();
  });

  it('should handle dataSource being undefined in ngAfterViewInit', () => {
    component.dataSource = undefined as any;

    expect(() => {
      component.ngAfterViewInit();
    }).not.toThrow();
  });

  it('should have all required event emitters defined', () => {
    expect(component.editUser).toBeDefined();
    expect(component.deleteUser).toBeDefined();
    expect(component.toggleUserStatus).toBeDefined();
    expect(component.addUser).toBeDefined();
  });
});
