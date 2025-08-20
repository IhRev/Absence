import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-form',
  standalone: true,
  imports: [NgIf],
  templateUrl: './modal-form.component.html',
  styleUrl: './modal-form.component.css',
})
export class ModalFormComponent {
  @Input() public title: string = '';
  @Input() public isVisible: boolean = false;
  @Output() public closeModal = new EventEmitter();

  public close(): void {
    this.closeModal.emit();
  }
}
