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
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { ManageUsersComponent } from './manage-users.component';
import { UserService } from '../../services/user.service';
import { of } from 'rxjs';

describe('ManageUsersComponent', () => {
  let component: ManageUsersComponent;
  let fixture: ComponentFixture<ManageUsersComponent>;
  let userService: jasmine.SpyObj<UserService>;

  const mockUsers = [
    {
      id: '1',
      name: 'John Doe',
      role: 'Admin',
      isActive: true,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      name: 'Jane Smith',
      role: 'User',
      isActive: false,
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-02-10'),
    },
  ];

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', [
      'getUsers',
      'toggleUserStatus',
      'deleteUser',
    ]);

    await TestBed.configureTestingModule({
      declarations: [ManageUsersComponent],
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
      ],
      providers: [{ provide: UserService, useValue: userServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageUsersComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;

    userService.getUsers.and.returnValue(of(mockUsers));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    fixture.detectChanges();
    expect(userService.getUsers).toHaveBeenCalled();
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
    const updatedUser = { ...mockUsers[0], isActive: false };
    userService.toggleUserStatus.and.returnValue(of(updatedUser));

    fixture.detectChanges();
    component.toggleUserStatus(mockUsers[0]);

    expect(userService.toggleUserStatus).toHaveBeenCalledWith('1');
  });

  it('should delete user', () => {
    userService.deleteUser.and.returnValue(of(true));
    spyOn(window, 'confirm').and.returnValue(true);

    fixture.detectChanges();
    component.deleteUser(mockUsers[0]);

    expect(userService.deleteUser).toHaveBeenCalledWith('1');
  });

  it('should get correct role badge color', () => {
    expect(component.getRoleBadgeColor('Admin')).toBe('warn');
    expect(component.getRoleBadgeColor('Moderator')).toBe('accent');
    expect(component.getRoleBadgeColor('User')).toBe('primary');
  });
});
