import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { UserFilterComponent } from './user-filter.component';

describe('UserFilterComponent', () => {
  let component: UserFilterComponent;
  let fixture: ComponentFixture<UserFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserFilterComponent],
      imports: [
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        NoopAnimationsModule,
      ],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(UserFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit searchChanged event when onSearchInput is called', () => {
    spyOn(component.searchChanged, 'emit');
    const mockEvent = new Event('input');

    component.onSearchInput(mockEvent);

    expect(component.searchChanged.emit).toHaveBeenCalledWith(mockEvent);
  });

  it('should emit filterChanged event when onFilterChange is called', () => {
    spyOn(component.filterChanged, 'emit');
    const filterValue = 'admin';

    component.onFilterChange(filterValue);

    expect(component.filterChanged.emit).toHaveBeenCalledWith(filterValue);
  });

  it('should have searchChanged and filterChanged outputs defined', () => {
    expect(component.searchChanged).toBeDefined();
    expect(component.filterChanged).toBeDefined();
  });

  it('should handle empty filter change', () => {
    spyOn(component.filterChanged, 'emit');

    component.onFilterChange('');

    expect(component.filterChanged.emit).toHaveBeenCalledWith('');
  });

  it('should handle multiple search inputs', () => {
    spyOn(component.searchChanged, 'emit');
    const event1 = new Event('input');
    const event2 = new Event('input');

    component.onSearchInput(event1);
    component.onSearchInput(event2);

    expect(component.searchChanged.emit).toHaveBeenCalledTimes(2);
    expect(component.searchChanged.emit).toHaveBeenCalledWith(event1);
    expect(component.searchChanged.emit).toHaveBeenCalledWith(event2);
  });
});
