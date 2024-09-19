import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Report } from '@app/_models';
import { ReportService } from '@app/_services/report.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.css']
})
export class ReportListComponent {

  @Input() cityId!: string;
  @Input() workerId!: string; // New Input for workerId
  @Output() reportSelected = new EventEmitter<string>();

  reports: Report[] = [];
  filteredReports: any[] = [];
  sortOrder: 'asc' | 'desc' = 'desc'; // default sort order
  workerMode: boolean = false;
  traiteFilter = 'Nontraited';
  title: string = 'List of Reports';
  id: any

  constructor(
    private reportService: ReportService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {}

  /* ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    if (this.workerId) {
      this.workerMode = true;
      this.title = 'Reports for Reporter';
      this.fetchWorkerReports(this.workerId);
    } else if (this.cityId) {
      this.title = 'Reports for City';
      this.fetchReportsByCity();
    } else if (this.id) {
      this.workerMode = true;
      this.title = 'Reports for Reporter';
      this.fetchWorkerReports(this.id);
    } else {
      this.title = 'All Reports';
      this.fetchAllReports();
    }
  } */

    ngOnInit() {
      this.route.paramMap.subscribe(params => {
        const idFromRoute = params.get('id');  // Read ID from the URL
        this.id = idFromRoute;
        
        this.route.queryParams.subscribe(queryParams => {
          const type = queryParams['type'];  // Read 'type' from query parameters
    
          if (type === 'city' && this.id) {
            this.cityId = this.id;
            this.title = 'Reports for City';
            this.fetchReportsByCity();
          } else if (type === 'worker' && this.id) {
            this.workerId = this.id;
            this.workerMode = true;
            this.title = 'Reports for Reporter';
            this.fetchWorkerReports(this.workerId);
          } else {
            this.title = 'All Reports';
            this.fetchAllReports();
          }
        });
      });
    }
    

  fetchReportsByCity() {
    this.reportService.getReportsByCity(this.cityId).subscribe((data: any) => {
      this.reports = data;
      this.filteredReports = [...this.reports];
    });
  }

  fetchWorkerReports(workerId: string) {
    this.reportService.getReportsByWorker(workerId).subscribe(data => {
      this.reports = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      this.filteredReports = [...this.reports];
    });
  }

  fetchAllReports() {
    this.reportService.getAllReports().subscribe(data => {
      this.reports = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      this.filteredReports = [...this.reports];
    });
  }

  filterReports(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredReports = this.reports.filter(report =>
      report.worker.fullName.toLowerCase().includes(searchTerm) ||
      report.worker.city.name.toLowerCase().includes(searchTerm)
    );
  }

  sortReports(event: Event) {
    const sortValue = (event.target as HTMLSelectElement).value as 'asc' | 'desc' | 'traited' | 'nontraited';
    
    if (sortValue === 'asc' || sortValue === 'desc') {
      this.filteredReports = this.filteredReports.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortValue === 'asc' ? dateA - dateB : dateB - dateA;
      });
    } else if (sortValue === 'traited') {
      this.filteredReports = this.reports.filter(report => report.traiter);
    } else if (sortValue === 'nontraited') {
      this.filteredReports = this.reports.filter(report => !report.traiter);
    }
  }
  

  filterReportsLast24Hours() {
    const now = new Date().getTime();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    this.filteredReports = this.reports.filter(report => {
      const reportDate = new Date(report.date).getTime();
      return reportDate >= oneDayAgo;
    });
  }

  gotoReport(id: string) {
    this.router.navigate([`/admin/dashboard/report/view/${id}`])
  }
}