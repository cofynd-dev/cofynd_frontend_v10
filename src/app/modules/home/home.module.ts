import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { HomeRoutingModule } from './home-routing.module';
import { HomeTestimonialComponent } from './home-testimonial/home-testimonial.component';
import { HomeComponent } from './home.component';
import { RotatingTextComponent } from './rotating-text/rotating-text.component';

import { HomeCitiesComponent } from './home-cities/home-cities.component';
import { HomeMenuModalComponent } from './home-menu-modal/home-menu-modal.component';

@NgModule({
  declarations: [
    HomeComponent,
    HomeTestimonialComponent,
    RotatingTextComponent,
    HomeCitiesComponent,
    HomeMenuModalComponent,
  ],
  entryComponents: [HomeMenuModalComponent],
  exports: [HomeMenuModalComponent],
  imports: [CommonModule, SharedModule, HomeRoutingModule],
})
export class HomeModule {}
