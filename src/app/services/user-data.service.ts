import { Injectable } from '@angular/core';
import { MenuList } from '../models/RestaurantDetails';
import { LoginResponse, InfoAddBody, CustomerAddress, CustomerDetails } from '../models/AuthModels';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
items: MenuList[];
RID = 'RgVLcOjwZkG';
outletIndex = '2';
outletId;
  constructor() {
    this.outletId = this.RID + '_' + this.outletIndex;
    // call some api and fetch relevant data and keep them here
  }

  setUser(user: CustomerDetails) {
    user.restaurantTenantId = this.outletId;
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): CustomerDetails {
    return JSON.parse(localStorage.getItem('user'));
  }

  setTenantId(id) {
    localStorage.setItem('customerTenantId', id);
  }
  getTenantId(): string {
    return localStorage.getItem('customerTenantId');
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

  // setAddress(add) {
  //   const data = this.getUser();
  //   data.customerAddress = add;
  //   this.setUser(data);
  // }
  getAddressList(): CustomerAddress[] {
    const user = this.getUser();
    if (user) {
      return user.customerAddressList;
    }
    return [];
  }

  setRestaurantPhoneNumber(phone) {
    localStorage.setItem('restaurantPhone', phone);
  }

  getRestaurantPhoneNumber(): string {
    return localStorage.getItem('restaurantPhone');
  }

  getRestaurantId(): string {
    return this.RID;
  }
  getToken(): string {
    const token = localStorage.getItem('pushToken');
    return (token) ? token : 'hello';
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
