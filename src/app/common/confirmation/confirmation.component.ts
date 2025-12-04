import { Component, output } from '@angular/core';
import { ModalFormComponent } from '../modal-form/modal-form.component';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [ModalFormComponent],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.css',
})
export class ConfirmationComponent {
  submitted = output();
  closed = output();
}
