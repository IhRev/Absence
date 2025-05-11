import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-password-confirmation',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './password-confirmation.component.html',
  styleUrl: './password-confirmation.component.css',
})
export class PasswordConfirmationComponent {
  @Input() public isVisible: boolean = false;
  @Output() public submitted = new EventEmitter<string>();
  @Output() public closed = new EventEmitter();
  public password: string = '';

  public submit(): void {
    this.submitted.emit(this.password);
  }

  public close(): void {
    this.closed.emit();
  }
}
