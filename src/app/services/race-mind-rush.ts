import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalService } from './global';
import {
  CreateRaceMindRushRecord,
  RaceMindRushRecord,
  RaceMindRushRecordResponse,
  RaceMindRushRewardStatus
} from '../models/race-mind-rush';

@Injectable({
  providedIn: 'root'
})
export class RaceMindRushService {

  constructor(private http: HttpClient, private global: GlobalService) { }

  getToken(): string | null {
    return localStorage.getItem('tokenApp');
  }

  getHeaders() {
    const token = this.getToken();
    return new HttpHeaders({
      authorization: `Bearer ${token}` || ''
    });
  }

  createNewRecord(data: CreateRaceMindRushRecord) {
    return this.http.post<RaceMindRushRecordResponse>(`${this.global.api}/api/raceMindRush`, data, {
      headers: this.getHeaders()
    });
  }

  getBestRecords() {
    return this.http.get<RaceMindRushRecord[]>(`${this.global.api}/api/raceMindRush/best-records`, {
      headers: this.getHeaders()
    });
  }

  getMyBestRecord() {
    return this.http.get<RaceMindRushRecord>(`${this.global.api}/api/raceMindRush/me`, {
      headers: this.getHeaders()
    });
  }

  getRewardStatus() {
    return this.http.get<RaceMindRushRewardStatus>(`${this.global.api}/api/raceMindRush/reward-status`, {
      headers: this.getHeaders()
    });
  }
}
