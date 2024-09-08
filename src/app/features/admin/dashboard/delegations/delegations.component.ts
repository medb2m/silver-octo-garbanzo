import { Component } from '@angular/core';
import { RegionService } from '@app/_services';


@Component({
  selector: 'delegations',
  templateUrl: './delegations.component.html',
  styleUrls: ['delegations.component.css']
})
export class DelegationsComponent {
  
  delegations: any[] = []
  selectedRegion: any;

  selectedDelegation: any; // New property to track the selected delegation

  showComponents = true; // Initialize to true initially

    toggleComponents(): void {
        this.showComponents = !this.showComponents;
    }

  filteredDelegations: any[] = [];

  filterDelegations(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredDelegations = this.delegations.filter(delegation =>
      delegation.name.toLowerCase().includes(searchTerm)
    );
  }
  regionId : any

  constructor(
    private regionService: RegionService
  ) {}

  ngOnInit(): void {
    this.regionService.selectedRegion$.subscribe(region => {
        this.selectedRegion = region;
        console.log('selected region is ' +this.selectedRegion)
        if (region) {
          this.fetchDelegations(region._id);
        }
      });
  }

  fetchDelegations(regionId: string): void {
    this.regionService.getDelegationsByRegion(regionId).subscribe(delegations => {
      this.delegations = delegations;
      this.filteredDelegations = delegations
    });
  }

  selectDelegation(delegation: any) {
    // Emit the selected delegation to the parent component
    this.selectedDelegation = delegation;
    this.regionService.setSelectedDelegation(delegation);
  }


  
}