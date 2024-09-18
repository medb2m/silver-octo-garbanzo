import { Component, TemplateRef, ViewChild } from '@angular/core';
import { RegionService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'cities',
  templateUrl: './cities.component.html',
  styleUrls: ['cities.component.css']
})
export class CitiesComponent {

  @ViewChild('Popup') popupTemplate!: TemplateRef<any>;
  selectedCity: any = null;
  
  cities: any[] = []
  selectedDelegation: any;

  delegationId : any


  showComponents = true; // Initialize to true initially

  constructor(
    private regionService: RegionService,
    private modalService: NgbModal,
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


  openReportersPopup(city : any){
    this.selectedCity = city;
    this.modalService.open(this.popupTemplate, { size: 'lg' });
  }

  // Close reporters popup
  closePopup() {
    this.modalService.dismissAll();
  }

  // View a report from the popup
  viewReport(reportId: string) {
    this.modalService.dismissAll();
    // Navigate to the report view component here
  }
}