import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-error',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './form-error.component.html',
  styleUrl: './form-error.component.css',
})
export class FormErrorComponent {
  @Input() form!: FormGroup;
  @Input() name!: string;

  public get isInvalid(): boolean {
    const control = this.form.get(this.name);
    return !!control && control.touched && control.dirty;
  }

  public getErrorMessage(errorKey: string, errorValue: any): string {
    switch (errorKey) {
      case 'required':
        return 'This field is required.';
      case 'email':
        return 'Please enter a valid email address.';
      case 'minlength':
        return `Minimum length is ${errorValue.requiredLength}.`;
      case 'maxlength':
        return `Maximum length is ${errorValue.requiredLength}.`;
      default:
        return 'Invalid field.';
    }
  }

  public getErrors(): { key: string; value: any }[] {
    const control = this.form.get(this.name);
    const errors = control?.errors;
    return errors
      ? Object.entries(errors).map(([key, value]) => ({ key, value }))
      : [];
  }
}
