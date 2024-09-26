import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { ReportService } from '@app/_services';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [TranslateModule, CommonModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css'
})
export class ChartComponent {
  @Input() regionDataForChart: any;
    chart: any;

    ngOnChanges(changes: SimpleChanges) {
      if (changes['regionDataForChart'] && this.regionDataForChart) {
        this.updateChart(this.regionDataForChart);
      }
    }

    updateChart(regionData: any) {
      if (this.chart) {
        this.chart.destroy();  // Destroy the previous chart to update it
      }
      
      const reportDates = regionData.reportDetails.map((report: any) => report.date);  // Assuming `reportDetails` contains dates
      const reportCounts = regionData.reportDetails.map((report: any) => report.count);  // Example for report counts
    
      this.createChart(reportDates, reportCounts);
    }
  
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
}
