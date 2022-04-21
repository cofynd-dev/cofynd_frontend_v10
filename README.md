# CoFynd

> Built with `Angular v8.2.7`, bundled with `Angular CLI`.

## Table of contents:

- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
- [Installation](#installation)
- [Setting up upstream repository](#setting-up-upstream-repository)
- [Development and builds](#development-builds)
- [Deployment](#deployment)
- [Server Restart / Crash](#server-restart-crash)
- [Warning](#warning)
- [Dependencies](#dependencies)


## <a name="prerequisites"></a> Prerequisites
What you need to run this app:

- Angular version 8+
- Angular CLI version 8+
- Typescript version > 3.2.4 & < 3.4.5
- node.js version 10+
- npm (node package manager) version 6.9.0
- Visual studio code version 1.36.1

## <a name="getting-started"> Getting started

### <a name="installation"> Installation

You can install **`https://github.com/T9l/cofynd-angular-frontend/`** by simply forking the repo:

```
# clone the repo
$ git clone https://github.com/T9l/cofynd-angular-frontend/ [your-project-name]
$ cd [your-project-name]
```

### <a name="setting-up-upstream-repository"> Setting up upstream repository

Once you have cloned the repo, you can follow these steps to allow sync changes made in this repo with your fork:

```
# set up `origin`
$ git remote set-url origin [your-fork-repo]

# set up `upstream` to sync future changes
$ git remote add upstream https://github.com/T9l/cofynd-angular-frontend/

# verify the upstream repo specified for your fork
$ git remote -v
origin    https://github.com/YOUR_USERNAME/[your-fork-repo].git (fetch)
origin    https://github.com/YOUR_USERNAME/[your-fork-repo].git (push)
upstream  https://github.com/T9l/cofynd-angular-frontend (fetch)
upstream  https://github.com/T9l/cofynd-angular-frontend (push)

# initial push for the fork
$ git push
```

In order to merge the latest upstream changes, simply follow:

```
# fetch the latest upstream
$ git fetch upstream

# merge the upstream changes
$ git merge upstream/master
```

then handle any conflicts, and go on with building your app.

### <a name="development-builds"> Development and builds

Below are the scripts to dev, build, and test this seed project:

#### Install dependencies

```console
# use `npm` to install the deps
$ npm install
```

#### Development server

```
# dev server
$ ng serve

# dev server (AoT compilation)
$ ng serve --aot

# dev server (SSR & AoT compilation)
$ npm run build:uat && npm run serve:uat
```

And then,

- Navigate to `http://localhost:4200/` for the SPA (browser) build.
- Navigate to `http://localhost:4000/` for the SSR (universal) build.

The app will automatically re-compile if you change any of the source files.

#### Build

```
# development build
$ ng build

# UAT build (SSR)
$ npm run build:uat

# PRODUCTION build (SSR)
$ npm run build:production

```

### <a name="deployment"> Deployment
  

#### Staging Deployment

1. Login To `AWS` Console
2. Go to `~/cofynd-angular-frontend/`
3. Pull the latest commits from `uat` branch
4. Run `sudo npm run build:uat` (Create a folder `dist` containing latest build with `staging` environment)
5. On successfully build run `sudo npm run move:build` (Copy the latest build to distnew folder & create backup of old build)
6. After successfully copy the new build run `pm2 restart uat`(Restart the express server with latest build)
> Check the <a href="http://uat.cofynd.com/">http://uat.cofynd.com/</a> for latest changes


#### Production Deployment

1. Login To `AWS` Console
2. Go to `~/cofynd-angular-frontend/`
3. Pull the latest commits from `master` branch
4. Run `sudo npm run build:production` (Create a folder `dist` containing latest build with `production` environment)
5. On successfully build run `sudo npm run move:build` (Copy the latest build to distnew folder & create backup of old build)
6. After successfully copy the new build run `pm2 restart web`(Restart the express server with latest build)
> Check the <a href="http://uat.cofynd.com/">http://cofynd.com/</a> for latest changes

### <a name="server-restart-crash"> On Server 502, 503, & Restart
If node server stop running while server crash/down do the following thing

> Start new instance of node express
```

# For UAT
$ pm2 start distnew/server --name "uat"
$ pm2 restart uat

# For PRODUCTION
$ pm2 start distnew/server --name "web"
$ pm2 restart web
```

### <a name="warning"> Warning: Universal "Gotchas"

> When building Universal components in Angular there are a few things to keep in mind.

 - For the server bundle you may need to include your 3rd party module into `nodeExternals` whitelist

 - **`window`**, **`document`**, **`navigator`**, and other browser types - _do not exist on the server_ - so using them, or any library that uses them (jQuery for example) will not work. You do have some options, if you truly need some of this functionality:
    - If you need to use them, consider limiting them to only your client and wrapping them situationally. You can use the Object injected using the PLATFORM_ID token to check whether the current platform is browser or server. 
    
    ```typescript
     import { PLATFORM_ID } from '@angular/core';
     import { isPlatformBrowser, isPlatformServer } from '@angular/common';
     
     constructor(@Inject(PLATFORM_ID) private platformId: Object) { ... }
     
     ngOnInit() {
       if (isPlatformBrowser(this.platformId)) {
          // Client only code.
          ...
       }
       if (isPlatformServer(this.platformId)) {
         // Server only code.
         ...
       }
     }
    ```
    
 - **Don't manipulate the nativeElement directly**. Use the _Renderer2_ from ["@angular/core"](https://angular.io/api/core/Renderer2). We do this to ensure that in any environment we're able to change our view.
```typescript
constructor(element: ElementRef, renderer: Renderer2) {
  this.renderer.setStyle(element.nativeElement, 'font-size', 'x-large');
}
```

#### <a name="dependencies"> Dependencies
- [NgSelect] (https://github.com/ng-select/ng-select)
- [NguCarousel] (https://github.com/sheikalthaf/ngu-carousel)
- [NgxBootstrap] (https://github.com/valor-software/ngx-bootstrap)
- [NgxToastr] (https://github.com/scttcper/ngx-toastr)


