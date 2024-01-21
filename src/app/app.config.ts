import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {provideRouter} from '@angular/router';
import {HttpClientModule} from "@angular/common/http";
import {OAuthModule} from 'angular-oauth2-oidc';

import {routes} from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(
      OAuthModule.forRoot({
        resourceServer: {
          allowedUrls: ["http://localhost:8080/api/auth/v1/oauth2"],
          sendAccessToken: true,
        },
      })
    )
  ]
};
