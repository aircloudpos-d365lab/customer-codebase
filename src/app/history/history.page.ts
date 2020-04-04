import { Component, OnInit } from '@angular/core';
import { RestDataService } from '../services/rest-data.service';
import { AlertController, NavController, LoadingController } from '@ionic/angular';
import { OrderResponse, RestaurantOrderOutputPayloadList, RestaurantOrder } from '../models/OrderDetails';
import { UserDataService } from '../services/user-data.service';

declare var RazorpayCheckout: any;

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
errormessage = {
  active: 'loading, please wait...',
  completed: 'loading, please wait...'
};
combinedData: {
  active: RestaurantOrderOutputPayloadList[],
  completed: RestaurantOrderOutputPayloadList[]
} = {
  active: [],
  completed: []
};
currentTab = 'active';
loader: HTMLIonLoadingElement;
  constructor(private restServ: RestDataService,
              private alertController: AlertController,
              private navCtrl: NavController,
              private data: UserDataService,
              private loadingController: LoadingController) { }

  ngOnInit() {
    this.refreshPage(null);
  }

  async refreshPage(event) {
    console.log('calling refresh');
    try {
      await this.getActiveOrderStatus();
      await this.getCompletedOrders();
    } catch (err) {
      console.log('err');
      this.createAlert('Failed to refresh page data, please try again');
    } finally {
      if (event) {
        event.target.complete();
      }
    }
  }

  cancelOrder(order: RestaurantOrderOutputPayloadList) {
    this.navCtrl.navigateForward('/cancel-order-reason/' + order.restaurantOrder.orderInvoiceId);
  }
  async getActiveOrderStatus() {
    this.errormessage.active = 'Loading, please wait...';
    this.combinedData.active = [];
    this.restServ.getCurrentOrderList().then(res => {
      console.log(res);
      const resp: any = res;
      const response: {restaurantOrderOutputPayloadList: RestaurantOrderOutputPayloadList[]} = resp;
      if (!response) {
        this.errormessage.active = 'No active orders found!';
        return;
      } else {
        this.errormessage.active = '';
      }

      response.restaurantOrderOutputPayloadList.forEach(element => {
        const ro: RestaurantOrder = element.restaurantOrder;
        let progress = 0;
        element.meta = {
          progress: 0,
          stepCompleted: 0,
          acceptedAt: '--under progress--',
          preparedAt: '--under progress--',
          preparingAt: '--under progress--',
          outForDeliveryAt: '--under progress--',
          deliveredAt: '--under progress--'
        };
        if (ro.isOrderAcceptedByRestaurant) {
          progress++;
          element.meta.acceptedAt = 'Order is accepted by restaurant - ' + this.getReadableTime(ro.orderAcceptedByRestaurantAt);
        }
        if (ro.isOrderStartedPreparingByRestaurant) {
          progress++;
          element.meta.preparingAt = 'Order is being prepared by restaurant - ' + this.getReadableTime(ro.orderStartedPreparingAt);
        }
        if (ro.isOrderPreparedByRestaurant) {
          progress++;
          element.meta.preparedAt = 'Order is prepared by restaurant, waiting for delivery person - '
          + this.getReadableTime(ro.orderFoodReadyByRestaurantAt);
        }
        if (ro.isOrderOutForDelivery) {
          progress++;
          element.meta.outForDeliveryAt = 'Order is out for delivery, will reach your place soon - '
          + this.getReadableTime(ro.orderOutForDeliveryByRestaurantAt);
        }
        if (ro.isOrderDelivered) {
          progress++;
          element.meta.deliveredAt = 'Order is delivered to your place - ' + this.getReadableTime(ro.orderDeliveredAt);
        }
        element.meta.stepCompleted = progress;
        element.meta.progress = (progress - 1) * 25;
        if (element.meta.progress < 0) {
          element.meta.progress = 0;
        }
      });

      this.combinedData.active = response.restaurantOrderOutputPayloadList;

      if (this.combinedData.active.length > 0) {
        setTimeout(() => {
          this.getActiveOrderStatus();
        }, 25000);
      }
      console.log(this.combinedData.active);

    }).catch(err => {
      this.errormessage.active = 'Failed to load active orders, please try again';
      // alert('Could not load order data, please try again');
      console.log(err);
    });
  }

  async getCompletedOrders() {
    this.errormessage.completed = 'Loading, please wait...';
    this.combinedData.completed = [];
    this.restServ.getOrderHistory().then(res => {
      const response: any = res;
      if (!response) {
        this.errormessage.completed = 'No previous orders found!';
        return;
      } else {
        this.errormessage.completed = '';
      }

      this.combinedData.completed = response.restaurantOrderOutputPayloadList;
      this.combinedData.completed[1].restaurantOrder.isOrderCancelledByCustomer = 1;
      console.log(this.combinedData.completed);

    }).catch(err => {
      console.log(err);
      this.errormessage.completed = 'Some error occured, please try again';
    });
  }

  async presentAlert(order) {
    console.log(new Date(order.restaurantOrder.orderAcceptedByRestaurantAt).toLocaleTimeString());
    const alert = await this.alertController.create({
      header: 'Order Details',
      subHeader: 'Date of order: ' + this.getReadableDate(order.restaurantOrder.orderAcceptedByRestaurantAt),
      message: this.getFormattedOrders(order.orderMenuList),
      buttons: ['OK']
    });

    await alert.present();
  }

  getFormattedOrders(menuList) {
    let res = '';
    console.log(menuList);
    menuList.forEach(element => {
      res += ((res !== '') ? ', ' : '') + element.cartRestaurantMenuQty + ' X ' + element.cartRestaurantMenuName;
    });
    return res;
  }

  getReadableDate(dt) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const date = new Date(dt);
    return date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear()
    + ' at '
    + (date.getHours() % 12)
    + ':'
    + date.getMinutes()
    + ' '
    + ((date.getHours() > 12) ? 'PM' : 'AM');
  }

  ionViewDidEnter() {
    this.refreshPage(null);
  }

  orderSegmentChanged(event) {
    this.currentTab = event.detail.value;
    console.log(this.currentTab);
  }

  getReadableTime(dt) {
    const date = new Date(dt);
    return (date.getHours() % 12)
    + ':'
    + date.getMinutes()
    + ' '
    + ((date.getHours() > 12) ? 'PM' : 'AM');
  }

  async createLoading() {
    const loading = await this.loadingController.create({
      message: 'Placing order, please wait...',
      spinner: 'bubbles'
    });
    return loading;
  }

  async createAlert(message) {
    const alert = await this.alertController.create({
      header: '',
      subHeader: '',
      message,
      buttons: ['OK']
    });
    alert.present();
  }

  retryPayment(order: RestaurantOrderOutputPayloadList) {
    this.pay(order);
  }

  async pay(newOrder: RestaurantOrderOutputPayloadList) {
    const options = {
      description: 'To Special27',
      image: 'https://i.imgur.com/3g7nmJC.png',
      currency: 'INR', // your 3 letter currency code
      key: 'rzp_test_61wIwZYQZLCQ1d', // your Key Id from Razorpay dashboard
      amount: parseInt((newOrder.restaurantOrder.orderGrandTotal * 100) + '', 10), // Payment amount in smallest denomiation
      name: this.data.getTenantId(),
      prefill: {
      },
      theme: {
        color: '#3949AB'
      },
      modal: {
        ondismiss: async () => {
          this.createAlert('Payment has been dismissed!');
        }
      }
    };

    const successCallback = async (paymentId: string) => {
      this.loader = await this.createLoading();
      this.loader.present();
      this.createRazorpayOrder(paymentId, newOrder);
    };

    const cancelCallback = async (error) => {
      this.createAlert(error.description + ' (Error ' + error.code + ')');
    };

    try {
      RazorpayCheckout.open(options, successCallback, cancelCallback);
    } catch (err) {
      this.createAlert('Failed to initiate payment service!');
    }
  }

  async createRazorpayOrder(paymentId: string, order: RestaurantOrderOutputPayloadList) {

    try {
      const rzorder: RestaurantOrder = order.restaurantOrder;
      rzorder.orderPaymentMode = 'Razorpay';
      const res = await this.restServ.createRazorpayOrderForRestaurantOrder(rzorder, paymentId);
      try {
        const reconcil = await this.restServ.reconcilePayment(order.restaurantOrder.restaurantOrderId + '');
        this.setPaymentStatus(order.restaurantOrder.restaurantOrderId, 1);
        this.createAlert('Payment has been verified!');
      } catch (err) {
        // something went wrong again, dammit!
        this.createAlert('Payment authorization failed!');
      }
      await this.loader.dismiss();
    } catch (err) {
      console.log(err);
      await this.loader.dismiss();
      this.createAlert('Failed to verify/collect payment, order status is unchanged');
    }
  }

  async setPaymentStatus(orderId, status) {
    try {
      const res = await this.restServ.setPaymentOrderStatus(orderId, status);
      console.log(res);
    } catch (err) {
      this.createAlert('Payment status could not be updated,'
      + 'please take a screenshot of this message and talk to restaurant if inconvenience occurs.'
      + '\n' + 'RestaurantOrderId: ' +  orderId);
    }
  }
}
