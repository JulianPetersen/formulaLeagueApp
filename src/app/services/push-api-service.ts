import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './global';

@Injectable({
  providedIn: 'root'
})
export class PushApiService {

  private baseUrl = '/api/push';

  constructor(private http: HttpClient,private global:GlobalService) {}

  saveToken(token: string) {
    return this.http.post(`${this.global.api}/api/push-notification/save-token`, { token });
  }

  deleteToken(token: string) {
    return this.http.post(`${this.global.api}/api/push-notification/delete-token`, { token });
  }
}