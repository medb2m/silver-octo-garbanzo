import { Component } from '@angular/core';
import { Account } from '@app/_models';
import { AccountService, RegionService } from '@app/_services';

import { Role } from '@app/_models';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { TranslateService } from '@ngx-translate/core';
import { DashboardService } from '@app/_services/dashboard.service';





@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

    selectedRegionId?: string;

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
    private accountService : AccountService,
    private router: Router,
    private translate: TranslateService,
  ) {}

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

  ngOnDestroy() {
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

  
}