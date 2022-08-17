import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NguCarouselModule } from '@ngu/carousel';
import { AboutUsRoutingModule } from './about-us-routing.module';
import { AboutUsComponent } from './about-us.component';
import { TeamCarouselComponent } from './team-carousel/team-carousel.component';

@NgModule({
  declarations: [AboutUsComponent, TeamCarouselComponent],
  imports: [CommonModule, AboutUsRoutingModule, NguCarouselModule],
})
export class AboutUsModule {}
