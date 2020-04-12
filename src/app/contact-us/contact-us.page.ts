import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../services/user-data.service';
import { RestDataService } from '../services/rest-data.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {
restaurant;
  constructor(private data: UserDataService,
  			  private rest: RestDataService) { }

  ngOnInit() {
    // this.phone = this.data.getRestaurantPhoneNumber();
    this.rest.getRestaurantDetails().subscribe(res => {
    	console.log(res);
    	this.restaurant = res;
    })
  }

}
