import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalService } from './global';

@Injectable({
  providedIn: 'root',
})
export class NewsServices {
  
  constructor(private http:HttpClient,private global:GlobalService){

  }
  
  
  getToken(): string | null {
    return localStorage.getItem('tokenApp');
  }


getNews(page: number = 1, limit: number = 10) {

  const token = this.getToken();

  const headers = new HttpHeaders({
    authorization: `Bearer ${token}` || ''
  });

  return this.http.get<any[]>(
    `${this.global.api}/api/blog?page=${page}&limit=${limit}`,
    { headers }
  );

}


getNewsBySlug(slug:string){

  const token = this.getToken();

  const headers = new HttpHeaders({
    authorization: `Bearer ${token}` || ''
  });

  return this.http.get(
    `${this.global.api}/api/blog/slug/${slug}`,
    { headers }
  );

}

}
