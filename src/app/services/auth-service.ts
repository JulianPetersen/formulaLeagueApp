import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { loguinResponse } from '../models/auth';
import { GlobalService } from './global';

const TOKEN_KEY = 'tokenApp';


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private http:HttpClient, private global:GlobalService){

  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  login(data: { email: string; password: string }) {
    return this.http.post<loguinResponse>(`${this.global.api}/api/auth/login`, data)
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
  }
}