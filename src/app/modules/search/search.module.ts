import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { SearchResultComponent } from './search-result/search-result.component';
import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search.component';

@NgModule({
  declarations: [SearchComponent, SearchResultComponent],
  imports: [CommonModule, SharedModule, SearchRoutingModule],
})
export class SearchModule {}
