  import { HttpClient, HttpHeaders } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import { GlobalService } from './global';
  import { VersionAppModel } from '../models/version-app';

  @Injectable({
    providedIn: 'root',
  })
  export class AppversionService {


    constructor(private http: HttpClient, private global: GlobalService) { }



    getToken(): string | null {
      return localStorage.getItem('tokenApp');
    }

    getLatestVersion() {
      const token = this.getToken();
      const headers = new HttpHeaders({
        'authorization': `Bearer ${token}` || '',
      });
      return this.http.get<VersionAppModel>(`${this.global.api}/api/versionApp/get-latest-version`, { headers })
    }
  }
