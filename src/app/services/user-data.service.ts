import { Injectable } from '@angular/core';
import { MenuList } from '../models/RestaurantDetails';
import { LoginResponse, InfoAddBody } from '../models/AuthModels';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
items: MenuList[];
RID = 'RgVLcOjwZkG';
outletIndex = '1';
outletId;
  constructor() {
    this.outletId = this.RID + '_' + this.outletIndex;
    // call some api and fetch relevant data and keep them here
  }

  setUser(user: InfoAddBody) {
    user.restaurantTenantId = this.outletId;
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): InfoAddBody {
    return JSON.parse(localStorage.getItem('user'));
  }

  getTenantId(): string {
    const user = this.getUser();
    if (user.customerTenantId) {
      return user.customerTenantId;
    }
    // alert('using a fake TenantId, please fix the auth');
    return '0000000000';
  }

  getSelectedBranchId(): string {
    // const b = localStorage.getItem('currentBranch');
    return this.outletId;
  }

  setSelectedBranchId(br: string) {
    // localStorage.setItem('currentBranch', br);
    this.outletId = br;
  }

  getAppName(): string {
    return 'Special 27';
  }

  setAddress(add) {
    const data = this.getUser();
    data.customerAddress = add;
    this.setUser(data);
  }
  getAddress(): string {
    return this.getUser().customerAddress;
  }

  getRestaurantId(): string {
    return this.RID;
  }
  getToken(): string {
    return localStorage.getItem('pushToken');
  }

  logout() {
    localStorage.removeItem('user');
  }

  setCartItems(items: MenuList[]) {
    this.items = items;
  }

  getCartItems(): MenuList[] {
    return this.items;
  }
}
