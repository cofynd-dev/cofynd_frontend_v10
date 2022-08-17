import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { DropdownItemComponent } from './components/header/dropdown-item/dropdown-item.component';

@NgModule({
  declarations: [HeaderComponent, FooterComponent, DropdownItemComponent],
  imports: [CommonModule, RouterModule, SharedModule],
  exports: [HeaderComponent, FooterComponent],
})
export class LayoutsModule {}
