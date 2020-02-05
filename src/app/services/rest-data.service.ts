import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserDataService } from './user-data.service';
@Injectable({
  providedIn: 'root'
})
export class RestDataService {
RID = 'R123456';
BASEURL = 'http://ec2-13-127-146-229.ap-south-1.compute.amazonaws.com:8082/api/';
  constructor(public http: HttpClient) { }


  getMenuSearch(searchval) {
    return this.http.get('http://13.233.89.218:8084/api/cache/menu/restaurant-menu-search/?menu_prefix=' + searchval).toPromise();
  }

  getRestaurantDetails() {
    // do you need branch id?
    return this.get('restaurant-details/?restaurant_tenant_id=' + this.RID);
  }
  get(url) {
    return this.http.get(this.BASEURL + url);
  }

  login(email, pass) {
    return this.http.post('http://15.206.116.11:8080/mobi/applogin', {username: email, password: pass}, {responseType: 'text'}).toPromise();
  }

  signup(data: {name: string, password: string, email: string, mobile: string}) {
    return this.http.post('http://15.206.116.11:8080/mobi/appregister', data, {responseType: 'text'}).toPromise();
  }
}
