import { Component, EventEmitter, Output, TemplateRef, ViewChild } from '@angular/core';
import { RegionService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WorkersComponent } from '../workers/workers.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'cities',
  standalone : true,
  imports: [CommonModule,WorkersComponent],
  templateUrl: './cities.component.html',
  styleUrls: ['cities.component.css']
})
export class CitiesComponent {

  @ViewChild('workersPopup') popupTemplate!: TemplateRef<any>;
  selectedCity: any = null;
  
  cities: any[] = []
  selectedDelegation: any;

  delegationId : any

  

  @Output() openReport = new EventEmitter<string>();

  showComponents = true; // Initialize to true initially

  constructor(
    private regionService: RegionService,
    private modalService: NgbModal,
    private router: Router
  ) {}

    toggleComponents(): void {
        this.showComponents = !this.showComponents;
    }

  filteredCities: any[] = [];

  filterCities(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredCities = this.cities.filter(city =>
      city.name.toLowerCase().includes(searchTerm)
    );
  }


  

  ngOnInit(): void {
    this.regionService.selectedDelegation$.subscribe(delegation => {
        this.selectedDelegation = delegation;
        if (delegation) {
          this.fetchCities(delegation._id);
        }
      });
  }

  fetchCities(delegationId: string): void {
    this.regionService.getCitiesBydelegation(delegationId).subscribe(cities => {
      this.cities = cities;
      this.filteredCities = cities
    });
  }

  selectCity(city: any) {
    // Emit the selected city to the parent component
    this.selectedCity = city;
    this.regionService.setSelectedCity(city);
  }


  openWorkersPopup(city: any) {
    this.selectedCity = city;
    this.modalService.open(this.popupTemplate, { size: 'lg' });
  }

  closePopup() {
    this.modalService.dismissAll();
  }

  /* openReports(city : any){
    this.openReport.emit(city); 
    this.router.navigate([`/admin/dashboard/reports`])
  } */

    openReports(city: any) {
      this.router.navigate([`/admin/dashboard/reports`, city._id], { queryParams: { type: 'city' } });
    }
    
}