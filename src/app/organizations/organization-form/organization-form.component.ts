import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CreateOrganizationDTO } from '../models/organizations.models';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-organization-form',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './organization-form.component.html',
  styleUrl: './organization-form.component.css',
})
export class OrganizationFormComponent {
  @Input() public isVisible = false;
  @Output() public closeModal = new EventEmitter();
  @Output() public submitModal = new EventEmitter<CreateOrganizationDTO>();
  public name!: string;

  public close(): void {
    this.closeModal.emit();
  }

  public submit(): void {
    this.submitModal.emit(new CreateOrganizationDTO(this.name));
  }
}
