import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Report } from '@app/_models';
import { ReportService } from '@app/_services/report.service';


@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.css']
})
export class ReportListComponent {
  reports : Report[] = []
  filteredReports: any[] = [];
  sortOrder: 'asc' | 'desc' = 'desc'; // default sort order
  workerMode : boolean = false

  traiteFilter = 'Nontraited'


  constructor(
    private reportService: ReportService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')
    if (id){
      this.workerMode = true
      this.fetchWorkerReports(id)
    } else {
      this.fetchAllReports()
    }
  }

  fetchWorkerReports(id : string) {
    this.reportService.getReportsByWorker(id).subscribe(data => {
      this.reports = data.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA; // Sort by descending order
      })
      this.filteredReports = [...this.reports]; // Initialize filteredReports
    })
  }

  showAllreports(){
    this.filteredReports = this.reports
  }

  fetchAllReports(){
    this.reportService.getAllReports().subscribe(data => {
      this.reports = data.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA; // Sort by descending order
      })
      this.filteredReports = [...this.reports]; // Initialize filteredReports
    })
  }

  
  filterBytraite(){
    if (this.traiteFilter === 'Nontraited'){
      this.filteredReports = this.reports.filter(report => report.traiter === false)
      this.traiteFilter = 'Traited'
    } else {
      this.filteredReports = this.reports.filter(report => report.traiter === true)
      this.traiteFilter = 'Nontraited'
    }
  }

  filterReports(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredReports = this.reports.filter(report =>
      report.worker.fullName.toLowerCase().includes(searchTerm) ||
      report.worker.city.name.toLowerCase().includes(searchTerm)
    );
  }

  sortReports(order: 'asc' | 'desc') {
    this.sortOrder = order;
    this.filteredReports = this.filteredReports.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }

  filterReportsLast24Hours() {
    const now = new Date().getTime();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    this.filteredReports = this.reports.filter(report => {
      const reportDate = new Date(report.date).getTime();
      return reportDate >= oneDayAgo;
    });
  }

  gotoReport(id : string){
    this.router.navigate([`/admin/dashboard/report/view/${id}`])
  }

}