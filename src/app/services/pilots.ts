import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalService } from './global';

@Injectable({
  providedIn: 'root',
})
export class PilotsService {
  

  constructor(private http:HttpClient, private global:GlobalService){

  }


    getToken(): string | null {
    return localStorage.getItem('tokenApp');
  }


    getRankingPilots() {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'authorization': `Bearer ${token}` || '',
    });
    return this.http.get(`${this.global.api}/api/pilot/getrankingpilots`, { headers })
  }

}
