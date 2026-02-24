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

  createPrediction(raceId: string, data: PredictionsModel) {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'authorization': `Bearer ${token}` || '',
    });
    return this.http.post(`${this.global.api}/api/prediction/${raceId}`, data, { headers })
  }

  getMyPredictionByRace(raceId: string) {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'authorization': `Bearer ${token}` || '',
    });
    return this.http.get(`${this.global.api}/api/prediction/mi-prediction-by-race/${raceId}`, { headers })
  }

    getMyAllPredictions() {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'authorization': `Bearer ${token}` || '',
    });
    return this.http.get <PredictionsModel[]>(`${this.global.api}/api/prediction/mi-predictions`, { headers })
  }
}
