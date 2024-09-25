import { Component, Input, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
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
  @Input() selectedRegion: any;

  selectedUserId!: string ; 
  
  delegations: any[] = []
  //selectedRegion: any;

  selectedDelegation: any; // New property to track the selected delegation

  showComponents = true; // Initialize to true initially

  filteredDelegations: any[] = [];
  users: any[] = [];

  regionId : any

  
  constructor(
    private regionService: RegionService,
    private accountService: AccountService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.regionService.selectedRegion$.subscribe(region => {
        this.selectedRegion = region;
        if (region) {
          this.fetchDelegations(region._id);
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    // Watch for changes in selectedRegion
    if (changes['selectedRegion'] && changes['selectedRegion'].currentValue) {
      this.fetchDelegations(this.selectedRegion._id);
    }
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
      console.log('la deleg '+ delegation._id)
      this.regionService.setSelectedDelegation(delegation);
  }
  
  
  openUserPopup(delegation: any): void {
    this.selectedDelegation = delegation;
    this.modalService.open(this.popupTemplate, { size: 'lg' });
  }

  addDelegationModerator(): void {
    this.router.navigate(['/admin/accounts/add/delmod'], { queryParams: { delegationId: this.selectedDelegation._id }});
    this.modalService.dismissAll()
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