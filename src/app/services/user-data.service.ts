import { Injectable } from '@angular/core';
import { MenuList } from '../models/RestaurantDetails';
import { RestDataService } from './rest-data.service';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
items: MenuList[];
branches = ['branch one', 'branch two'];
  constructor(private rest: RestDataService) {
    // call some api and fetch relevant data and keep them here
  }

  setUser(user: {username: string, token: string}) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): {username: string, token: string} {
    return JSON.parse(localStorage.getItem('user'));
  }

  getSelectedBranch(): string {
    const b = localStorage.getItem('currentBranch');
    if (b) {
      return b;
    }
    this.setSelectedBranch(this.branches[0]);
    return this.branches[0];
  }

  setSelectedBranch(br: string) {
    localStorage.setItem('currentBranch', br);
  }

  getBranches(): string[] {
    return this.branches;
  }

  getAppName(): string {
    return 'Special 27';
  }

  getRestaurantId(): string {
    return 'R123456';
  }
  logout() {
    localStorage.setItem('username', null);
  }

  setCartItems(items: MenuList[]) {
    this.items = items;
  }

  getCartItems(): MenuList[] {
    return this.items;
  }
}
