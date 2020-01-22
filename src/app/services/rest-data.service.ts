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

  getRestaurantDetails() {
    // do you need branch id?
    return this.get('restaurant-details/?restaurant_tenant_id=' + this.RID);
  }
  get(url) {
    return this.http.get(this.BASEURL + url);
  }
}
