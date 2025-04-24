import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AbsenceListComponent } from './absences/absence-list/absence-list.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'absences', component: AbsenceListComponent },
  { path: 'home', component: HomeComponent },
];
