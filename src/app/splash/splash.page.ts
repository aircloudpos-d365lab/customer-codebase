import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../services/user-data.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  constructor(private data: UserDataService,
              private navCtrl: NavController) { }

  ngOnInit() {
    setTimeout(() => {
      const username = this.data.getUser();
      console.log(username);
      if (!username) {
        console.log('user not found, redirecting!');
        this.navCtrl.navigateRoot('/authentication');
      } else {
        this.navCtrl.navigateRoot('/home');
      }
    }, 3000);
  }

}
