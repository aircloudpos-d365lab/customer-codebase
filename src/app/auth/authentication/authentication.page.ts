import { Component, OnInit } from '@angular/core';
// import { stat } from 'fs';
import { NavController } from '@ionic/angular';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.page.html',
  styleUrls: ['./authentication.page.scss']
})
export class AuthenticationPage implements OnInit {
  toggleMessage;
  state;
  constructor(private navCtrl: NavController, private googlePlus: GooglePlus) {
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

  loginWithGoogle() {
    this.googlePlus.login({}).then(res => {
      alert(JSON.stringify(res));
    }).catch(err => {
      alert('err' + JSON.stringify(err));
    });
  }

  ngOnInit() {}
}
