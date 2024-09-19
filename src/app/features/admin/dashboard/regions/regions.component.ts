import { Component, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { AccountService, RegionService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'regions',
  templateUrl: './regions.component.html',
  styleUrls: ['regions.component.css']
})
export class RegionsComponent {

  @ViewChild('userPopup') popupTemplate!: TemplateRef<any>;
  @ViewChild('userInfoPopup') userInfoPopup!: TemplateRef<any>;

  selectedUserId!: string ; 
  
  regions: any[] = []
  filteredRegions: any[] = [];
  selectedRegion : any

  showComponents = true; 
  users: any[] = [];

    toggleComponents(): void {
        this.showComponents = !this.showComponents;
    }


  constructor(
    private regionService: RegionService,
    private accountService: AccountService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.fetchRegions();
  }


  fetchRegions(): void {
    this.regionService.getAll().subscribe(regions => {
      this.regions = regions;
      this.filteredRegions = regions;
    });
  }

  filterRegions(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredRegions = this.regions.filter(region =>
      region.name.toLowerCase().includes(searchTerm)
    );
  }
  

  selectRegion(region: any) {
    this.selectedRegion = region;
    this.regionService.setSelectedRegion(region);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedRegion'] && changes['selectedRegion'].currentValue) {
        this.selectedRegion = changes['selectedRegion'].currentValue;
    }
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

  closePopup() {
    this.modalService.dismissAll();
  }

}