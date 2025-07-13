import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { User } from '../models/user.model';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return users', (done) => {
    service.getUsers().subscribe((users) => {
      expect(users).toBeDefined();
      expect(users.length).toBeGreaterThan(0);
      expect(users[0].id).toBeDefined();
      expect(users[0].name).toBeDefined();
      expect(users[0].role).toBeDefined();
      expect(users[0].isActive).toBeDefined();
      expect(users[0].createdAt).toBeDefined();
      expect(users[0].updatedAt).toBeDefined();
      done();
    });
  });

  it('should return user by id', (done) => {
    service.getUserById('1').subscribe((user) => {
      expect(user).toBeDefined();
      expect(user?.id).toBe('1');
      done();
    });
  });

  it('should return undefined for non-existent user', (done) => {
    service.getUserById('999').subscribe((user) => {
      expect(user).toBeUndefined();
      done();
    });
  });

  it('should add new user', (done) => {
    const newUserData = {
      name: 'Test User',
      role: 'User',
      isActive: true,
    };

    service.addUser(newUserData).subscribe((user) => {
      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.name).toBe(newUserData.name);
      expect(user.role).toBe(newUserData.role);
      expect(user.isActive).toBe(newUserData.isActive);
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
      done();
    });
  });

  it('should update existing user', (done) => {
    const updateData = { name: 'Updated Name' };

    service.updateUser('1', updateData).subscribe((user) => {
      expect(user).toBeDefined();
      expect(user?.name).toBe('Updated Name');
      expect(user?.updatedAt).toBeInstanceOf(Date);
      done();
    });
  });

  it('should return null when updating non-existent user', (done) => {
    service.updateUser('999', { name: 'Test' }).subscribe((user) => {
      expect(user).toBeNull();
      done();
    });
  });

  it('should delete existing user', (done) => {
    service.deleteUser('1').subscribe((result) => {
      expect(result).toBe(true);
      done();
    });
  });

  it('should return false when deleting non-existent user', (done) => {
    service.deleteUser('999').subscribe((result) => {
      expect(result).toBe(false);
      done();
    });
  });

  it('should toggle user status', (done) => {
    // First get the user to know current status
    service.getUserById('1').subscribe((originalUser) => {
      const originalStatus = originalUser?.isActive;

      service.toggleUserStatus('1').subscribe((user) => {
        expect(user).toBeDefined();
        expect(user?.isActive).toBe(!originalStatus);
        expect(user?.updatedAt).toBeInstanceOf(Date);
        done();
      });
    });
  });

  it('should return null when toggling status of non-existent user', (done) => {
    service.toggleUserStatus('999').subscribe((user) => {
      expect(user).toBeNull();
      done();
    });
  });
});
