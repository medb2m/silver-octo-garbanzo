import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Notification } from '@app/_models';
import { SocialNotification } from '@app/_models';


@Injectable({ providedIn: 'root' })
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/notification`;

  constructor(private http: HttpClient) {}

  getNotifications() : Observable<Notification[]>{
    return this.http.get<Notification[]>(`${this.apiUrl}`)
  }

  setNotificationRead(id : string): Observable<Notification> {
    return this.http.put<Notification>(`${this.apiUrl}/read/${id}`, {isRead : true})
  }

  getSocialNotifications() : Observable<SocialNotification[]>{
    return this.http.get<SocialNotification[]>(`${this.apiUrl}/social`)
  }

  setSocialNotificationRead(id : string): Observable<SocialNotification> {
    return this.http.put<SocialNotification>(`${this.apiUrl}/social/read/${id}`, {isRead : true})
  }
}