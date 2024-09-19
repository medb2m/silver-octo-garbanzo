import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Report } from '@app/_models';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class ReportService {
  private apiUrl = `${environment.apiUrl}/report`;

  constructor(private http: HttpClient) {}

  createReport(reportData: FormData) {
    return this.http.post<Report>(`${this.apiUrl}/add`, reportData);
  }

  getReportsByWorker(workerId: string) {
    return this.http.get<Report[]>(`${this.apiUrl}/worker/${workerId}`);
  }

  getAllReports(){
    return this.http.get<Report[]>(`${this.apiUrl}`)
  }

  getReportById(reportId : any){
    return this.http.get<Report>(`${this.apiUrl}/${reportId}`)
  }

  traiteReport(reportId: string){
    return this.http.put<Report>(`${this.apiUrl}/traite/${reportId}`, '')
  }


  getReportsByCity(cityId: string): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.apiUrl}/city/${cityId}`);
  }

  getReportsByRegion() : Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/region/rbr`);
}
}
