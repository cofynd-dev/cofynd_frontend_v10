import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ThankYouRoutingModule } from './thank-you-routing.module';
import { ThankYouComponent } from './thank-you.component';

@NgModule({
  declarations: [ThankYouComponent],
  imports: [CommonModule, ThankYouRoutingModule, SharedModule],
})
export class ThankYouModule { }
