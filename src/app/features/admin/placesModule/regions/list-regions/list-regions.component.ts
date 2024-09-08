import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import { AlertService, RegionService } from '@app/_services';

@Component({
  selector: 'app-list-regions-admin',
  templateUrl: './list-regions.component.html',
  styleUrls: ['./list-regions.component.css']
})
export class ListRegionsComponent {
  regions?: any[] = [];
  searchText = '';

  // Pagination 
  currentPage = 1;
  itemsPerPage = 10; // Set the number of items per page

  constructor(
    private regionService: RegionService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.regionService.getAll()
      .pipe(first())
      .subscribe((regions: any[]) => this.regions = regions);
  }

  deleteRegion(id: string) {
    const region = this.regions!.find(x => x._id === id);
    region.isDeleting = true
    this.regionService.delete(id)
      .pipe(first())
      .subscribe(() => {
        this.regions = this.regions!.filter(x => x._id !== id);
        this.alertService.success('Region deleted', { keepAfterRouteChange: true });
      })
  }

  getLen(delegations: []): number {
    return delegations.length
  }
}
