import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// PLUGINS
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NguCarouselModule } from '@ngu/carousel';
import { intersectionObserverPreset, LazyLoadImageModule } from 'ng-lazyload-image';
import { NgxStarRatingModule } from 'ngx-star-rating';

// DIRECTIVES
import { LoadingButtonDirective } from './directives/loading-button.directive';
import { DisableInputDirective } from './directives/disable-input.directive';
import { ScrollToInvalidField } from './directives/scroll-to-invalid-field.directive';
import { CustomEventAnalyticsDirective } from './directives/custom-event-analytics.directive';
import { MaterialInputDirective } from './directives/material-input.directive';
import { OpenLinkInNewWindowDirective } from './directives/open-new-tab-directive';
import { ClickOutsideDirective } from './directives/click-outside.directive';

// COMPONENTS
import { InputValidationComponent } from './components/input-validation/input-validation.component';
import { AuthDialogComponent } from './components/auth-dialog/auth-dialog.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { LoadingPlaceholderComponent } from './components/loading-placeholder/loading-placeholder.component';
import { CheckMarkCircleComponent } from './components/check-mark-circle/check-mark-circle.component';
import { SearchAutocompleteComponent } from './components/search-autocomplete/search-autocomplete.component';
import { FavoriteButtonComponent } from './components/favorite-button/favorite-button.component';
import { WorkspaceEnquireComponent } from './components/workspace-enquire/workspace-enquire.component';
import { ImageGalleryComponent } from './components/image-gallery/image-gallery.component';
import { WorkspaceBannerComponent } from './components/workspace-banner/workspace-banner.component';
import { WorkspaceLoaderComponent } from './components/workspace-loader/workspace-loader.component';
import { WorkspaceBannerBlankComponent } from './components/workspace-banner-blank/workspace-banner-blank.component';
import { SocialShareComponent } from './components/social-share/social-share.component';
import { HomeBrandListComponent } from './components/home-brand-list/home-brand-list.component';
import { HomePopularSpaceComponent } from './components/home-popular-space/home-popular-space.component';
// Search Related
import { SearchBreadcrumbComponent } from './components/search-breadcrumb/search-breadcrumb.component';
import { SearchCardLoaderComponent } from './components/search-card-loader/search-card-loader.component';
import { SearchCardComponent } from './components/search-card/search-card.component';
import { SearchContactUsTextComponent } from './components/search-contact-us-text/search-contact-us-text.component';
import { SearchMapViewComponent } from './components/search-map-view/search-map-view.component';
import { SearchNoResultComponent } from './components/search-no-result/search-no-result.component';
import { SearchSimilarLocationComponent } from './components/search-similar-location/search-similar-location.component';
import { HomeCityDropdownComponent } from './components/home-city-dropdown/home-city-dropdown.component';
import { HomeNewsListComponent } from './components/home-news-list/home-news-list.component';
import { ReviewComponent } from './components/review/review.component';
import { StarRatingComponent } from './components/review/star-rating/star-rating.component';
import { ReviewSubmissionFormComponent } from './components/review/review-submission-form/review-submission-form.component';
import { HomeCityPopupComponent } from './components/home-city-popup/home-city-popup.component';
import { CarouselItemComponent } from './components/carousel-item/carousel-item.component';
import { HomeNearmePopupComponent } from './components/home-nearme-popup/home-nearme-popup.component';
import { CuratedCityPopupComponent } from './components/curated-city-popup/curated-city-popup.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { OurClientsComponent } from './components/our-clients/our-clients.component';
import { SearchContactUsText1Component } from './components/search-contact-us-text1/search-contact-us-text1.component';
import { SearchContactUsText2Component } from './components/search-contact-us-text2/search-contact-us-text2.component';

const MODULES = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  NgSelectModule,
  NguCarouselModule,
  NgxStarRatingModule,
];

const COMPONENTS = [
  InputValidationComponent,
  LoginFormComponent,
  RegisterFormComponent,
  LoadingPlaceholderComponent,
  CheckMarkCircleComponent,
  SearchAutocompleteComponent,
  FavoriteButtonComponent,
  SearchCardLoaderComponent,
  SearchBreadcrumbComponent,
  SearchCardComponent,
  SearchSimilarLocationComponent,
  SearchNoResultComponent,
  SearchMapViewComponent,
  SearchContactUsTextComponent,
  SearchContactUsText1Component,
  SearchContactUsText2Component,
  ImageGalleryComponent,
  WorkspaceBannerBlankComponent,
  WorkspaceBannerComponent,
  WorkspaceLoaderComponent,
  SocialShareComponent,
  WorkspaceEnquireComponent,
  HomeBrandListComponent,
  HomePopularSpaceComponent,
  HomeCityDropdownComponent,
  HomeNewsListComponent,
  ReviewComponent,
  StarRatingComponent,
  ReviewSubmissionFormComponent,
  HomeCityPopupComponent,
  HomeNearmePopupComponent,
  CuratedCityPopupComponent,
  CarouselItemComponent,
  OurClientsComponent
];
const DIRECTIVES = [
  LoadingButtonDirective,
  DisableInputDirective,
  ScrollToInvalidField,
  MaterialInputDirective,
  OpenLinkInNewWindowDirective,
  CustomEventAnalyticsDirective,
  ClickOutsideDirective,
];

const GLOBAL_DATE_PICKER_CONFIG = {
  dateInputFormat: 'YYYY-MM-DD',
  showWeekNumbers: false,
  adaptivePosition: true,
  isAnimated: true,
  containerClass: 'custom-datepicker',
};

// Global Datepicker Config
export function getDatepickerConfig(): BsDatepickerConfig {
  return Object.assign(new BsDatepickerConfig(), GLOBAL_DATE_PICKER_CONFIG);
}

@NgModule({
  declarations: [AuthDialogComponent, DIRECTIVES, COMPONENTS, HomeNearmePopupComponent, CuratedCityPopupComponent, OurClientsComponent, SearchContactUsText1Component, SearchContactUsText2Component],
  imports: [
    CommonModule,
    RouterModule,
    MODULES,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    PaginationModule.forRoot(),
    LazyLoadImageModule.forRoot(intersectionObserverPreset),
    AccordionModule.forRoot(),
    LeafletModule,
  ],
  exports: [
    MODULES,
    ModalModule,
    BsDatepickerModule,
    BsDropdownModule,
    PaginationModule,
    LazyLoadImageModule,
    AccordionModule,
    DIRECTIVES,
    COMPONENTS,
  ],
  entryComponents: [AuthDialogComponent, HomeCityPopupComponent, HomeNearmePopupComponent, CuratedCityPopupComponent],
  providers: [
    {
      provide: BsDatepickerConfig,
      useFactory: getDatepickerConfig,
    },
  ],
})
export class SharedModule { }
