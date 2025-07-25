import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import { NgIf } from '@angular/common';
import { OrganizationsService } from '../organizations/services/organizations.service';
import { Organization } from '../organizations/models/organizations.models';

@Component({
  selector: 'nav-bar',
  standalone: true,
  imports: [RouterLink, NgIf, RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent implements OnInit {
  public organization: Organization | null = null;
  public isLoggedIn = false;
  public isMenuOpen: boolean = false;

  public constructor(
    private readonly authService: AuthService,
    private readonly organizationService: OrganizationsService
  ) {}

  public ngOnInit(): void {
    this.authService.loggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });
    this.organizationService.selectedOrganization$.subscribe((value) => {
      if (value) {
        this.organization = value;
      } else {
        this.organization = null;
      }
    });
  }

  public linkClicked(): void {
    if (this.isMenuOpen) {
      this.isMenuOpen = false;
    }
  }
}
