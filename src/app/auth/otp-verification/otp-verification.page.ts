import { Component, OnInit } from '@angular/core';
import { RestDataService } from 'src/app/services/rest-data.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.page.html',
  styleUrls: ['./otp-verification.page.scss'],
})
export class OtpVerificationPage implements OnInit {
phone;
email;
otp;
serverOtp;
showOtpButton = false;
alertObj;
errormessage;
enableNext = false;
phoneset;
  constructor(public restServ: RestDataService,
              public alertCtrl: AlertController) { }

  phoneChanged() {
    const reg = new RegExp(/^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/);
    if (reg.test(this.phone)) {
      this.showOtpButton = true;
    } else {
      this.showOtpButton = false;
    }
  }

  otpChanged() {
    if (this.otp + '' === this.serverOtp + '') {
      console.log('otp matched!');
      alert('OTP verification successful!\nClick next to continue');
      this.enableNext = true;
    } else {
      // console.log('otp didnt match yet');
      // console.log(this.otp + ' ' + this.serverOtp);
    }
  }
  async requestOtp() {
    this.alertObj = await this.alertCtrl.create({
      animated: true,
      header: 'Send OTP?',
      message: 'Do you wish to confirm ' + this.phone + ' and receive OTP?',
      buttons: [
        {
          text: 'cancel',
          role: 'cancel',
        },
        {
          text: 'send OTP',
          handler: () => {
            this.restServ.get('getOtp/' + this.phone).toPromise().then(res => {
              this.serverOtp = res;
              this.alertObj.dismiss();
              this.setPhoneNumber();
              console.log(res);
            }).catch(err => {
              this.alertObj.dismiss();
              console.log(err);
              alert('Operation failed. Please try again');
            });
          }
        }
      ]
    });
    await this.alertObj.present();
  }

  setPhoneNumber() {
    this.phoneset = true;
  }
  ngOnInit() {
  }

}
