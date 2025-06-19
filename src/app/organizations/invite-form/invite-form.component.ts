import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-invite-form',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './invite-form.component.html',
  styleUrl: './invite-form.component.css',
})
export class InviteFormComponent {
  @Input() public isVisible = false;
  @Output() public closeModal = new EventEmitter();
  @Output() public submitModal = new EventEmitter<string>();
  public email!: string;

  public close(): void {
    this.closeModal.emit();
  }

  public submit(): void {
    this.submitModal.emit(this.email);
  }
}
