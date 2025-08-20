import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

export function navigateToErrorPage(router: Router, error: HttpErrorResponse) {
  router.navigate(['/error'], {
    queryParams: { status: error.status },
  });
}
