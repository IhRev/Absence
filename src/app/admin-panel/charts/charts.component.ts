import { Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartType } from 'chart.js/auto';
import { AbsenceDTO } from '../../absences/models/absence.models';
import { AbsenceService } from '../../absences/services/absence.service';
import { OrganizationsService } from '../../organizations/services/organizations.service';
import { MemberDTO } from '../../organizations/models/organizations.models';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { NgFor } from '@angular/common';
import { HolidaysService } from '../../holidays/services/holidays.service';
import { HolidayDTO } from '../../holidays/models/holidays.models';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, NgFor],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.css',
})
export class ChartsComponent implements OnInit {
  public allMembers: MemberDTO[] | null = null;
  public selectedMembersIds: number[] = [];
  public chart: any = [];
  private monthes: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  years: number[] = [];
  selectedYear: number = 0;

  private barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
  };

  constructor(
    private readonly absenceService: AbsenceService,
    private readonly holidaysService: HolidaysService,
    private readonly organizationsService: OrganizationsService
  ) {}

  loadData() {
    this.absenceService
      .getAbsencesBySelectedUsers(
        new Date(this.selectedYear, 0, 1),
        new Date(this.selectedYear, 11, 31),
        this.selectedMembersIds
      )
      .subscribe({
        next: (absencesRes) => {
          if (absencesRes.isSuccess) {
            var organization = Number(localStorage.getItem('organization'));
            this.holidaysService
              .getHolidays(
                organization,
                new Date(this.selectedYear, 0, 1),
                new Date(this.selectedYear, 11, 31)
              )
              .subscribe({
                next: (holidaysRes) => {
                  if (holidaysRes.isSuccess) {
                    const holidays = holidaysRes.data!.map((h) => h.date);
                    this.updateChartData(absencesRes.data!, holidays);
                  }
                },
              });
          }
        },
      });
  }

  ngOnInit() {
    var currentYear = new Date().getFullYear();
    for (let i = currentYear - 10; i <= currentYear; i++) {
      this.years.push(i);
    }
    this.selectedYear = currentYear;

    this.organizationsService.selectedOrganization$.subscribe((value) => {
      if (value && value.isAdmin) {
        this.organizationsService.getMembers().subscribe((res) => {
          if (res.isSuccess) {
            this.allMembers = res.data!;
            this.selectedMembersIds = this.allMembers.map((m) => m.id);
            this.createChart();
            this.loadData();
          }
        });
      }
    });
  }

  createChart() {
    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: this.monthes,
        datasets: [
          {
            label: 'Absence',
            data: [],
            borderWidth: 1,
          },
        ],
      },
      options: this.barChartOptions,
    });
  }

  updateChartData(absences: AbsenceDTO[], holidays: Date[]) {
    const counts = Array(12).fill(0);
    for (const absence of absences) {
      for (
        let date = new Date(absence.startDate);
        date <= new Date(absence.endDate);
        date.setDate(date.getDate() + 1)
      ) {
        if (!holidays.includes(date)) {
          counts[date.getMonth()]++;
        }
      }
    }
    this.chart.data.datasets[0].data = counts;
    this.chart.update();
  }
}
