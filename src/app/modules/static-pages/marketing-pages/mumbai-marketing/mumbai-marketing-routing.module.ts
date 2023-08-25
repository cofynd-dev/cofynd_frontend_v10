import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MumbaiMarketingComponent } from './mumbai-marketing.component';

const routes: Routes = [
  {
    path: '',
    component: MumbaiMarketingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MumbaiMarketingRoutingModule {}
