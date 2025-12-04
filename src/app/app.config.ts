import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth/services/auth.interceptor';
import { AbsenceTypeService } from './absences/services/absence-type.service';
import { EventTypesService } from './admin-panel/services/event-types.service';
import { OrganizationsService } from './organizations/services/organizations.service';
import { AuthService } from './auth/services/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor])),
    {
      provide: APP_INITIALIZER,
      useFactory: (s: AbsenceTypeService) => () => s.load(),
      deps: [AbsenceTypeService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (s: EventTypesService) => () => s.load(),
      deps: [EventTypesService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (s: OrganizationsService) => () => s.load(),
      deps: [OrganizationsService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (s: AuthService) => () => s.load(),
      deps: [AuthService],
      multi: true,
    },
  ],
};
