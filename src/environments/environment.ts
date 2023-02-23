// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  blogUrl: 'http://blog.cofynd.com',
  // apiEndPoint: 'https://api.cofynd.com/api',
  apiEndPoint: 'http://localhost:7000/api',
  appUrl: 'https://cofynd.com',
  keys: {
    // GOOGLE_MAP: 'AIzaSyDrIBoEI-pQOvA87Q6UGXvKsyv1XBT5KEg',
    GOOGLE_MAP: '',
    LOCATIONIQ_MAP: 'pk.c0dc118d922d758a22955af83b95f5c4',
    RAZOR_PAY: 'rzp_live_1psf55EiMDZ4Vb',
    FACEBOOK_APP: '173373107448062',
  },
  images: {
    S3_URL: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images',
  },
  options: {
    GA_ENABLED: false,
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
