import { Component } from '@angular/core';
import { RegionService } from '@app/_services';

@Component({ selector: 'layout-dashboard', templateUrl: 'layout.component.html' , styleUrls : ['layout.component.css'] })
export class LayoutComponent { 
    showComponents = true; // Initialize to true initially

    toggleComponents(): void {
        this.showComponents = !this.showComponents;
    }

  selectedRegion: any;
  selectedDelegation: any;
  selectedCity: any;

  constructor(private regionService: RegionService) { }

  ngOnInit() {
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
}