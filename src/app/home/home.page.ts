import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../services/user-data.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
APP_NAME;
  constructor(public data: UserDataService, private navCtrl: NavController) {}

  ngOnInit(): void {
    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    // Add 'implements OnInit' to the class.
    this.APP_NAME = this.data.getAppName();
  }

  logOut() {
    this.data.logout();
    this.navCtrl.navigateRoot('authentication');
  }
}
