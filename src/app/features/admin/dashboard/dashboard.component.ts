import { Component } from '@angular/core';
import { Account } from '@app/_models';
import { AccountService, RegionService } from '@app/_services';

import { Role } from '@app/_models';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  // initial declaration 
    account?: Account | null;
    selectedRegion: any;
    selectedDelegation: any;
    selectedCity: any;

    allRegions: any[] = [];
    allDelegations: any[] = [];
    allCities: any[] = [];
    searchResults: any[] = [];
  
  // toggle logic B
    showComponents = true; // Initialize to true initially

    toggleComponents(): void {
        this.showComponents = !this.showComponents;
    }
  // toggle logic E

  constructor(
    private regionService: RegionService,
    private accountService : AccountService
  ) { }

  ngOnInit() {
    this.accountService.account.subscribe(x => {
      this.account = x;

      // Check if the user is a moderator
      if (this.account && this.account.role === Role.Moderator) {
        this.hideRegionComponent();
        this.setModeratorRegion();
      }else {
        this.fetchAllData();
    }
    });


    this.regionService.selectedRegion$.subscribe(region => {
      this.selectedRegion = region;
      this.selectedDelegation = null;
      this.selectedCity = null;
    });
    
    this.regionService.selectedDelegation$.subscribe(delegation => {
      this.selectedDelegation = delegation;
      this.selectedCity = null;
    });

    this.regionService.selectedCity$.subscribe(city => {
      this.selectedCity = city;
    });
  }

  fetchAllData(): void {
    // Fetch all regions, delegations, cities, and workers for admin
    this.regionService.getAll().subscribe(regions => this.allRegions = regions);
    this.regionService.getDelegations().subscribe(delegations => this.allDelegations = delegations);
    this.regionService.getCities().subscribe(cities => this.allCities = cities);
}

  // Hide region component for moderators
  hideRegionComponent(): void {
    this.showComponents = false;
  }

  // Automatically set the moderator's region
  setModeratorRegion(): void {
    if (this.account && this.account.moderatorZone) {
      this.regionService.getById(this.account.moderatorZone).subscribe(region => {
        this.regionService.setSelectedRegion(region);
      });
    }
  }


  // Search bar logic 
    filteredResults: any[] = [];
      search(event: Event): void {
        const inputElement = event.target as HTMLInputElement;
        const term = inputElement.value;
        if (!term) {
          this.searchResults = [];
          return;
        }
        const lowerTerm = term.toLowerCase();
      
        // Filter regions, delegations, and cities
        const filteredRegions = this.allRegions.filter(region => region.name.toLowerCase().includes(lowerTerm));
        const filteredDelegations = this.allDelegations.filter(delegation => delegation.name.toLowerCase().includes(lowerTerm));
        const filteredCities = this.allCities.filter(city => city.name.toLowerCase().includes(lowerTerm));
      
        // Map and display cities with their associated region and delegation
        this.searchResults = [
          ...filteredRegions.map(region => ({ ...region, type: 'Region', hierarchy: region.name })),
          ...filteredDelegations.map(delegation => {
            const region = this.allRegions.find(r => r.id === delegation.regionId);
            return {
              ...delegation,
              type: 'Delegation',
              hierarchy: `${region?.name} > ${delegation.name}`,
            };
          }),
          ...filteredCities.map(city => {
            const delegation = this.allDelegations.find(d => d.id === city.delegationId);
            const region = this.allRegions.find(r => r.id === delegation?.regionId);
            return {
              ...city,
              type: 'City',
              hierarchy: `${region?.name} > ${delegation?.name} > ${city.name}`,
            };
          })
        ];
      }
      
        selectSearchResult(result: any): void {
          if (result.type === 'Region') {
              this.selectedRegion = result;
              this.regionService.setSelectedRegion(result);
          } else if (result.type === 'Delegation') {
              // Find and select the corresponding region first
              const associatedRegion = this.allRegions.find(region => region.id === result.regionId);
              if (associatedRegion) {
                  this.selectedRegion = associatedRegion;
                  this.regionService.setSelectedRegion(associatedRegion);
              }
              this.selectedDelegation = result;
              this.regionService.setSelectedDelegation(result);
          } else if (result.type === 'City') {
              // Find and select the corresponding delegation and region first
              const associatedDelegation = this.allDelegations.find(delegation => delegation.id === result.delegationId);
              if (associatedDelegation) {
                  const associatedRegion = this.allRegions.find(region => region.id === associatedDelegation.regionId);
                  if (associatedRegion) {
                      this.selectedRegion = associatedRegion;
                      this.regionService.setSelectedRegion(associatedRegion);
                  }
                  this.selectedDelegation = associatedDelegation;
                  this.regionService.setSelectedDelegation(associatedDelegation);
              }
              this.selectedCity = result;
              this.regionService.setSelectedCity(result);
          }
          // Hide search suggestions by clearing search results
          this.searchResults = [];
      }
      
}