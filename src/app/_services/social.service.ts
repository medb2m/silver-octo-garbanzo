import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Social } from '@app/_models';


@Injectable({ providedIn: 'root' })
export class SocialService {
  private apiUrl = `${environment.apiUrl}/social`;

  constructor(private http: HttpClient) {}

  createSocial(socialData: FormData) {
    return this.http.post<Social>(`${this.apiUrl}/add`, socialData);
  }

  update(socialId : string, socialData: FormData) {
    return this.http.put<Social>(`${this.apiUrl}/update/${socialId}`, socialData);
  }

  getAllSocials(){
    return this.http.get<Social[]>(`${this.apiUrl}`)
  }

  getSocialById(socialId : any){
    return this.http.get<Social>(`${this.apiUrl}/${socialId}`)
  }

  traiteSocial(socialId: string){
    return this.http.put<Social>(`${this.apiUrl}/traite/${socialId}`, '')
  }

  deleteSocial(socialId: string){
    return this.http.delete<any>(`${this.apiUrl}/delete/${socialId}`)
  }
}