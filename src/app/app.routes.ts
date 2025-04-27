import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AbsenceListComponent } from './absences/absence-list/absence-list.component';
import { HomeComponent } from './home/home.component';
import { UserProfileComponent } from './auth/user-profile/user-profile.component';
import { AboutComponent } from './about/about.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'absences', component: AbsenceListComponent },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'profile', component: UserProfileComponent },
];
