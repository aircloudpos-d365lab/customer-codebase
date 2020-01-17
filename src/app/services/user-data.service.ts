import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor() { }

  getAppName(): string {
    return 'Special 27';
  }
  
}
