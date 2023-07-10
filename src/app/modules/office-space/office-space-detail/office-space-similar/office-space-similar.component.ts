import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { intToOrdinalNumberString, sanitizeParams } from '@app/shared/utils';
import { NguCarousel, NguCarouselConfig, NguCarouselStore } from '@ngu/carousel';
import { map } from 'rxjs/operators';
import { OfficeSpace } from '@core/models/office-space.model';
import { OfficeSpaceService } from '../../office-space.service';

@Component({
  selector: 'app-office-space-similar',
  templateUrl: './office-space-similar.component.html',
  styleUrls: ['./office-space-similar.component.scss'],
})
export class OfficeSpaceSimilarComponent implements OnInit {
  loading: boolean;
  @Input() address: string;
  @Input() workSpaceId: string;

  workSpaces: OfficeSpace[] = [];

  @ViewChild('similarCarousel', { static: false })
  similarCarousel: NguCarousel<OfficeSpace>;
  active = 0;

  carouselConfig: NguCarouselConfig = {
    grid: { xs: 1.4, sm: 2.6, md: 3, lg: 3, all: 0 },
    slide: 1,
    speed: 250,
    point: {
      visible: true,
    },
    interval: { timing: 4000, initialDelay: 1000 },
    load: 4,
    velocity: 0,
    touch: true,
    easing: 'cubic-bezier(0, 0, 0.2, 1)',
  };

  constructor(private cdr: ChangeDetectorRef, private officeSpaceService: OfficeSpaceService) {}

  ngOnInit() {
    this.loadWorkSpaces();
  }

  loadWorkSpaces() {
    this.loading = true;
    const queryParam = { key: this.address, limit: 9 };
    this.officeSpaceService
      .getPopularOffices(sanitizeParams(queryParam))
      .pipe(
        map(workspaces => {
          return workspaces.data.filter(workspace => workspace.id !== this.workSpaceId);
        }),
      )
      .subscribe(filteredWorkspaces => {
        this.workSpaces = filteredWorkspaces;
        this.loading = false;
        this.cdr.detectChanges();
      });
  }

  getoffceType(type: string) {
    let stringToReplace = type;
    var desired = stringToReplace.replace(/[^\w\s]/gi, ' ');
    return desired;
  }

  onSliderMove(slideData: NguCarouselStore) {
    this.active = slideData.currentSlide;
  }

  goToPrev() {
    this.similarCarousel.moveTo(this.active - 1);
  }

  goToNext() {
    this.similarCarousel.moveTo(this.active + 1);
  }

  getFloorSuffix(floor: number) {
    return !isNaN(floor) ? intToOrdinalNumberString(floor) : floor;
  }
}
