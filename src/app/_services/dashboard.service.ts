import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService {
    private baseUrl = `${environment.apiUrl}/dashboard`;

    constructor(private http: HttpClient) { }

    getDashboardData(){
        return this.http.get(this.baseUrl);
    }

    private regionSelectedSource = new Subject<string>();
  regionSelected$ = this.regionSelectedSource.asObservable();

  selectRegion(regionId: string) {
    console.log('Service: Selected region:', regionId);
    this.regionSelectedSource.next(regionId); // Notify subscribers about the selected region
}
}