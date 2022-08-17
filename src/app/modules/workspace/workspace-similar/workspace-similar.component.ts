import { ChangeDetectorRef, Component, Input, OnInit, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { sanitizeParams } from '@app/shared/utils';
import { WorkSpace } from '@core/models/workspace.model';
import { WorkSpaceService } from '@core/services/workspace.service';
import { NguCarousel, NguCarouselConfig, NguCarouselStore } from '@ngu/carousel';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-workspace-similar',
  templateUrl: './workspace-similar.component.html',
  styleUrls: ['./workspace-similar.component.scss'],
})
export class WorkspaceSimilarComponent implements OnInit {
  loading: boolean;
  @Input() address: string;
  @Input() workSpaceId: string;

  workSpaces: WorkSpace[] = [];

  @ViewChild('similarCarousel', { static: false })
  similarCarousel: NguCarousel<WorkSpace>;
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
  minPrice: string;
  maxPrice: string;

  constructor(private workSpaceService: WorkSpaceService, private cdr: ChangeDetectorRef,
    private router: Router,
  ) { }

  ngOnInit() {
    this.minPrice = localStorage.getItem('minPrice');
    this.maxPrice = localStorage.getItem('maxPrice');
    this.loadWorkSpaces();
  }
  openDetailsPage(slug) {
    let country = localStorage.getItem('country_name');
    if (country == 'india' || country == 'India' || country == 'INDIA') {
      this.router.navigate([`/coworking/${slug.toLowerCase().trim()}`]);
    } else {
      var url = `/${country}/coworking-details/${slug.toLowerCase().trim()}`;
      this.router.navigate([url]);
      // window.open(url, "_blank")
    }
  }
  loadWorkSpaces() {
    const address = this.address.replace('#', '');
    this.loading = true;
    var queryParam = {};
    if (this.minPrice && this.maxPrice) {
      queryParam = {
        limit: 9, key: address, minPrice: +this.minPrice,
        maxPrice: +this.maxPrice,
      };

    } else {
      queryParam = { limit: 9, key: address };
    }
    this.workSpaceService
      .getWorSpacesByAddress(sanitizeParams(queryParam))
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
}


// custom Pipe for eliminate city name from address
@Pipe({ name: 'microLocation' })
export class MicroLocationPipe implements PipeTransform {
  transform(value): string {
    let splitData = value.split(",")
    splitData.splice(-1);
    return splitData;
  }
}
