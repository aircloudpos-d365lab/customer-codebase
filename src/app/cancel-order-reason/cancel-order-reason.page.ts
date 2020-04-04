import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { RestDataService } from '../services/rest-data.service';
import { AlertController, LoadingController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-cancel-order-reason',
  templateUrl: './cancel-order-reason.page.html',
  styleUrls: ['./cancel-order-reason.page.scss'],
})
export class CancelOrderReasonPage implements OnInit {

  constructor(private router: ActivatedRoute,
              private navCtrl: NavController,
              private restServ: RestDataService,
              private alertController: AlertController,
              private loadingController: LoadingController) { }
orderId;
customReason = '';
reason = '';
reasons = ['Duplicate Order', 'Ordered these by mistake', 'Ordered from the wrong branch', 'I\'m not hungry anymore'];
  ngOnInit() {
    this.router.paramMap.subscribe((map: ParamMap) => {
      console.log(map.keys);
      const restaurantOrderId = map.get('restaurantOrderId');
      this.orderId = restaurantOrderId;
    });
  }

  clearRadio() {
    this.reason = '';
  }
  
  updateReasonRadio() {
    this.customReason = '';
  }
  async createLoading() {
    const loading = await this.loadingController.create({
      message: 'Cancelling order, please wait...',
      spinner: 'bubbles'
    });
    return loading;
  }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      header: '',
      subHeader: '',
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentAlertConfirm(finalReason) {
    const alert = await this.alertController.create({
      header: 'Cancel Order?',
      message: 'Are you sure you want to cancel order? <br>Reason: ' + finalReason,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: async () => {
            const loader = await this.createLoading();
            loader.present();
            try {
              console.log('creating cancel order request');
              const res = await this.restServ.cancelOrder(this.orderId, finalReason);
              console.log(res);
              await loader.dismiss();
              // if (res.includes('Success')) {
              this.presentAlert('Order successfully cancelled!');
              this.navCtrl.back();
              // } else {
              //   console.log('res is: ' + res);
              //   console.log('res == "Success" ? ' + (res === 'Success'));
              //   this.presentAlert('Could not cancel order. Please retry');
              // }

            } catch (err) {
              console.log(err);
              await loader.dismiss();
              this.presentAlert('Order cancellation failed, please try again');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async submit() {
    if (!this.reason && this.customReason === '') {
      alert('Please select a reason to continue');
      return;
    }
    const finalReason = (this.customReason === '') ? this.reason : this.customReason;
    console.log(finalReason);
    try {
      this.presentAlertConfirm(finalReason);
    } catch (err) {
      console.log(err);
    }
  }
}
