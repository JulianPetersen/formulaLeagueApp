import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalService } from './global';
import { BuyTicketsResponse, RafflePrize, RafflesResponse } from '../models/raffle';

@Injectable({
  providedIn: 'root',
})
export class RafflesService {
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

  getRaffles() {
    return this.http.get<RafflesResponse>(`${this.global.api}/api/raffles`, {
      headers: this.getAuthHeaders(),
    });
  }

  buyTickets(raffleId: string, quantity: number) {
    return this.http.post<BuyTicketsResponse>(
      `${this.global.api}/api/raffles/${raffleId}/tickets`,
      { quantity },
      { headers: this.getAuthHeaders() }
    );
  }

  getMyPrizes() {
    return this.http.get<RafflePrize[]>(`${this.global.api}/api/raffles/my-prizes`, {
      headers: this.getAuthHeaders(),
    });
  }

  claimPrize(raffleId: string) {
    return this.http.post<RafflePrize>(
      `${this.global.api}/api/raffles/${raffleId}/claim`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }
}
