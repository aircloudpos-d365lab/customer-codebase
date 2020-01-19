import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor() { }

  getAppName(): string {
    return 'Special 27';
  }

  getUsername(): string {
    const user = localStorage.getItem('username');
    return user;
  }

  getRestaurantId(): string {
    return 'R123456';
  }
  logout() {
    localStorage.setItem('username', null);
  }
}
