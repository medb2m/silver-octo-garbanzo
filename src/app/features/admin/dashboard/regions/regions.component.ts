import { Component, SimpleChanges } from '@angular/core';
import { AccountService, RegionService } from '@app/_services';


@Component({
  selector: 'regions',
  templateUrl: './regions.component.html',
  styleUrls: ['regions.component.css']
})
export class RegionsComponent {
  
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
    private accountService: AccountService
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
    this.accountService.getUsersByRegion(region._id).subscribe((users : any) => {
      this.users = users;
      // Code to open the pop-up (can use a UI library like Angular Material for the modal)
    });
  }

  closeUserPopup(): void {
    this.users = [];
    // Code to close the pop-up
  }

}