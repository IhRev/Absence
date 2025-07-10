import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import { NgIf } from '@angular/common';
import { OrganizationsService } from '../organizations/services/organizations.service';
import { Organization } from '../organizations/models/organizations.models';

@Component({
  selector: 'nav-bar',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent implements OnInit {
  private authService: AuthService;
  private organizationService: OrganizationsService;
  public organization: Organization | null = null;
  public isLoggedIn = false;
  public isMenuOpen: boolean = false;
  public tabName: string = 'home';

  public constructor(
    authService: AuthService,
    organizationService: OrganizationsService
  ) {
    this.authService = authService;
    this.organizationService = organizationService;
  }

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

  public linkClicked(tabName: string): void {
    this.tabName = tabName;
    if (this.isMenuOpen) {
      this.isMenuOpen = false;
    }
  }
}
