import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RegionService } from '@app/_services';
import { ReportService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserInfoComponent } from '../user-info/user-info.component';


@Component({
  selector: 'app-workers',
  standalone: true,
  imports: [CommonModule, UserInfoComponent],
  templateUrl: './workers.component.html',
  styleUrls: ['workers.component.css']
})
export class WorkersComponent {
  @Input() selectedCity!: string;
  workers: any[] = []
  //selectedCity: any;

  selectedWorkerId!: string;
  filteredWorkers: any[] = [];

  @ViewChild('workerInfoPopup') workerInfoPopup!: TemplateRef<any>;

  


  filterWorkers(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredWorkers = this.workers.filter(worker =>
      worker.fullName.toLowerCase().includes(searchTerm)
    );
  }

  


  constructor(
    private regionService: RegionService,
    private reportService: ReportService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
      this.fetchWorkers(this.selectedCity)
  }

  // Open worker info popup
  openWorkerInfo(workerId: string): void {
    this.selectedWorkerId = workerId;
    this.modalService.open(this.workerInfoPopup, { size: 'lg' });
  }

  closeWorkerInfoPopup(): void {
    this.modalService.dismissAll();
  }

  // Redirect to worker reports
  gotoWorkerReports(workerId: string): void {
    this.router.navigate([`/admin/dashboard/reports/${workerId}`]);
    this.modalService.dismissAll()
  }

  // Add worker for the current city
  addWorker(): void {
    this.router.navigate(['/admin/accounts/add/user'], { queryParams: { cityId: this.selectedCity } });
    this.modalService.dismissAll()
  }


  fetchWorkers(cityId: string): void {
    this.regionService.getReportersByCityId(cityId).subscribe(workers => {
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


  goto(){
    this.router.navigate(['/admin/accounts/add/user'], { queryParams: { cityId: this.selectedCity } })
  }


  goToAddUser(): void {
    console.log('selected city ' + this.selectedCity)
    this.router.navigate(['/admin/accounts/add/user'], { queryParams: { cityId: this.selectedCity } });
    if (this.selectedCity) {
        this.router.navigate(['/admin/accounts/add'], { queryParams: { cityId: this.selectedCity } });
    }
  }
}