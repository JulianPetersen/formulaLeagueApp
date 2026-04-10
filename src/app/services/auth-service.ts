import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { loguinResponse } from '../models/auth';
import { GlobalService } from './global';
import { Router } from '@angular/router';

const TOKEN_KEY = 'tokenApp';
const user = 'user'

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private http:HttpClient, private global:GlobalService, private router:Router){

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
    localStorage.removeItem(user);
    sessionStorage.clear();
    window.location.reload();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }


  register(data: { email: string; name:string; password: string }){
    return this.http.post<any>(`${this.global.api}/api/auth/register`, data)
  }
}