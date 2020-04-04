import { Component, OnInit } from '@angular/core';
import { RestDataService } from 'src/app/services/rest-data.service';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.page.html',
  styleUrls: ['./otp-verification.page.scss'],
})
export class OtpVerificationPage implements OnInit {
phone;
password = '';
repass;
reg = new RegExp(/^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/);

  constructor(public restServ: RestDataService,
              public alertCtrl: AlertController,
              public navCtrl: NavController) { }


  async resetPassword() {
    if (!this.reg.test(this.phone)) {
      alert('Please enter a valid phone number');
      return;
    }

    if (this.password === '') {
      alert('Please enter a new password you want to set');
      return;
    }

    if (this.password !== this.repass) {
      alert('The new password and repeat password do not match, please check and try again');
      return;
    }

    try {
      const res = await this.restServ.resetPassword(this.phone, this.password);
      alert('The pasword has been reset successfully, you can now log in with your new password');
      this.navCtrl.back();
    } catch (err) {
      console.log(err);
      alert(err.message);
    }
  }
  ngOnInit() {
  }

}
