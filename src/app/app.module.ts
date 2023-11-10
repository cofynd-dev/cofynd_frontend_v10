import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from '@core/core.module';
import { environment } from '@env/environment';
import { SharedModule } from '@shared/shared.module';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapApiLoaderModule } from '@core/map-api-loader/map-api-loader.module';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';


// Default google map param
const googleMapsParams = {
  apiKey: environment.keys.GOOGLE_MAP,
  libraries: ['places'],
  language: 'en',
  region: 'in',
};
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    // MapApiLoaderModule.forRoot(googleMapsParams),
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
      countDuplicates: false,
    }),
    CoreModule,
    SharedModule,
    LeafletModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }