import { Injectable } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  docData,
  serverTimestamp,
} from '@angular/fire/firestore';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private usersCollection;

  constructor(private firestore: Firestore) {
    this.usersCollection = collection(this.firestore, 'users');
  }

  getUsers$(): Observable<User[]> {
    return collectionData(this.usersCollection, {
      idField: 'id',
    }) as Observable<User[]>;
  }

  getUserById$(id: string): Observable<User | undefined> {
    const userDoc = doc(this.firestore, `users/${id}`);
    return docData(userDoc, { idField: 'id' }) as Observable<User | undefined>;
  }

  addUser$(
    user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ): Observable<User> {
    const newUser = {
      ...user,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    return from(addDoc(this.usersCollection, newUser)).pipe(
      map(
        (docRef) =>
          ({
            ...user,
            id: docRef.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          }) as User,
      ),
    );
  }

  updateUser$(id: string, userData: Partial<User>): Observable<void> {
    const userDoc = doc(this.firestore, `users/${id}`);
    const updateData = {
      ...userData,
      updatedAt: serverTimestamp(),
    };
    return from(updateDoc(userDoc, updateData));
  }

  deleteUser$(id: string): Observable<void> {
    const userDoc = doc(this.firestore, `users/${id}`);
    return from(deleteDoc(userDoc));
  }

  toggleUserStatus$(id: string, currentStatus: boolean): Observable<void> {
    const userDoc = doc(this.firestore, `users/${id}`);
    return from(
      updateDoc(userDoc, {
        isActive: !currentStatus,
        updatedAt: serverTimestamp(),
      }),
    );
  }
}
