import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-user-filter',
  templateUrl: './user-filter.component.html',
  styleUrl: './user-filter.component.scss',
  standalone: false,
})
export class UserFilterComponent {
  @Output() searchChanged = new EventEmitter<Event>();
  @Output() filterChanged = new EventEmitter<string>();

  onSearchInput(event: Event): void {
    this.searchChanged.emit(event);
  }

  onFilterChange(filter: string): void {
    this.filterChanged.emit(filter);
  }
}
