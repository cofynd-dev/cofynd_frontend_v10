import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { routes as MODULE_ROUTES } from '@app/modules/modules.routes';
const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [...MODULE_ROUTES],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
