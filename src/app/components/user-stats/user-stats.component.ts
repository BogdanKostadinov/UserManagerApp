import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-stats',
  templateUrl: './user-stats.component.html',
  styleUrl: './user-stats.component.scss',
  standalone: false,
})
export class UserStatsComponent {
  @Input() totalUsers: number = 0;
  @Input() activeUsers: number = 0;
  @Input() inactiveUsers: number = 0;
}
