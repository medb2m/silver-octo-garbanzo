import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import { RegionService } from '@app/_services';

@Component({
  selector: 'app-list-delegations-admin',
  templateUrl: './list-delegations.component.html',
  styleUrls: ['./list-delegations.component.css']
})
export class ListDelegationsComponent {
  delegations?: any[] = [];
  searchText = ''

  // Pagination 
  currentPage = 1;
  itemsPerPage = 10; // Set the number of items per page

  constructor(private regionService: RegionService, ) { }

  ngOnInit() {
    this.regionService.getDelegations()
      .pipe(first())
      .subscribe((delegations : any[]) => this.delegations = delegations)
  }

  deleteDelegation(id: string) {
    // console.log('le ID : ',id)
    const delegation = this.delegations!.find(x => x._id === id);
    delegation.isDeleting = true;
    this.regionService.deleteDelegation(id)
      .pipe(first())
      .subscribe(() => {
        this.delegations = this.delegations!.filter(x => x._id !== id);
      });
  }
  getLen(cities: []): number {
    return cities.length
  }
}
