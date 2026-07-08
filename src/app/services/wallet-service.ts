import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalService } from './global';
import { WalletClaimRequest, WalletSummary } from '../models/wallet';

@Injectable({
  providedIn: 'root',
})
export class WalletService {

  constructor(private http: HttpClient, private global: GlobalService) {}

  getToken(): string | null {
    return localStorage.getItem('tokenApp');
  }

  private getAuthHeaders() {
    const token = this.getToken();
    return new HttpHeaders({
      authorization: `Bearer ${token}` || '',
    });
  }

  getWallet() {
    return this.http.get<WalletSummary>(`${this.global.api}/api/wallet`, {
      headers: this.getAuthHeaders(),
    });
  }

  requestClaim(data: WalletClaimRequest) {
    return this.http.post<WalletSummary>(`${this.global.api}/api/wallet/claim`, data, {
      headers: this.getAuthHeaders(),
    });
  }
}
