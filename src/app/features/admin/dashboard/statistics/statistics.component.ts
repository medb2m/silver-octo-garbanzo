import { Component } from '@angular/core';
import { ReportService } from '@app/_services';
import { DashboardService } from '@app/_services/dashboard.service';
import { BarController, BarElement, CategoryScale, Chart, LinearScale, registerables } from 'chart.js';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})
export class StatisticsComponent {
    chart: any;
  
    constructor(private reportService: ReportService) {
      Chart.register(...registerables);
    }
  
    ngOnInit(): void {
      // Use static data instead of fetching from the service
      const staticData = [
        { name: 'تونس', count: 21 },
        { name: 'أريانة', count: 7 },
        { name: 'منوبة', count: 8 },
        { name: 'بن عروس', count: 12 },
        { name: 'نابل', count: 16 },
        { name: 'بنزرت', count: 15 },
        { name: 'زغوان', count: 5 },
        { name: 'سوسة', count: 16 },
        { name: 'المنستير', count: 13 },
        { name: 'المهدية', count: 11 },
        { name: 'صفاقس', count: 16 },
        { name: 'باجة', count: 9 },
        { name: 'جندوبة', count: 9 },
        { name: 'الكاف', count: 12 },
        { name: 'سليانة', count: 11 },
        { name: 'القيروان', count: 13 },
        { name: 'سيدي بوزيد', count: 14 },
        { name: 'القصرين', count: 12 },
        { name: 'قابس', count: 11 },
        { name: 'مدنين', count: 9 },
        { name: 'قفصة', count: 13 },
        { name: 'توزر', count: 6 },
        { name: 'تطاوين', count: 8 },
        { name: 'قبلي', count: 7 }
      ];
  
      this.createChart(staticData);
    }
  
    createChart(reportData: any) {
      const regionNames = reportData.map((region: any) => region.name);
      const reportCounts = reportData.map((region: any) => region.count);
  
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
