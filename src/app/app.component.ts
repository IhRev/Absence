import { Component } from '@angular/core';
import { AbsenceListComponent } from './absences/absence-list/absence-list.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AbsenceListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent 
{
}