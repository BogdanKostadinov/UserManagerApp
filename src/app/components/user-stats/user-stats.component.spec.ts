import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';

import { UserStatsComponent } from './user-stats.component';

describe('UserStatsComponent', () => {
  let component: UserStatsComponent;
  let fixture: ComponentFixture<UserStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserStatsComponent],
      imports: [MatIconModule],
    }).compileComponents();

    fixture = TestBed.createComponent(UserStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.totalUsers).toBe(0);
    expect(component.activeUsers).toBe(0);
    expect(component.inactiveUsers).toBe(0);
  });

  it('should accept totalUsers input', () => {
    const testValue = 10;
    component.totalUsers = testValue;

    expect(component.totalUsers).toBe(testValue);
  });

  it('should accept activeUsers input', () => {
    const testValue = 7;
    component.activeUsers = testValue;

    expect(component.activeUsers).toBe(testValue);
  });

  it('should accept inactiveUsers input', () => {
    const testValue = 3;
    component.inactiveUsers = testValue;

    expect(component.inactiveUsers).toBe(testValue);
  });

  it('should handle multiple input changes', () => {
    component.totalUsers = 15;
    component.activeUsers = 10;
    component.inactiveUsers = 5;

    expect(component.totalUsers).toBe(15);
    expect(component.activeUsers).toBe(10);
    expect(component.inactiveUsers).toBe(5);
  });

  it('should handle zero values', () => {
    component.totalUsers = 0;
    component.activeUsers = 0;
    component.inactiveUsers = 0;

    expect(component.totalUsers).toBe(0);
    expect(component.activeUsers).toBe(0);
    expect(component.inactiveUsers).toBe(0);
  });

  it('should handle large values', () => {
    component.totalUsers = 9999;
    component.activeUsers = 5555;
    component.inactiveUsers = 4444;

    expect(component.totalUsers).toBe(9999);
    expect(component.activeUsers).toBe(5555);
    expect(component.inactiveUsers).toBe(4444);
  });
});
