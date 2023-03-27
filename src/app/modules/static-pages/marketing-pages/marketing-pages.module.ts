import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { GeneralEnquireComponent } from './general-enquire/general-enquire.component';
import { MarketingPagesComponent } from './marketing-pages.component';
const routes: Routes = [
  {
    path: '',
    component: MarketingPagesComponent,
  },
];
@NgModule({
  declarations: [MarketingPagesComponent, GeneralEnquireComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
})
export class MarketingPagesModule {}
