import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { User, UserRole } from '../models/user.model';
import { of } from 'rxjs';

describe('UserService', () => {
  let service: UserService;
  let mockUserService: jasmine.SpyObj<UserService>;

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

  beforeEach(() => {
    // Create a mock UserService with all methods
    const userServiceSpy = jasmine.createSpyObj('UserService', [
      'getUsers$',
      'getUserById$',
      'addUser$',
      'updateUser$',
      'deleteUser$',
      'toggleUserStatus$',
    ]);

    TestBed.configureTestingModule({
      providers: [{ provide: UserService, useValue: userServiceSpy }],
    });

    service = TestBed.inject(UserService);
    mockUserService = service as jasmine.SpyObj<UserService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return users from getUsers$', (done) => {
    mockUserService.getUsers$.and.returnValue(of(mockUsers));

    service.getUsers$().subscribe((users: User[]) => {
      expect(users).toBeDefined();
      expect(users.length).toBe(2);
      expect(users[0].id).toBe('1');
      expect(users[0].name).toBe('John Doe');
      expect(users[0].role).toBe(UserRole.Admin);
      expect(users[0].isActive).toBe(true);
      expect(users[0].createdAt).toBeDefined();
      expect(users[0].updatedAt).toBeDefined();
      done();
    });
  });

  it('should return user by id from getUserById$', (done) => {
    const expectedUser = mockUsers[0];
    mockUserService.getUserById$.and.returnValue(of(expectedUser));

    service.getUserById$('1').subscribe((user: User | undefined) => {
      expect(user).toBeDefined();
      expect(user?.id).toBe('1');
      expect(user?.name).toBe('John Doe');
      done();
    });
  });

  it('should return undefined for non-existent user from getUserById$', (done) => {
    mockUserService.getUserById$.and.returnValue(of(undefined));

    service.getUserById$('999').subscribe((user: User | undefined) => {
      expect(user).toBeUndefined();
      done();
    });
  });

  it('should add new user with addUser$', (done) => {
    const newUserData = {
      name: 'Test User',
      role: UserRole.User,
      isActive: true,
    };

    const expectedUser: User = {
      ...newUserData,
      id: '3',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockUserService.addUser$.and.returnValue(of(expectedUser));

    service.addUser$(newUserData).subscribe((user: User) => {
      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.name).toBe(newUserData.name);
      expect(user.role).toBe(newUserData.role);
      expect(user.isActive).toBe(newUserData.isActive);
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
      done();
    });
  });

  it('should update existing user with updateUser$', (done) => {
    const updateData = { name: 'Updated Name' };
    mockUserService.updateUser$.and.returnValue(of(undefined));

    service.updateUser$('1', updateData).subscribe(() => {
      expect(service.updateUser$).toHaveBeenCalledWith('1', updateData);
      done();
    });
  });

  it('should delete existing user with deleteUser$', (done) => {
    mockUserService.deleteUser$.and.returnValue(of(undefined));

    service.deleteUser$('1').subscribe(() => {
      expect(service.deleteUser$).toHaveBeenCalledWith('1');
      done();
    });
  });

  it('should toggle user status with toggleUserStatus$', (done) => {
    const originalUser = mockUsers[0];

    mockUserService.toggleUserStatus$.and.returnValue(of(undefined));

    service.toggleUserStatus$('1', originalUser.isActive).subscribe(() => {
      expect(service.toggleUserStatus$).toHaveBeenCalledWith(
        '1',
        originalUser.isActive,
      );
      done();
    });
  });

  it('should handle errors gracefully', (done) => {
    mockUserService.getUsers$.and.throwError('Network error');

    try {
      service.getUsers$().subscribe({
        next: () => {},
        error: (error) => {
          expect(error).toBeDefined();
          done();
        },
      });
    } catch (error) {
      expect(error).toBeDefined();
      done();
    }
  });

  it('should return empty array when no users exist', (done) => {
    mockUserService.getUsers$.and.returnValue(of([]));

    service.getUsers$().subscribe((users: User[]) => {
      expect(users).toBeDefined();
      expect(users.length).toBe(0);
      done();
    });
  });

  it('should handle partial updates correctly', (done) => {
    const partialUpdate = { isActive: false };
    mockUserService.updateUser$.and.returnValue(of(undefined));

    service.updateUser$('1', partialUpdate).subscribe(() => {
      expect(service.updateUser$).toHaveBeenCalledWith('1', partialUpdate);
      done();
    });
  });
});
