import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import { RegionService } from '@app/_services';

@Component({
  selector: 'app-list-cities-admin',
  templateUrl: './list-cities.component.html',
  styleUrls: ['./list-cities.component.css']
})
export class ListCitiesComponent {
  cities?: any[] = [];
  searchText = ''

  // Pagination 
  currentPage = 1;
  itemsPerPage = 10; // Set the number of items per page

  constructor(private regionService: RegionService ) { }

  ngOnInit() {
    this.regionService.getCities()
      .pipe(first())
      .subscribe((cities : any[]) => this.cities = cities)
  }

  deleteCity(id: string) {
    const city = this.cities!.find(x => x._id === id);
    city.isDeleting = true;
    this.regionService.deleteCity(id)
      .pipe(first())
      .subscribe(() => {
        this.cities = this.cities!.filter(x => x._id !== id);
      });
  }
  getLen(workers: []): number {
    return workers.length
  }
}
