import { Component, SimpleChanges } from '@angular/core';
import { RegionService } from '@app/_services';


@Component({
  selector: 'regions',
  templateUrl: './regions.component.html',
  styleUrls: ['regions.component.css']
})
export class RegionsComponent {
  
  regions: any[] = []
  filteredRegions: any[] = [];

  //regionId : any

  showComponents = true; // Initialize to true initially

    toggleComponents(): void {
        this.showComponents = !this.showComponents;
    }


  constructor(
    private regionService: RegionService
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
  selectedRegion : any

  selectRegion(region: any) {
    // Emit the selected region to the parent component
    this.selectedRegion = region;
    this.regionService.setSelectedRegion(region);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedRegion'] && changes['selectedRegion'].currentValue) {
        this.selectedRegion = changes['selectedRegion'].currentValue;
    }
  }

}