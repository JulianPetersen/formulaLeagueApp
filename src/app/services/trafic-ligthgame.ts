import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalService } from './global';
import { TraficLigth } from '../models/trafic-ligth';

@Injectable({
  providedIn: 'root',
})
export class TraficLigthgameService {

  constructor(private http: HttpClient, private global: GlobalService) {

  }
  getToken(): string | null {
    return localStorage.getItem('tokenApp');
  }


  createNewRecord(data: TraficLigth) {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'authorization': `Bearer ${token}` || '',
    });
    return this.http.post(`${this.global.api}/api/trafficLightGameRoutes`, data, { headers })
  }


  getBestTimeByUser() {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'authorization': `Bearer ${token}` || '',
    })
    return this.http.get(`${this.global.api}/api/trafficLightGameRoutes/best-records`, { headers })
  }
}
