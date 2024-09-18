import { Component } from '@angular/core';
import { AccountService, RegionService } from '@app/_services';


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

  filteredDelegations: any[] = [];
  users: any[] = [];

  regionId : any

  
  constructor(
    private regionService: RegionService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.regionService.selectedRegion$.subscribe(region => {
        this.selectedRegion = region;
        if (region) {
          this.fetchDelegations(region._id);
        }
      });
  }

  toggleComponents(): void {
      this.showComponents = !this.showComponents;
  }

  filterDelegations(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredDelegations = this.delegations.filter(delegation =>
      delegation.name.toLowerCase().includes(searchTerm));
  }

  fetchDelegations(regionId: string): void {
      this.regionService.getDelegationsByRegion(regionId).subscribe(delegations => {
        this.delegations = delegations;
        this.filteredDelegations = delegations
      });
  }

  selectDelegation(delegation: any) {
      this.selectedDelegation = delegation;
      this.regionService.setSelectedDelegation(delegation);
  }
  
  
  openUserPopup(delegation: any): void {
    this.selectedDelegation = delegation;
    // Fetch users (moderators and workers) for the selected delegation
    this.accountService.getUsersByDelegation(delegation._id).subscribe((users: any) => {
      this.users = users;
      // Code to open the pop-up
    });
  }

  closeUserPopup(): void {
    this.users = [];
    // Code to close the pop-up
  }
}