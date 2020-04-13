import { Component, OnInit } from '@angular/core';
// import { stat } from 'fs';
import { NavController, LoadingController, Platform } from '@ionic/angular';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { RestDataService } from 'src/app/services/rest-data.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { InfoAddBody, LoginBody, CustomerDetails } from 'src/app/models/AuthModels';

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
  address;
  addressType = 'home';
  somedata;
  subscription;

  line1 = '';
  line2 = '';
  city = '';
  pin = '';
  buttonTextMap = {
    0: 'Log in',
    1: 'Register'
  };
  head = {
    0: 'Log In',
    1: 'Sign up'
  };
  constructor(private navCtrl: NavController,
              private googlePlus: GooglePlus,
              private rest: RestDataService,
              private loadingController: LoadingController,
              private data: UserDataService,
              private platform: Platform) {
    this.toggleMessage = 'Not a member? Sign up';
    this.state = 0;
  }

  forgotPassword() {
    this.navCtrl.navigateForward('/otp-verification');
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

      if (!this.phonePattern.test(this.phone)) {
        alert('Please enter a valid phone number to continue!');
        return;
      }
      if (!this.password || this.password === '') {
        alert('Password cannot be empty');
        return;
      }
      const loader = await this.createLoading('Loading, please wait...');
      try {
        loader.present();
        // const resp: any = await this.rest.login(this.phone, this.password);
        this.rest.login(this.phone, this.password).subscribe(async res => {
          if (res.status === 204) {
            loader.dismiss();
            alert('Wrong credentials provided!');
            return;
          } else {
            const resp: any = res.body;
            console.log(resp);
            // TODO, do whatever youre doing here
            try {
              await this.getDataForUser(this.phone);
              this.navCtrl.navigateRoot('home');
            } catch (er) {
              alert('failed to fetch user details, log in could not be completed');
              console.log(er);
            } finally {
              loader.dismiss();
            }
          }
        });
      } catch (err) {
        await loader.dismiss();
        console.log(err);
      }
    } else if (this.state === 1) {
      if (!this.emailPattern.test(this.email)) {
        alert('Please enter a valid email to continue!');
        return;
      }
      if (!this.check(this.password, 'Password')) {
        return;
      }

      if (!this.check(this.repass, 'Repeat password')) {
        return;
      }

      if (this.repass !== this.password) {
        alert('Repeat password doesn\'t match with password');
        return;
      }

      if (!this.phonePattern.test(this.phone)) {
        alert('Please enter a valid phone number');
        return;
      }
      this.state = 2;
    } else {
      console.log('here');
      if (!this.check(this.name, 'Name')) {
        return;
      }

      if (!this.check(this.line1, 'Line 1')) {
        return;
      }

      if (!this.check(this.city, 'City')) {
        return;
      }

      if (!this.check(this.pin, 'PIN Code')) {
        return;
      }

      if ((this.pin + '').length !== 6) {
        console.log(this.pin);
        console.log((this.pin + '').length);
        alert('PIN Code is invalid!');
        return;
      }

      this.address = this.line1 + ' ' + this.line2 + ' ' + this.city + ' ' + this.pin;
      this.addressType = 'default';
      console.log('here');
      const loader = await this.createLoading('Please wait...');
      try {
        loader.present();
        const infoData: InfoAddBody = {
          customerAddress: this.address,
          customerAddressType: this.addressType,
          customerDeviceToken: this.data.getToken(),
          customerEmail: this.email,
          customerId: 0,
          customerName: this.name,
          customerPrimaryContactNo: this.phone,
          customerSecondaryContactNo: this.phone,
          customerTenantId: this.phone,
          restaurantTenantId: this.data.getSelectedBranchId(),
          isDefaultAddress: 1
        };

        const loginData: LoginBody = {
          browserToken: '',
          customerPassword: this.password,
          customerTenantId: this.phone,
          customerUsername: this.phone,
          deviceToken: this.data.getToken(),
          loggedInAttemptViaApp: 1,
          loggedInAttemptViaBrowser: 0,
          loggedInViaOauth: 0
        };

        // alert(JSON.stringify(infoData));
        // alert(JSON.stringify(loginData));
        console.log(infoData);
        this.somedata = JSON.stringify(loginData);
        let response = await this.rest.addExtraData(infoData);
        console.log(response);
        console.log(loginData);
        response = await this.rest.addLoginData(loginData);
        loader.dismiss();
        console.log(response);
        this.getDataForUser(this.phone);
        this.navCtrl.navigateRoot('home');
      } catch (err) {
        console.log('error occured');
        console.log(err);
        await loader.dismiss();
        if (err.error && err.error.message) {
          alert(err.error.message);
        }
      }
    }
  }

  check(data, type): boolean {
    if (!data || data === '') {
      alert(type + ' cannot be empty!');
      return false;
    }
    return true;
  }
  async getDataForUser(tenantId) {
    try {
      this.data.setTenantId(tenantId);
      console.log('trying to fetch user data');
      const res: CustomerDetails = await this.rest.getDataForUser();
      console.log(res);
      this.data.setUser(res);
    } catch (er) {
      console.log('failed to get user data and store them');
      console.log(er);
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

  ionViewDidEnter() {
    this.subscription = this.platform.backButton.subscribe(() => {
        const app = 'app';
        navigator[app].exitApp();
    });
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }
}
