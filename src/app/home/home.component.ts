import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { NgIf } from '@angular/common';
import { UserDetails } from '../auth/models/auth.models';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgIf, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements AfterViewInit, OnInit {
  public loggedIn: boolean = false;
  public user: UserDetails | null = null;

  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.authService.loggedIn$.subscribe((value) => {
      this.loggedIn = value;
      if (value) {
        this.authService.getUserDetails().subscribe({
          next: (result) => {
            if (result.isSuccess) {
              this.user = result.data!;
            }
          },
        });
      } else {
        this.user = null;
      }
    });
  }

  public ngAfterViewInit(): void {
    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    });

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => animationObserver.observe(el));
  }
}
