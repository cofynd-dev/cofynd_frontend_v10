import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LayoutsModule } from './../../../layouts/layouts.module';
import { PageNotFoundComponent } from './page-not-found.component';
import { NotFoundRoutes } from './page-not-found.routes';
import { PageNotFoundService } from './page-not-found.service';

@NgModule({
  declarations: [PageNotFoundComponent],
  imports: [CommonModule, NotFoundRoutes, LayoutsModule],
  providers: [PageNotFoundService],
})
export class PageNotFoundModule {}
