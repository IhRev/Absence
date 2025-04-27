import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'nav-bar',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent implements OnInit {
  private authService: AuthService;
  public isLoggedIn = false;
  public userFullName: string | null = null;

  public constructor(authService: AuthService) {
    this.authService = authService;
  }

  public ngOnInit(): void {
    this.authService.loggedIn$.subscribe((status) => {
      if (status) {
        this.authService.getUserDetails().subscribe({
          next: (data) => {
            this.userFullName = `${data.firstName} ${data.lastName}`;
          },
          error: (e) => console.error(e),
        });
      } else {
        this.userFullName = null;
      }
      this.isLoggedIn = status;
    });
  }
}
