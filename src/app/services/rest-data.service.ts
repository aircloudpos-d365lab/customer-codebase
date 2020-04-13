import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { NewCart } from '../models/NewCart';
import { NewOrder } from '../models/AddOrder';
import { RestaurantOrder } from '../models/OrderDetails';
import { UserDataService } from './user-data.service';
import { LoginBody, InfoAddBody, CustomerDetails, CustomerAddress } from '../models/AuthModels';
import { Observable } from 'rxjs';
import { Config } from '@ionic/core';
@Injectable({
  providedIn: 'root'
})
export class RestDataService {
RID;
BASEURL = 'http://3.6.179.142';
  constructor(public http: HttpClient,
              public data: UserDataService) {
    this.RID = data.getOutletId();
  }


  formatQParams(paramMap): string {
    const keys = Object.keys(paramMap);
    if (keys.length === 0) {
      return '';
    }

    let qparam = '';
    const key0 = keys[0];
    qparam = '?' + key0 + '=' + paramMap[key0];

    keys.forEach(element => {
      if (element === key0) {
        return;
      }
      qparam += '&' + element + '=' + paramMap[element];
    });
    return qparam;
  }
  getBaseUrl(port: number): string {
    return this.BASEURL + ':' + port + '/api/';
  }

  addOrderToRestaurant(order: NewOrder) {
    return this.http.post(
      this.getBaseUrl(8082)
      + 'restaurant-order/add',
      order
    ).toPromise();
  }

  createRazorpayOrderForRestaurantOrder(body: RestaurantOrder, paymentId: string) {
    return this.http.post(
      this.getBaseUrl(8082)
      + 'generate-razorpay-order-for-restaurant-order'
      + '?razorpay_payment_id=' + paymentId,
      body
    ).toPromise();
  }

  reconcilePayment(orderId: string) {
    return this.http.get(
        this.getBaseUrl(8082)
        + 'reconcile-payment-through-razorpay'
        + '?restaurant_order_id=' + orderId,
        {
          responseType: 'text'
        }
      ).toPromise();
  }

  createCart(order: NewCart) {
    return this.http.post(
        this.getBaseUrl(8083)
        + 'restaurant/customer-cart/persist',
        order
      ).toPromise();
  }

  updateCart(cartId): Observable<HttpResponse<Config>> {
    return this.http.post<Config>(
      this.getBaseUrl(8083)
      + 'restaurant/customer-cart/order-placed/update'
      + '?cart_id=' + cartId,
      {},
      {
        observe: 'response'
      }
    );
  }

  fetchCartDetails() {
    return this.http.get(
      this.getBaseUrl(8083)
      + 'restaurant/customer-cart/latest'
      + '?customer_tenant_id=' + this.data.getTenantId()
      ).toPromise();
  }

  getOrderHistory() {
    return this.http.get(
      this.getBaseUrl(8082)
      + 'old-order-history-of-customer'
      + this.formatQParams({
        customer_tenant_id: this.data.getTenantId(),
        restaurant_tenant_id: this.RID
      })
    ).toPromise();
  }

  setPaymentOrderStatus(orderId: string, paymentConfirmed: string) {
    return this.http.post(
      this.getBaseUrl(8082)
      + 'restaurant-order/payment-confirmed'
      + '?restaurant_order_id' + orderId
      + '&payment_confirmed_flag_value=' + paymentConfirmed,
      {}
    ).toPromise();
  }

  updateToken(token) {
    this.http.post(
        this.getBaseUrl(8082)
        + 'device-token-for-customer/update'
        + this.formatQParams({
          customer_device_token: token,
          customer_tenant_id: this.data.getTenantId(),
          restaurant_tenant_id: this.RID
        }),
      {});
  }

  getCurrentOrderList() {
    return this.http.get(
      this.getBaseUrl(8082)
      + 'active-order-history-of-customer'
      + this.formatQParams({
        customer_tenant_id: this.data.getTenantId(),
        restaurant_tenant_id: this.RID
      })
    ).toPromise();
  }

  getMenuSearch(searchval) {
    return this.http.get(
      this.getBaseUrl(8084)
      + 'cache/menu/restaurant-menu-search/'
      + this.formatQParams(
        {
          menu_prefix: searchval,
          restaurant_tenant_id: this.RID
        }
      )
    ).toPromise();
  }

  cancelOrder(orderId, reason: string) {
    return this.http.post(
        this.getBaseUrl(8082)
        + 'restaurant-order/cancelled-by-customer?'
        + 'restaurant_order_id=' + orderId
        + '&order_cancellation_reason=' + reason,
        {},
        {
          responseType: 'text'
        }
      ).toPromise();
  }

  getBranches() {
    return this.http.get(
      this.getBaseUrl(8082)
      + 'restaurant-tenant-details?restaurant_master_tenant_id='
      + this.data.getMasterRestaurantId()
      ).toPromise();
  }

  getRestaurantDetails() {
    return this.http.get(
      this.getBaseUrl(8082)
      + 'restaurant-details/?restaurant_tenant_id='
      + this.RID);
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
    return this.http.post<Config>(
      this.getBaseUrl(8082)
      + 'customer-login/verify',
      req,
      {
        observe: 'response'
      }
    );
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
    return this.http.post(
      this.getBaseUrl(8082)
      + 'customer-login/reset',
      body,
      {
        responseType: 'text'
      }
    ).toPromise();
  }

  getDataForUser(): Promise<CustomerDetails> {
    const tenantId = this.data.getTenantId();
    console.log(tenantId);
    return this.http.get<CustomerDetails>(
      this.getBaseUrl(8082)
      + 'customer-details-for-mobile/'
      + this.formatQParams({
        customer_tenant_id: tenantId,
        restaurant_tenant_id: this.RID
      })
    ).toPromise();
  }

  addLoginData(data: LoginBody) {
    return this.http.post(
      this.getBaseUrl(8082)
      + 'customer-login/add',
      data
    ).toPromise();
  }

  addExtraData(data: InfoAddBody) {
    return this.http.post(
      this.getBaseUrl(8082)
      + 'customer-info/add',
      data
    ).toPromise();
  }

  updateExtraData(data: InfoAddBody) {
    return this.http.post(
      this.getBaseUrl(8082)
      + 'customer-info/update',
      data,
      {
        responseType: 'text'
      }
    ).toPromise();
  }

  addAddressData(data: CustomerAddress) {
    return this.http.post(
      this.getBaseUrl(8082)
      + 'customer-address/add',
      data,
      {
        responseType: 'text'
      }
    ).toPromise();
  }
}
