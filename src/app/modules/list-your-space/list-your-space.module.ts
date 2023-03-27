import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { ListYourSpaceComponent } from './list-your-space.component';

const routes: Routes = [
  {
    path: '',
    component: ListYourSpaceComponent,
  },
];
@NgModule({
  declarations: [ListYourSpaceComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
})
export class ListYourSpaceModule {}
