import { ModuleWithProviders, NgModule } from '@angular/core';
import { LazyMapsAPILoader } from './lazy-maps-api-loader';
import { LAZY_MAPS_API_CONFIG, LazyMapsAPILoaderConfigLiteral } from './lazy-maps-api-loader';
import { MapsAPILoader } from './maps-api-loader';
import { BROWSER_GLOBALS_PROVIDERS } from './browser-globals';

/**
 * The angular-google-maps core module. Contains all Directives/Services/Pipes
 * of the core module. Please use `MapApiLoaderModule.forRoot()` in your app module.
 */
@NgModule()
export class MapApiLoaderModule {
  /**
   * Please use this method when you register the module at the root level.
   */
  static forRoot(lazyMapsAPILoaderConfig?: LazyMapsAPILoaderConfigLiteral): ModuleWithProviders {
    return {
      ngModule: MapApiLoaderModule,
      providers: [
        ...BROWSER_GLOBALS_PROVIDERS,
        { provide: MapsAPILoader, useClass: LazyMapsAPILoader },
        { provide: LAZY_MAPS_API_CONFIG, useValue: lazyMapsAPILoaderConfig },
      ],
    };
  }
}
