import { CoLivingService } from './../co-living.service';
import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { intToOrdinalNumberString, sanitizeParams } from '@app/shared/utils';
import { NguCarousel, NguCarouselConfig, NguCarouselStore } from '@ngu/carousel';
import { map } from 'rxjs/operators';
import { OfficeSpace } from '@core/models/office-space.model';

@Component({
  selector: 'app-co-living-similar',
  templateUrl: './co-living-similar.component.html',
  styleUrls: ['./co-living-similar.component.scss'],
})
export class CoLivingSimilarComponent implements OnInit {
  loading: boolean;
  @Input() address: string;
  @Input() workSpaceId: string;

  workSpaces: OfficeSpace[] = [];

  @ViewChild('similarCarousel', { static: false })
  similarCarousel: NguCarousel<OfficeSpace>;
  active = 0;

  carouselConfig: NguCarouselConfig = {
    grid: { xs: 2.4, sm: 2, md: 3, lg: 4, all: 0 },
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

  constructor(private cdr: ChangeDetectorRef, private coLivingService: CoLivingService) { }

  ngOnInit() {
    this.loadWorkSpaces();
  }

  loadWorkSpaces() {
    this.loading = true;
    const queryParam = {
      key: this.address,
      micro_location: 'enabled',
      type: 'micro_location',
      limit: 9
    };
    console.log("***");
    this.coLivingService
      .getPopularCoLivings(sanitizeParams(queryParam))
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
