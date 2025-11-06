import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalFormComponent } from '../modal-form/modal-form.component';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [ModalFormComponent],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.css',
})
export class ConfirmationComponent {
  @Input() public isVisible: boolean = false;
  @Output() public submitted = new EventEmitter();
  @Output() public closed = new EventEmitter();

  public submit(): void {
    this.submitted.emit();
  }

  public close(): void {
    this.closed.emit();
  }
}
