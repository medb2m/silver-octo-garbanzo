import { Component, OnInit } from '@angular/core';
import { RegionService, ReportService } from '@app/_services';
import { DashboardService } from '@app/_services/dashboard.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BarController, BarElement, CategoryScale, Chart, LinearScale, registerables } from 'chart.js';
import { TunMapComponent } from '../tun-map/tun-map.component';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [TranslateModule, TunMapComponent],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})
export class StatisticsComponent implements OnInit {
  chart: any;

  constructor(private regionService: RegionService, private translate: TranslateService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.fetchRegionData();
  }

  fetchRegionData() {
    // Fetch region stats from the service
    this.regionService.getAll().subscribe(regionStats => {
      const regionNames = regionStats.map((region: any) => this.translate.instant(region.name));
      const reportCounts = regionStats.map((region: any) => region.stats.totalReports);

      this.createChart(regionNames, reportCounts); // Create the chart with the fetched data
    }, error => {
      console.error('Error fetching region statistics:', error);
    });
  }

  createChart(regionNames: string[], reportCounts: number[]) {
    this.chart = new Chart('myChart', {
      type: 'bar',
      data: {
        labels: regionNames,
        datasets: [{
          label: this.translate.instant('numberOfReports'),
          data: reportCounts,
          backgroundColor: 'rgba(54, 162, 235, 0.8)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
