import { Timestamp } from '@angular/fire/firestore';

export enum UserRole {
  Admin = 'Admin',
  Moderator = 'Moderator',
  User = 'User',
}

export interface User {
  id?: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}
