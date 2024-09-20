import { Component } from '@angular/core';
import { ReportService } from '@app/_services';
import { DashboardService } from '@app/_services/dashboard.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BarController, BarElement, CategoryScale, Chart, LinearScale, registerables } from 'chart.js';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})
export class StatisticsComponent {
    chart: any;
  
    constructor(private reportService: ReportService, private translate: TranslateService) {
      Chart.register(...registerables);
    }
  
    ngOnInit(): void {
      // Use static data instead of fetching from the service
      const staticData = [
        { name: 'tunisia', count: 21 },
        { name: 'ariana', count: 7 },
        { name: 'manouba', count: 8 },
        { name: 'ben_arous', count: 12 },
        { name: 'nabeul', count: 16 },
        { name: 'bizerte', count: 15 },
        { name: 'zaghouan', count: 5 },
        { name: 'sousse', count: 16 },
        { name: 'monastir', count: 13 },
        { name: 'mahdia', count: 11 },
        { name: 'sfax', count: 16 },
        { name: 'beja', count: 9 },
        { name: 'jendouba', count: 9 },
        { name: 'kef', count: 12 },
        { name: 'siliana', count: 11 },
        { name: 'kairouan', count: 13 },
        { name: 'sidi_bouzid', count: 14 },
        { name: 'kasserine', count: 12 },
        { name: 'gabes', count: 11 },
        { name: 'medenine', count: 9 },
        { name: 'gafsa', count: 13 },
        { name: 'tozeur', count: 6 },
        { name: 'tataouine', count: 8 },
        { name: 'kebili', count: 7 }
      ];
      this.translateRegionNames(staticData);
    }

    translateRegionNames(reportData: any) {
      const regionNames = reportData.map((region: any) => this.translate.instant(region.name));
      const reportCounts = reportData.map((region: any) => region.count);
    
      this.createChart(regionNames, reportCounts);
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

      /* chart: any;

      constructor(private reportService: ReportService) {
        Chart.register(...registerables);
      }
    
      ngOnInit(): void {
        // Fetch dynamic data from the report service
        this.reportService.getReportsByRegion().subscribe(
          (reportData: any) => {
            this.createChart(reportData);
            console.log('Data received from backend:', reportData);
          },
          (error) => {
            console.error('Error fetching report data:', error);
          }
        );
      }
    
      createChart(reportData: any) {
        const regionNames = reportData.map((region: any) => region.region); // Assuming `region` is the key for region names
        const reportCounts = reportData.map((region: any) => region.reportCount); // Assuming `reportCount` is the key for report counts
    
        this.chart = new Chart('myChart', {
          type: 'bar',
          data: {
            labels: regionNames,
            datasets: [{
              label: 'Number of Reports',
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
      } */
}
