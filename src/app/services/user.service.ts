import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // Mock data for demonstration
  private mockUsers: User[] = [
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
      isActive: true,
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-02-10'),
    },
    {
      id: '3',
      name: 'Bob Johnson',
      role: 'Moderator',
      isActive: false,
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-03-01'),
    },
    {
      id: '4',
      name: 'Alice Brown',
      role: 'User',
      isActive: true,
      createdAt: new Date('2024-03-05'),
      updatedAt: new Date('2024-03-05'),
    },
  ];

  constructor() {}

  /**
   * Get all users
   */
  getUsers(): Observable<User[]> {
    return of(this.mockUsers);
  }

  /**
   * Get user by ID
   */
  getUserById(id: string): Observable<User | undefined> {
    const user = this.mockUsers.find((u) => u.id === id);
    return of(user);
  }

  /**
   * Add new user
   */
  addUser(
    user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ): Observable<User> {
    const newUser: User = {
      ...user,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.mockUsers.push(newUser);
    return of(newUser);
  }

  /**
   * Update existing user
   */
  updateUser(id: string, userData: Partial<User>): Observable<User | null> {
    const userIndex = this.mockUsers.findIndex((u) => u.id === id);
    if (userIndex !== -1) {
      this.mockUsers[userIndex] = {
        ...this.mockUsers[userIndex],
        ...userData,
        updatedAt: new Date(),
      };
      return of(this.mockUsers[userIndex]);
    }
    return of(null);
  }

  /**
   * Delete user
   */
  deleteUser(id: string): Observable<boolean> {
    const userIndex = this.mockUsers.findIndex((u) => u.id === id);
    if (userIndex !== -1) {
      this.mockUsers.splice(userIndex, 1);
      return of(true);
    }
    return of(false);
  }

  /**
   * Toggle user active status
   */
  toggleUserStatus(id: string): Observable<User | null> {
    const user = this.mockUsers.find((u) => u.id === id);
    if (user) {
      user.isActive = !user.isActive;
      user.updatedAt = new Date();
      return of(user);
    }
    return of(null);
  }

  /**
   * Generate a simple ID for demonstration
   */
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
