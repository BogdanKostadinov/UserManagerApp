import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ManageUsersComponent } from './manage-users.component';
import { UserService } from '../../services/user.service';
import { User, UserRole } from '../../models/user.model';
import { of, throwError } from 'rxjs';

// Mock child components
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-user-stats',
  template: '<div></div>',
  standalone: false,
})
class MockUserStatsComponent {
  @Input() totalUsers: number = 0;
  @Input() activeUsers: number = 0;
  @Input() inactiveUsers: number = 0;
}

@Component({
  selector: 'app-user-filter',
  template: '<div></div>',
  standalone: false,
})
class MockUserFilterComponent {
  @Output() searchChanged = new EventEmitter<Event>();
}

@Component({
  selector: 'app-users-table',
  template: '<div></div>',
  standalone: false,
})
class MockUsersTableComponent {
  @Input() dataSource!: MatTableDataSource<User>;
  @Input() displayedColumns: string[] = [];
  @Output() editUser = new EventEmitter<User>();
  @Output() deleteUser = new EventEmitter<User>();
  @Output() toggleUserStatus = new EventEmitter<User>();
  @Output() addUser = new EventEmitter<void>();
}

describe('ManageUsersComponent', () => {
  let component: ManageUsersComponent;
  let fixture: ComponentFixture<ManageUsersComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let dialog: jasmine.SpyObj<any>;

  const mockUsers: User[] = [
    {
      id: '1',
      name: 'John Doe',
      role: UserRole.Admin,
      isActive: true,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      name: 'Jane Smith',
      role: UserRole.User,
      isActive: false,
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-02-10'),
    },
  ];

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', [
      'getUsers$',
      'toggleUserStatus$',
      'deleteUser$',
    ]);

    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [
        ManageUsersComponent,
        MockUserStatsComponent,
        MockUserFilterComponent,
        MockUsersTableComponent,
      ],
      imports: [
        NoopAnimationsModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatChipsModule,
        MatSnackBarModule,
        MatDialogModule,
        MatTooltipModule,
        MatProgressBarModule,
        MatToolbarModule,
      ],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageUsersComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<any>;

    userService.getUsers$.and.returnValue(of(mockUsers));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    fixture.detectChanges();
    expect(userService.getUsers$).toHaveBeenCalled();
    expect(component.dataSource.data).toEqual(mockUsers);
  });

  it('should apply filter correctly', () => {
    fixture.detectChanges();

    const mockEvent = {
      target: { value: 'John' },
    } as any;

    component.applyFilter(mockEvent);
    expect(component.dataSource.filter).toBe('john');
  });

  it('should toggle user status', () => {
    userService.toggleUserStatus$.and.returnValue(of(undefined));

    fixture.detectChanges();
    component.toggleUserStatus(mockUsers[0]);

    expect(userService.toggleUserStatus$).toHaveBeenCalledWith(
      '1',
      mockUsers[0].isActive,
    );
  });

  it('should delete user', () => {
    userService.deleteUser$.and.returnValue(of(undefined));

    // Mock dialog to return confirmed = true
    const mockDialogRef = {
      afterClosed: () => of(true),
    };
    dialog.open.and.returnValue(mockDialogRef);

    fixture.detectChanges();
    component.deleteUser(mockUsers[0]);

    expect(dialog.open).toHaveBeenCalled();
    expect(userService.deleteUser$).toHaveBeenCalledWith('1');
  });

  it('should get correct role badge color', () => {
    expect(component.getRoleBadgeColor(UserRole.Admin)).toBe('warn');
    expect(component.getRoleBadgeColor(UserRole.Moderator)).toBe('accent');
    expect(component.getRoleBadgeColor(UserRole.User)).toBe('primary');
  });

  it('should not delete user when confirm is cancelled', () => {
    // Mock dialog to return confirmed = false
    const mockDialogRef = {
      afterClosed: () => of(false),
    };
    dialog.open.and.returnValue(mockDialogRef);

    fixture.detectChanges();
    component.deleteUser(mockUsers[0]);

    expect(dialog.open).toHaveBeenCalled();
    expect(userService.deleteUser$).not.toHaveBeenCalled();
  });

  it('should handle empty user list', () => {
    userService.getUsers$.and.returnValue(of([]));

    fixture.detectChanges();

    expect(component.dataSource.data).toEqual([]);
  });

  it('should handle service errors gracefully', () => {
    userService.getUsers$.and.returnValue(
      throwError(() => new Error('Service error')),
    );

    expect(() => {
      fixture.detectChanges();
    }).not.toThrow();
  });

  it('should filter case-insensitively', () => {
    fixture.detectChanges();

    const mockEvent = {
      target: { value: 'JOHN' },
    } as any;

    component.applyFilter(mockEvent);
    expect(component.dataSource.filter).toBe('john');
  });

  it('should handle empty filter input', () => {
    fixture.detectChanges();

    const mockEvent = {
      target: { value: '' },
    } as any;

    component.applyFilter(mockEvent);
    expect(component.dataSource.filter).toBe('');
  });

  it('should update stats correctly', () => {
    fixture.detectChanges();

    expect(component.totalUsers).toBe(2);
    expect(component.activeUsers).toBe(1);
    expect(component.inactiveUsers).toBe(1);
  });

  it('should handle role badge color with lowercase', () => {
    expect(component.getRoleBadgeColor('admin')).toBe('warn');
    expect(component.getRoleBadgeColor('moderator')).toBe('accent');
    expect(component.getRoleBadgeColor('user')).toBe('primary');
  });
});
