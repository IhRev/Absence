import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error-page',
  standalone: true,
  imports: [],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.css',
})
export class ErrorPageComponent {
  public statusCode: number | null = null;

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe((params) => {
      this.statusCode = +params['status'] || null;
    });
  }
}
