import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { NewCart } from '../models/NewCart';
import { NewOrder } from '../models/AddOrder';
import { RestaurantOrder } from '../models/OrderDetails';
import { UserDataService } from './user-data.service';
import { LoginBody, InfoAddBody } from '../models/AuthModels';
import { Observable } from 'rxjs';
import { Config } from '@ionic/core';
@Injectable({
  providedIn: 'root'
})
export class RestDataService {
  RID = 'RgVLcOjwZkG';
BASEURL = 'http://3.6.179.142:8082/api/';
  constructor(public http: HttpClient,
              public data: UserDataService) {
    let id = localStorage.getItem('branchId');
    if (id == null) {
      id = '1';
    }
    this.RID = this.RID + '_' + id;
  }


  addOrderToRestaurant(order: NewOrder) {
    return this.http.post('http://3.6.179.142:8082/api/restaurant-order/add', order).toPromise();
  }
  createRazorpayOrderForRestaurantOrder(body: RestaurantOrder, paymentId: string) {
    return this.http.post(
    'http://3.6.179.142:8082/api/generate-razorpay-order-for-restaurant-order?razorpay_payment_id='
    + paymentId, body).toPromise();
  }

  reconcilePayment(orderId: string) {
    return this.http.get(
      'http://3.6.179.142:8082/api/reconcile-payment-through-razorpay?restaurant_order_id='
      + orderId, {responseType: 'text'}).toPromise();
  }
  createCart(order: NewCart) {
    return this.http.post('http://3.6.179.142:8083/api/customer-cart/persist', order).toPromise();
  }
  getOrderHistory() {
    return this.http.get(
      'http://3.6.179.142:8082/api/old-order-history-of-customer?customer_tenant_id='
    + this.data.getTenantId()).toPromise();
  }

  setPaymentOrderStatus(orderId: string, paymentConfirmed: string) {
    return this.http.post(
      'http://3.6.179.142:8082/api/restaurant-order/payment-confirmed?restaurant_order_id'
      + orderId + '&payment_confirmed_flag_value=' + paymentConfirmed,
      {}
    ).toPromise();
  }

  updateToken(token) {
    this.http.post(
      'http://3.6.179.142:8082/api' +
      '/device-token-for-customer/update?customer_device_token=' + token + '&customer_tenant_id=' + this.data.getTenantId(), {});
  }
  getCurrentOrderList() {
    return this.http.get(
      'http://3.6.179.142:8082/api/active-order-history-of-customer?customer_tenant_id='
      + this.data.getTenantId()).toPromise();
  }

  getMenuSearch(searchval) {
    return this.http.get('http://3.6.179.142:8084/api/cache/menu/restaurant-menu-search/?menu_prefix=' + searchval).toPromise();
  }

  cancelOrder(orderId, reason: string) {
    return this.http.post('http://3.6.179.142:8082/api/restaurant-order/cancelled-by-customer?'
    + 'restaurant_order_id=' + orderId + '&order_cancellation_reason=' + reason, {}, {responseType: 'text'}).toPromise();
  }

  getBranches() {
    return this.http.get(
      'http://3.6.179.142:8082/api/'
      + 'restaurant-tenant-details?restaurant_master_tenant_id=RgVLcOjwZkG'
      ).toPromise();
  }

  getRestaurantDetails() {
    // do you need branch id?
    return this.get('restaurant-details/?restaurant_tenant_id=' + this.RID);
  }
  get(url) {
    return this.http.get(this.BASEURL + url);
  }

  login(phone, pass): Observable<HttpResponse<Config>> {
    // ! it returns observable and not a promise, dont try to await it
    const req: LoginBody = {
      browserToken: '',
      customerPassword: pass,
      customerTenantId: phone,
      customerUsername: phone,
      deviceToken: this.data.getToken(),
      loggedInAttemptViaApp: 1,
      loggedInAttemptViaBrowser: 0,
      loggedInViaOauth: 0
    };
    return this.http.post<Config>('http://3.6.179.142:8082/api/customer-login/verify',
    req, { observe: 'response' });
  }

  resetPassword(phone, pass) {
    const body: LoginBody = {
      browserToken: '',
      customerPassword: pass,
      customerTenantId: phone,
      customerUsername: phone,
      deviceToken: this.data.getToken(),
      loggedInAttemptViaApp: 1,
      loggedInAttemptViaBrowser: 0,
      loggedInViaOauth: 0
    };
    console.log('calling reset with this body');
    console.log(body);
    return this.http.post('http://3.6.179.142:8082/api/'
    + 'customer-login/reset', body, {responseType: 'text'}).toPromise();
  }

  getDataForUser(tenantId) {
    return this.http.get('http://3.6.179.142:8082/api/'
    + 'customer-details-for-mobile/?customer_tenant_id='
    + tenantId).toPromise();
  }

  addLoginData(data: LoginBody) {
    return this.http.post('http://3.6.179.142:8082/api/customer-login/add', data).toPromise();
  }
  addExtraData(data: InfoAddBody) {
    return this.http.post('http://3.6.179.142:8082/api/customer-info/add', data).toPromise();
  }
}
