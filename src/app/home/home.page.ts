import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../services/user-data.service';
import { NavController } from '@ionic/angular';
import { RestDataService } from '../services/rest-data.service';
import { RestaurantDetailsResponse } from '../models/RestaurantDetails';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
APP_NAME;
detailsResponse: RestaurantDetailsResponse;
displayMenu: any = {};
categories;
searchVisible = false;
veg = false;
  constructor(public data: UserDataService,
              private navCtrl: NavController,
              private restServ: RestDataService) {}

  ngOnInit(): void {
    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    // Add 'implements OnInit' to the class.
    this.APP_NAME = this.data.getAppName();

    this.restServ.getRestaurantDetails().subscribe(res => {
      console.log(res);
      const result: any = res;
      this.detailsResponse = result;
      const menu = this.detailsResponse.menuList;

      menu.forEach(item => {
        if (this.displayMenu[item.restaurantMenu.restaurantMenuType]) {
          this.displayMenu[item.restaurantMenu.restaurantMenuType].push(item);
        } else {
          this.displayMenu[item.restaurantMenu.restaurantMenuType] = [];
          this.displayMenu[item.restaurantMenu.restaurantMenuType].push(item);
        }
      });

      this.categories = Object.keys(this.displayMenu);
      console.log(this.displayMenu);
    });
  }

  toggleSearch() {
    this.searchVisible = !this.searchVisible;
  }

  toggleVeg() {
    this.veg = !this.veg;
    this.refreshMenu();
  }

  refreshMenu() {
    // do something
    console.log('is veg only? ' + this.veg);
  }
  logOut() {
    this.data.logout();
    this.navCtrl.navigateRoot('authentication');
  }
}
