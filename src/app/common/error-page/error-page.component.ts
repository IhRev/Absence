import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-error-page',
  standalone: true,
  imports: [],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.css',
})
export class ErrorPageComponent {
  readonly #route = inject(ActivatedRoute);
  readonly #router = inject(Router);

  statusCode = signal<number | null>(null);

  constructor() {
    this.#route.queryParams.subscribe((params) => {
      this.statusCode = params['status'] || 404;
    });
  }

  goHome() {
    this.#router.navigate(['/home']);
  }
}
