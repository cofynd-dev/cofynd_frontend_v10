import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PrivacyContentComponent } from './privacy-content/privacy-content.component';
import { PrivacyComponent } from './privacy.component';
import { routes } from './privacy.routes';
@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule, RouterModule],
  declarations: [PrivacyComponent, PrivacyContentComponent],
  providers: [],
})
export class PrivacyModule {}
