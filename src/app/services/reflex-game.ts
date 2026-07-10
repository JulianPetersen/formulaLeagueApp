import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalService } from './global';
import { CreateReflexGameRecord, ReflexGameRecord } from '../models/reflex-game';

@Injectable({
  providedIn: 'root'
})
export class ReflexGameService {

  constructor(private http: HttpClient, private global: GlobalService) { }

  getToken(): string | null {
    return localStorage.getItem('tokenApp');
  }

  getHeaders() {
    const token = this.getToken();
    return new HttpHeaders({
      'authorization': `Bearer ${token}` || ''
    });
  }

  createNewRecord(data: CreateReflexGameRecord) {
    return this.http.post<ReflexGameRecord>(`${this.global.api}/api/reflexGame`, data, {
      headers: this.getHeaders()
    });
  }

  getBestRecords() {
    return this.http.get<ReflexGameRecord[]>(`${this.global.api}/api/reflexGame/best-records`, {
      headers: this.getHeaders()
    });
  }

  getMyBestRecord() {
    return this.http.get<ReflexGameRecord>(`${this.global.api}/api/reflexGame/me`, {
      headers: this.getHeaders()
    });
  }
}
