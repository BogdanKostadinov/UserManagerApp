import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';

@Pipe({
  name: 'firestoreDate',
  standalone: false
})
export class FirestoreDatePipe implements PipeTransform {
  transform(value: Date | Timestamp | any, format: string = 'short'): string {
    if (!value) return '';
    
    let date: Date;
    
    // Check if it's a Firestore Timestamp
    if (value && typeof value.toDate === 'function') {
      date = value.toDate();
    } else if (value instanceof Date) {
      date = value;
    } else if (typeof value === 'string') {
      date = new Date(value);
    } else {
      return '';
    }
    
    // Format the date based on the format parameter
    switch (format) {
      case 'short':
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
      case 'date':
        return date.toLocaleDateString();
      case 'time':
        return date.toLocaleTimeString();
      case 'full':
        return date.toLocaleString();
      default:
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }
  }
}
