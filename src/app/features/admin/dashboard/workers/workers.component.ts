import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RegionService } from '@app/_services';
import { ReportService } from '@app/_services';


@Component({
  selector: 'workers',
  templateUrl: './workers.component.html',
  styleUrls: ['workers.component.css']
})
export class WorkersComponent {
  workers: any[] = []
  selectedCity: any;

  cityId : any

  filteredWorkers: any[] = [];

  filterWorkers(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredWorkers = this.workers.filter(worker =>
      worker.fullName.toLowerCase().includes(searchTerm)
    );
  }

  


  constructor(
    private regionService: RegionService,
    private reportService: ReportService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.regionService.selectedCity$.subscribe(city => {
        this.selectedCity = city;
        if (city) {
          this.fetchWorkers(city._id);
        }
      });
  }

  fetchWorkers(cityId: string): void {
    this.regionService.getWorkers(cityId).subscribe(workers => {
      this.workers = workers;
      this.filteredWorkers = workers
      this.checkReportsForWorkers();
    });
  }

  checkReportsForWorkers(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate comparison

    this.workers.forEach(worker => {
      console.log('id worker is '+ worker.id)
      this.reportService.getReportsByWorker(worker.id).subscribe(reports => {
        console.log('worker report' + reports)
        worker.postedReport = reports.some(report => {
          console.log('date of a report is '+ report.date)
          const reportDate = new Date(report.date);
          return reportDate.getTime() !== today.getTime();
        });
      });
    });
  }

  gotoWorkerReports(id : string){
    this.router.navigate([`/admin/dashboard/reports/${id}`])
  }

  goto(){
    this.router.navigate(['/admin/accounts/add/user'], { queryParams: { cityId: this.selectedCity._id } })
  }


  goToAddUser(): void {
    console.log('selected city ' + this.selectedCity._id)
    this.router.navigate(['/admin/accounts/add/user'], { queryParams: { cityId: this.selectedCity._id } });
    if (this.selectedCity) {
        this.router.navigate(['/admin/accounts/add'], { queryParams: { cityId: this.selectedCity._id } });
    }
  }
  
}