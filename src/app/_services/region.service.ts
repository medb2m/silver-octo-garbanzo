import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RegionService {
  private apiUrl = `${environment.apiUrl}/places`;

  private selectedRegionSubject = new BehaviorSubject<any>(null);
  selectedRegion$ = this.selectedRegionSubject.asObservable();

  private selectedDelegationSubject = new BehaviorSubject<any>(null);
  selectedDelegation$ = this.selectedDelegationSubject.asObservable();

  private selectedCitySubject = new BehaviorSubject<any>(null);
  selectedCity$ = this.selectedCitySubject.asObservable();

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<any[]>(`${this.apiUrl}/regions`);
  }

  getById(id: string) {
    return this.http.get<any>(`${this.apiUrl}/regions/${id}`);
  }

  create(params: any) {
    return this.http.post(`${this.apiUrl}/regions`, params);
  }

  update(id: string, params: any) {
    return this.http.put(`${this.apiUrl}/regions/${id}`, params);
  }

  delete(id: string) {
    return this.http.delete(`${this.apiUrl}/regions/${id}`);
  }

  getDelegationById(id: string) {
    return this.http.get<any>(`${this.apiUrl}/delegations/${id}`);
  }

  getDelegations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/delegations`);
  }

  createDelegation(delegation: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/delegations`, delegation);
  }

  updateDelegation(delegationId: string, delegation: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/delegations/${delegationId}`, delegation);
  }

  deleteDelegation(delegationId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delegations/${delegationId}`);
  }

  getCityById(id: string) {
    return this.http.get<any>(`${this.apiUrl}/cities/${id}`);
  }

  getCities(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cities`);
  }

  createCity(city: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/cities`, city);
  }

  updateCity(cityId: string, city: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/cities/${cityId}`, city);
  }

  deleteCity(cityId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/cities/${cityId}`);
  }

  // associations with places

  addWorker(cityId: string, workerId : string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/cities/worker/${cityId}/${workerId}`, '');
  }

  removeWorker(cityId: string, workerId : string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/cities/remworker/${cityId}/${workerId}`, '');
  }

  // fetch for dashboard
  getDelegationsByRegion(regionId : any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/delegations/region/${regionId}`);
  }

  getCitiesBydelegation(delegId : any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cities/delegation/${delegId}`);
  }


  // get reporters by cityID
  getReportersByCityId(cityId : any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cities/reporters/${cityId}`);
  }

  addModerator(regionId: string, moderatorId: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/regions/moderator/${regionId}/${moderatorId}`, '');
  }

  removeModerator(regionId: string, moderatorId: string): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/regions/removemoderator/${regionId}/${moderatorId}`, '');
  }

  


  setSelectedRegion(region: any) {
    this.selectedRegionSubject.next(region);
  }

  setSelectedDelegation(delegation: any) {
    this.selectedDelegationSubject.next(delegation);
  }

  setSelectedCity(city: any) {
    this.selectedCitySubject.next(city);
  }

}