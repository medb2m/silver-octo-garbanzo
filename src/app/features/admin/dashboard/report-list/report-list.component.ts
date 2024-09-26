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
  @Input() workerId!: string;
  @Output() reportSelected = new EventEmitter<string>();

  reports: Report[] = [];
  filteredReports: any[] = [];
  sortOrder: 'asc' | 'desc' = 'desc';
  sortField: string = 'date'; // Default sorting by date
  workerMode: boolean = false;
  id : any
  uniqueRegions: string[] = [];
  selectedRegions: string[] = [];

  // Pagination 
  currentPage = 1;
  itemsPerPage = 20; // Set the number of items per page

  constructor(
    private reportService: ReportService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    // Fetch reports based on cityId, workerId, or all
    this.route.paramMap.subscribe(params => {
      const idFromRoute = params.get('id');
      this.id = idFromRoute;
      
      this.route.queryParams.subscribe(queryParams => {
        const type = queryParams['type'];

        if (type === 'city' && this.id) {
          this.cityId = this.id;
          this.fetchReportsByCity();
        } else if (type === 'worker' && this.id) {
          this.workerId = this.id;
          //this.workerMode = true;
          this.fetchWorkerReports(this.workerId);
        } else {
          this.fetchAllReports();
        }
      });
    });

    // work 
    this.locations = this.reports.map(report => `${report.region.name} / ${report.delegation.name} / ${report.city.name}`);
    this.filteredLocations = [...this.locations];
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
    /* this.reportService.getAllReports().subscribe(data => {
      console.log(data)
      this.reports = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      this.filteredReports = [...this.reports];
    }); */
    this.reportService.getAllReports().subscribe(data => {
      this.reports = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      this.filteredReports = [...this.reports];
      this.uniqueRegions = [...new Set(this.reports.map(report => report.region.name))];  // Extract unique regions
    });
  }

  toggleRegionFilter(region: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.selectedRegions.push(region);  // Add the region to the filter list
    } else {
      this.selectedRegions = this.selectedRegions.filter(r => r !== region);  // Remove the region from the filter list
    }

    this.filterReportsByRegion();
  }

  filterReportsByRegion() {
    if (this.selectedRegions.length === 0) {
      this.filteredReports = [...this.reports];  // No regions selected, show all reports
    } else {
      this.filteredReports = this.reports.filter(report => this.selectedRegions.includes(report.region.name));
    }
  }

  filterReports(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredReports = this.reports.filter(report => {
      return (
        report.worker.fullName.toLowerCase().includes(searchTerm) ||
        report.city.name.toLowerCase().includes(searchTerm) ||
        report.region.name.toLowerCase().includes(searchTerm) ||
        report.delegation.name.toLowerCase().includes(searchTerm) ||
        report.content.toLowerCase().includes(searchTerm) ||  
        (report.traiter ? 'treated' : 'non-treated').includes(searchTerm) // Search by treated status
      );
    });
  }

  sortReports(event: Event) {
    const sortValue = (event.target as HTMLSelectElement).value as 'asc' | 'desc' | 'traited' | 'nontraited';
    this.sortField = 'date'; // Default sorting field is date

    if (sortValue === 'asc' || sortValue === 'desc') {
      this.sortOrder = sortValue;
      this.sortBy(this.sortField); // Apply sorting to date column
    } else if (sortValue === 'traited') {
      this.filteredReports = this.reports.filter(report => report.traiter);
    } else if (sortValue === 'nontraited') {
      this.filteredReports = this.reports.filter(report => !report.traiter);
    }
  }

  sortBy(field: string) {
    this.sortField = field;
    this.filteredReports.sort((a, b) => {
      let valA, valB;
  
      if (field === 'date') {
        valA = new Date(a[field]).getTime();
        valB = new Date(b[field]).getTime();
      } else {
        valA = a[field]?.toString().toLowerCase();
        valB = b[field]?.toString().toLowerCase();
      }
  
      if (this.sortOrder === 'asc') {
        return valA > valB ? 1 : -1;
      } else {
        return valA < valB ? 1 : -1;
      }
    });
  }

  gotoReport(id: string) {
    this.router.navigate([`/admin/dashboard/report/view/${id}`]);
  }


  // work 
  filteredLocations: string[] = [];
  locations: string[] = [];

  filterDropdown(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredLocations = this.locations.filter(location => location.toLowerCase().includes(searchTerm));
  }

  selectLocation(item: string) {
    // Logic to filter reports based on the selected location from the dropdown
    const [region, delegation, city] = item.split(' / ');
    this.filteredReports = this.reports.filter(report => 
      report.region.name === region && 
      report.delegation.name === delegation && 
      report.city.name === city
    );
  }

}