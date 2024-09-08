import { Component } from '@angular/core';
import { RegionService } from '@app/_services';


@Component({
  selector: 'cities',
  templateUrl: './cities.component.html',
  styleUrls: ['cities.component.css']
})
export class CitiesComponent {
  
  cities: any[] = []
  selectedDelegation: any;

  delegationId : any

  selectedCity : any

  showComponents = true; // Initialize to true initially

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


  constructor(
    private regionService: RegionService
  ) {}

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


  
}