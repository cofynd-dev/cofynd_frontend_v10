import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { OfficeSpaceDetailComponent } from './office-space-detail.component';
import { OfficeSpaceSimilarComponent } from './office-space-similar/office-space-similar.component';
const routes: Routes = [
  {
    path: '',
    component: OfficeSpaceDetailComponent,
  },
];
@NgModule({
  declarations: [OfficeSpaceDetailComponent, OfficeSpaceSimilarComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
})
export class OfficeSpaceDetailModule {}
