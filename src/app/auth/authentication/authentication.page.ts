import { Component, OnInit } from '@angular/core';
// import { stat } from 'fs';
import { NavController, LoadingController } from '@ionic/angular';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { RestDataService } from 'src/app/services/rest-data.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.page.html',
  styleUrls: ['./authentication.page.scss']
})
export class AuthenticationPage implements OnInit {
  toggleMessage;
  state;
  emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  phonePattern = new RegExp(/^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/);
  email;
  password;
  repass;
  name;
  phone;
  constructor(private navCtrl: NavController,
              private googlePlus: GooglePlus,
              private rest: RestDataService,
              private loadingController: LoadingController,
              private data: UserDataService) {
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

  async signupOrLogin() {
    if (this.state === 0) {
      // login
      if (!this.emailPattern.test(this.email)) {
        alert('Please enter a valid email to continue!');
        return;
      }
      if (!this.password || this.password === '') {
        alert('Password cannot be empty');
        return;
      }
      const loader = await this.createLoading('Loading, please wait...');
      try {
        loader.present();
        const res = await this.rest.login(this.email, this.password);
        loader.dismiss();
        console.log(res);
        this.data.setUser({username: this.email, token: res});
        this.navCtrl.navigateRoot('home');
      } catch (err) {
        await loader.dismiss();
        if (typeof err.error === 'string') {
          alert(JSON.parse(JSON.parse(err.error).message).message);
          console.log(JSON.parse(JSON.parse(err.error).message).message);
        } else {
          alert(err.error.message.message);
          console.log(err.error.message.message);
        }
      }
    } else {
      if (!this.emailPattern.test(this.email)) {
        alert('Please enter a valid email to continue!');
        return;
      }
      if (!this.password || this.password === '') {
        alert('Password cannot be empty');
        return;
      }

      if (!this.repass || this.repass === '') {
        alert('Repeat password cannot be empty');
        return;
      }

      if (this.repass !== this.password) {
        alert('Repeat password doesn\'t match with password');
        return;
      }

      if (!this.name || this.name === '') {
        alert('Please enter a valid name to continue');
        return;
      }

      if (!this.phonePattern.test(this.phone)) {
        alert('Please enter a valid phone number');
        return;
      }

      const loader = await this.createLoading('Please wait...');
      try {
        loader.present();
        const response = await this.rest.signup({email: this.email, mobile: this.phone, name: this.name, password: this.password});
        loader.dismiss();
        console.log(response);
        // alert(JSON.stringify(response));
        this.data.setUser({username: this.email, token: response});
        this.navCtrl.navigateForward('home');
      } catch (err) {
        console.log('error occured');
        console.log(err);
        await loader.dismiss();
        alert(err.error.message);
      }

      // this.navCtrl.navigateForward('otp-verification');
    }
  }

  async createLoading(mes) {
    return this.loadingController.create({
      message: mes,
      spinner: 'bubbles'
    });
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
