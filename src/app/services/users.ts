import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalService } from './global';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  

  constructor(private http:HttpClient, private global:GlobalService){

  }

    getToken(): string | null {

    return localStorage.getItem('tokenApp');
  }


    getInfoUser() {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'authorization': `Bearer ${token}` || '',
    });
    return this.http.get(`${this.global.api}/api/user`, { headers })
  }


  getTopUsers() {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'authorization': `Bearer ${token}` || '',
    });
    return this.http.get(`${this.global.api}/api/user/getTopUser`, { headers })
  }


    addUserName(username:string) {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'authorization': `Bearer ${token}` || '',
    });
    return this.http.patch(`${this.global.api}/api/user/addUserName`,{username} ,{ headers })
  }
}
