import { Timestamp } from '@angular/fire/firestore';

export interface User {
  id?: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}
