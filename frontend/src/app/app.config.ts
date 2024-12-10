import { APP_INITIALIZER, ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AppConfigService } from './services/app-config.service';
import { CacheService } from './services/cache.service';
import { ClassificatorService } from './services/classificator.service';
import { ParameterService } from './services/parameter.service';
import { InitAppFactory } from './utility/init-app-factory';
import { DatePipe } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    CacheService,
    DatePipe,
    {
      provide: APP_INITIALIZER,
      useFactory: InitAppFactory,
      deps: [ParameterService, ClassificatorService, AppConfigService], // <- InitAppFactory-is peab järjekord sama olema
      multi: true,
    },
  ]
};
