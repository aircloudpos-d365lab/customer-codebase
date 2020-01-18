import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class RestDataService {
BASEURL = 'https://www.google.com/';
  constructor(public http: HttpClient) { }

  get(url) {
    return this.http.get(this.BASEURL + url);
  }
}
