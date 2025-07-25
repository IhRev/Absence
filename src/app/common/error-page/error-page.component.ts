import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-error-page',
  standalone: true,
  imports: [],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.css',
})
export class ErrorPageComponent {
  public statusCode: number | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    this.route.queryParams.subscribe((params) => {
      this.statusCode = params['status'] || 404;
    });
  }

  public goHome(): void {
    this.router.navigate(['/home']);
  }
}
