import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalService } from './global';
import { PilotsModel } from '../models/pilots-model';
import { PredictionsModel } from '../models/predictions';

@Injectable({
  providedIn: 'root',
})
export class PredictionsService {
  constructor(private http: HttpClient, public global: GlobalService) {

  }

  getToken(): string | null {
    return localStorage.getItem('tokenApp');
  }

  createPrediction(raceId:string, data: PredictionsModel) {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'authorization': `Bearer ${token}` || '',
    });
    return this.http.post(`${this.global.api}/api/prediction/${raceId}`, data, { headers })
  }
}
