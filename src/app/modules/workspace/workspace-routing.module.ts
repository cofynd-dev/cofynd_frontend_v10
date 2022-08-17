import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkSpaceComponent } from './workspace.component';

const routes: Routes = [
  {
    path: '',
    component: WorkSpaceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkSpaceRoutingModule { }
