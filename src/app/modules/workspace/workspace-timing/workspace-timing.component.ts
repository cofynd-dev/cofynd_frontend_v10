import { Component, Input, OnInit } from '@angular/core';
import { WorkingDays, WorkingHours } from '@core/models/workspace.model';

enum WEEK_DAYS {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

@Component({
  selector: 'app-workspace-timing',
  templateUrl: './workspace-timing.component.html',
  styleUrls: ['./workspace-timing.component.scss'],
})
export class WorkspaceTimingComponent implements OnInit {
  @Input() workingDays: { [key: string]: WorkingHours };
  tempWorkingDays: WorkingDays[] = [];

  weekTime: string;
  saturdayTime: string;
  sundayTime: string;
  constructor() {}

  ngOnInit() {
    Object.keys(this.workingDays).map(day => {
      switch (day) {
        case WEEK_DAYS.SUNDAY:
          const sunTime = this.getTime(this.workingDays[day]);
          this.sundayTime = 'Sun : ' + sunTime;
          break;
        case WEEK_DAYS.SATURDAY:
          const satTime = this.getTime(this.workingDays[day]);
          this.saturdayTime = 'Sat : ' + satTime;
          break;
        default:
          const timing = this.getTime(this.workingDays[day]);
          this.weekTime = 'Mon - Fri : ' + timing;
          break;
      }
    });
  }

  getTime(time: WorkingHours) {
    if (time.is_open_24) {
      return '24 Hours';
    }

    if (time.from && time.to) {
      return time.from + ' to ' + time.to;
    }

    if (time.is_closed) {
      return 'Closed';
    }
  }
}
