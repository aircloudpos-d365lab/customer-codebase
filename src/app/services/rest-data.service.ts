import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class RestDataService {

  constructor(public http: HttpClient) { }

  
}
