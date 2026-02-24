import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalService } from './global';
import { RaceModel } from '../models/race-model';

@Injectable({
  providedIn: 'root',
})
export class RacesServices {
  

  constructor(private http: HttpClient, public global: GlobalService){

  }

    getToken(): string | null {

    return localStorage.getItem('tokenApp');
  }

  getAllRaces() {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'authorization': `Bearer ${token}` || '',
    });
    return this.http.get<RaceModel[]>(`${this.global.api}/api/race`, { headers });
  }

    getAllRacesLista() {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'authorization': `Bearer ${token}` || '',
    });
    return this.http.get<RaceModel[]>(`${this.global.api}/api/race/lista`, { headers });
  }

  getAllRacesUpcoming() {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'authorization': `Bearer ${token}` || '',
    });
    return this.http.get<RaceModel[]>(`${this.global.api}/api/race/upcoming`, { headers });
  }
}

