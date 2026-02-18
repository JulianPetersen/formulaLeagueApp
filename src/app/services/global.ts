import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  public api = 'http://localhost:4000';



  getUserId(){
    return localStorage.getItem('user')
  }
}
