import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

export function getErrorMessage(errorKey: string, errorValue: any): string {
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

export function getErrors(
  form: FormGroup,
  controlName: string
): { key: string; value: any }[] {
  const control = form.get(controlName);
  const errors = control?.errors;
  return errors
    ? Object.entries(errors).map(([key, value]) => ({ key, value }))
    : [];
}

export function navigateToErrorPage(router: Router, error: HttpErrorResponse) {
  router.navigate(['/error'], {
    queryParams: { status: error.status },
  });
}
