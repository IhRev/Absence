import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AbsenceListComponent } from './absences/absence-list/absence-list.component';
import { HomeComponent } from './home/home.component';
import { UserProfileComponent } from './auth/user-profile/user-profile.component';
import { AboutComponent } from './about/about.component';
import { RegisterComponent } from './auth/register/register.component';
import { HolidaysComponent } from './holidays/holidays.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { EventsComponent } from './admin-panel/events/events.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'absences', component: AbsenceListComponent },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'profile', component: UserProfileComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'holidays', component: HolidaysComponent },
  {
    path: 'admin',
    component: AdminPanelComponent,
    children: [
      {
        path: 'events',
        component: EventsComponent,
      },
    ],
  },
  {
    path: 'organizations',
    loadComponent: () =>
      import('./organizations/organizations.component').then(
        (m) => m.OrganizationsComponent
      ),
  },
];
