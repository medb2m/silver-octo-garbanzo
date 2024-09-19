import { Component, TemplateRef, ViewChild } from '@angular/core';
import { AccountService, RegionService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'delegations',
  templateUrl: './delegations.component.html',
  styleUrls: ['delegations.component.css']
})
export class DelegationsComponent {

  @ViewChild('userPopup') popupTemplate!: TemplateRef<any>;
  @ViewChild('userInfoPopup') userInfoPopup!: TemplateRef<any>;

  selectedUserId!: string ; 
  
  delegations: any[] = []
  selectedRegion: any;

  selectedDelegation: any; // New property to track the selected delegation

  showComponents = true; // Initialize to true initially

  filteredDelegations: any[] = [];
  users: any[] = [];

  regionId : any

  
  constructor(
    private regionService: RegionService,
    private accountService: AccountService,
    private modalService: NgbModal
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
  
  
  openUserPopup(region: any): void {
    this.selectedRegion = region;
    // Fetch users (moderators and workers) for the selected region
    this.accountService.getModeratorByRegion(region._id).subscribe((users : any) => {
      this.users = users;
      console.log('users : ' + this.users )
      // Code to open the pop-up (can use a UI library like Angular Material for the modal)
      this.modalService.open(this.popupTemplate, { size: 'lg' });
    });
  }

  // Close reporters popup
  closeUserPopup() {
    this.users = [];
    this.modalService.dismissAll();
  }
  

  // Handle the event when a moderator is selected
  onModeratorSelected(userId: string) {
    this.selectedUserId = userId;
    // Open the user-info pop-up
    this.modalService.open(this.userInfoPopup, { size: 'lg' });
  }
}