import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Organization } from './models/organizations.models';
import { OrganizationsService } from './services/organizations.service';

@Component({
  selector: 'app-organizations',
  standalone: true,
  imports: [NgFor],
  templateUrl: './organizations.component.html',
  styleUrl: './organizations.component.css',
})
export class OrganizationsComponent implements OnInit {
  public organizations: Organization[] = [];
  public selectedOrganization: Organization | null = null;

  public constructor(private organizationService: OrganizationsService) {}

  public ngOnInit(): void {
    this.organizationService.get().subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.organizations = res.data!;
        }
      },
    });
  }

  public selectOrganization(selected: Organization): void {
    this.organizationService.selectOrganization(selected);
    this.selectedOrganization = selected;
  }

  public add(): void {
    this.organizationService.add('test').subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.organizations.push(
            new Organization(res.data!, 'test', true, true)
          );
        }
      },
    });
  }
}
