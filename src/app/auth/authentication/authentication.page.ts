import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.page.html',
  styleUrls: ['./authentication.page.scss'],
})
export class AuthenticationPage implements OnInit {
toggleMessage;
state;
  constructor(private navCtrl: NavController) {
    this.toggleMessage = 'Not a member? Sign up';
    this.state = 0;
   }

  toggleState() {
    if (this.state === 0) {
      this.toggleMessage = 'Already a member? log in';
      this.state = 1;
    } else {
      this.toggleMessage = 'Not a member? Sign up';
      this.state = 0;
    }
  }

  signupOrLogin() {
    if (this.state === 0) {
      this.navCtrl.navigateRoot('home');
    } else {
      this.navCtrl.navigateForward('otp-verification');
    }
  }

  ngOnInit() {
  }


}
