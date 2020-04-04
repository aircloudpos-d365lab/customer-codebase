import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../services/user-data.service';
import { MenuList } from '../models/RestaurantDetails';
import { RestDataService } from '../services/rest-data.service';
import { NewOrder } from '../models/AddOrder';
import { NewCart, CartMenuList } from '../models/NewCart';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
import { RestaurantOrderOutputPayloadList, RestaurantOrder } from '../models/OrderDetails';

declare var RazorpayCheckout: any;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
selectedItems: MenuList[];
price = 0;
totalPrice = 0;
totalCount = 0;
sgst = 0;
cgst = 0;
deliveryCharge = 30;
datatext = 'hello';
loader: HTMLIonLoadingElement;
address;
showAddressInput = false;
isCOD = false;

  constructor(private data: UserDataService,
              private rest: RestDataService,
              private navCtrl: NavController,
              private alertController: AlertController,
              private loadingController: LoadingController) {
    this.selectedItems = this.data.getCartItems();
    if (!this.selectedItems) {
      this.navCtrl.back();
      return;
    }

    this.selectedItems.forEach(element => {
      console.log(element);
      this.price += element.count * element.restaurantMenu.restaurantMenuPrice;
      this.totalPrice += element.count * element.restaurantMenu.restaurantMenuFinalPrice;
      this.totalCount += element.count;
      this.cgst += element.restaurantMenu.restaurantMenuPriceCgstPercentage
      * element.count
      * element.restaurantMenu.restaurantMenuPrice / 100;

      this.sgst += element.restaurantMenu.restaurantMenuPriceSgstPercentage
      * element.count
      * element.restaurantMenu.restaurantMenuPrice / 100;

      this.totalPrice = this.formatNumber(this.totalPrice);
    });
  }

  changeItemCount(item: MenuList, count: number) {
    if (count === -1 && item.count === 0) {
      return;
    }

    item.count += count;
    this.totalCount += count;
    this.totalPrice += item.restaurantMenu.restaurantMenuFinalPrice * count;
    this.price += item.restaurantMenu.restaurantMenuPrice * count;
    this.sgst += item.restaurantMenu.restaurantMenuPrice * count * item.restaurantMenu.restaurantMenuPriceSgstPercentage / 100;
    this.cgst += item.restaurantMenu.restaurantMenuPrice * count * item.restaurantMenu.restaurantMenuPriceCgstPercentage / 100;

    this.totalPrice = this.formatNumber(this.totalPrice);
  }

  ngOnInit() {
  }


  getDisplayMessage(): string {
    return 'Address: ' + this.data.getAddress() + '<br>'
    + 'Amount: ' + this.formatNumber(this.totalPrice + this.deliveryCharge);
  }


  async startOrderCOD() {
    this.isCOD = true;
    this.startPayment();
  }
  async startPayment() {
    if (this.data.getAddress() === null) {
      if (this.showAddressInput === false) {
        this.showAddressInput = true;
        alert('please enter a delivery address to continue');
        return;
      } else {
        if (this.address && this.address !== '') {
          this.data.setAddress(this.address);
          this.presentAlertConfirm();
        } else {
          alert('You must enter a delivery address to place an order!');
        }
      }
    }
    else {
      this.presentAlertConfirm();
    }
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Please check order details:',
      message: this.getDisplayMessage(),
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
          handler: () => {
            console.log('Confirm Okay');
            this.createCart();
          }
        }
      ]
    });

    await alert.present();
  }

  async createCart() {
    // add whatever fields are necessary
    const foodList: CartMenuList[] = [];
    this.selectedItems.forEach(element => {
      foodList.push({
        cartId: 0,
        cartMenuId: 0,
        cartRestaurantMenuCategory: element.restaurantMenu.restaurantMenuCategory,
        cartRestaurantMenuCustomization: element.customisation,
        cartRestaurantMenuDescription: element.restaurantMenu.restaurantMenuDescription,
        cartRestaurantMenuFinalPrice: element.restaurantMenu.restaurantMenuFinalPrice,
        cartRestaurantMenuId: element.restaurantMenu.restaurantMenuId,
        cartRestaurantMenuName: element.restaurantMenu.restaurantMenuName,
        cartRestaurantMenuPhoto: element.restaurantMenu.restaurantMenuPhoto,
        cartRestaurantMenuPrice: element.restaurantMenu.restaurantMenuPrice,
        cartRestaurantMenuPriceCgstPercentage: element.restaurantMenu.restaurantMenuPriceCgstPercentage,
        cartRestaurantMenuPriceSgstPercentage: element.restaurantMenu.restaurantMenuPriceSgstPercentage,
        cartRestaurantMenuQty: element.count,
        cartRestaurantMenuRating: element.restaurantMenu.restaurantMenuRating,
        cartRestaurantMenuType: element.restaurantMenu.restaurantMenuType,
        cartRestaurantTenantId: element.restaurantMenu.restaurantTenantId
      });
    });

    let body: NewCart = {
      restaurantTenantId: this.rest.RID,
      customerTenantId: this.data.getTenantId(),
      cartMenuList: foodList,
      isOrderPlaced: 0,
      cartDeliveryFee: this.deliveryCharge,
      cartItemPriceTotal: this.price,
      cartTotalCgstPercentage: foodList[0].cartRestaurantMenuPriceCgstPercentage,
      cartTotalSgstPercentage: foodList[0].cartRestaurantMenuPriceSgstPercentage,
      cartTotal: this.totalPrice,
      cartDiscountTotal: 0,
      cartGrandTotal: this.totalPrice + this.deliveryCharge,
      couponAppliedOnCart: 'SPECIAL27OFF'
    };
    try {
      this.loader =  await this.createLoading();
      this.loader.present();
      console.log(body);
      const res: any = await this.rest.createCart(body);
      body = res;
      console.log(res);
      this.addOrder(body);
    } catch (err) {
      console.log(err);
      await this.loader.dismiss();
      this.createAlert('Failed to create Order!');
    }
  }


  async addOrder(rzorder: NewCart) {
    try {
      const body
      : NewOrder
      = {
        cartId: rzorder.cartMenuList[0].cartId,
        customerTenantId: rzorder.customerTenantId,
        isOrderAcceptedByRestaurant: 0,
        isOrderCancelledByCustomer: 0,
        isOrderCancelledByRestaurant: 0,
        isOrderDelivered: 0,
        isOrderOutForDelivery: 0,
        isOrderPaymentConfirmed: 0,
        isOrderPreparedByRestaurant: 0,
        isOrderStartedPreparingByRestaurant: 0,
        orderAppliedCoupon: rzorder.couponAppliedOnCart,
        orderChannel: 'AirCloudPos',
        orderDeliveryAddress: this.data.getAddress(),
        orderDiscountTotal: rzorder.cartDiscountTotal,
        orderGrandTotal: rzorder.cartGrandTotal,
        orderInvoiceId: 0,
        orderPaymentMode: (this.isCOD) ? 'COD' : 'razorpay',
        orderSpecialInstructions: '',
        orderTotal: rzorder.cartTotal,
        orderTotalCgst: rzorder.cartTotalCgstPercentage,
        orderTotalSgst: rzorder.cartTotalSgstPercentage,
        restaurantOrderMode: 'App',
        restaurantTenantId: rzorder.restaurantTenantId
      };

      const res: any = await this.rest.addOrderToRestaurant(body);
      const newOrder: RestaurantOrderOutputPayloadList = res;
      this.data.setCartItems([]);
      console.log('status of cart is');
      console.log(this.data.getCartItems());
      if (this.isCOD) {
        await this.loader.dismiss();
        this.createAlert('Order has been placed successfully!');
        this.wrapUpOrder();
      } else {
        this.pay(newOrder);
      }
    } catch (err) {
      console.log(err);
      await this.loader.dismiss();
      this.createAlert('Order could not be placed with the restaurant, please bear with us');
    }
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
          // alert('dismissed');
          await this.loader.dismiss();
          this.createAlert('Payment has been dismissed, but order is placed. Please retry payment from the orders page');
          this.wrapUpOrder();
        }
      }
    };

    const successCallback = async (paymentId: string) => {
      // alert('payment_id: ' + paymentId);

      this.createRazorpayOrder(paymentId, newOrder);
    };

    const cancelCallback = async (error) => {
      await this.loader.dismiss();
      this.createAlert(error.description + ' (Error ' + error.code + ')');
      this.wrapUpOrder();
    };

    try {
      RazorpayCheckout.open(options, successCallback, cancelCallback);
    } catch (err) {
      await this.loader.dismiss();
      this.createAlert('Failed to initiate payment service!');
      this.wrapUpOrder();
    }
  }

  async createRazorpayOrder(paymentId: string, order: RestaurantOrderOutputPayloadList) {

    try {
      const rzorder: RestaurantOrder = order.restaurantOrder;
      rzorder.orderPaymentMode = 'Razorpay';
      this.datatext = JSON.stringify(rzorder) + '\n' + paymentId;
      console.log(this.datatext);
      let res;
      res = await this.rest.createRazorpayOrderForRestaurantOrder(rzorder, paymentId);
      try {
        const reconcil = await this.rest.reconcilePayment(order.restaurantOrder.restaurantOrderId + '');
        this.setPaymentStatus(order.restaurantOrder.restaurantOrderId, 1);
        this.createAlert('order placed and payment confirmed!');
      } catch (err) {
        this.createAlert('Payment authorization failed, but your order has been placed, please retry payment from orders page');
      }
      await this.loader.dismiss();
      this.wrapUpOrder();
    } catch (err) {
      console.log(err);
      await this.loader.dismiss();
      this.createAlert('Failed to verify/collect payment, but the order has been placed.'
      + 'You can retry payment from orders page, failing to do which will convert it to COD order');
      this.wrapUpOrder();
    }
  }

  async setPaymentStatus(orderId, status) {
    try {
      const res = await this.rest.setPaymentOrderStatus(orderId, status);
      console.log(res);
    } catch (err) {
      this.createAlert('Payment status could not be updated,'
      + 'please take a screenshot of this message and talk to restaurant if inconvenience occurs.'
      + '\n' + 'RestaurantOrderId: ' +  orderId);
    }
  }

  async wrapUpOrder() {
    await this.navCtrl.pop();
    this.navCtrl.navigateForward('/history');
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

  formatNumber(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  }
}

// questions
// 1. how can I send a cartId in create customer cart?
// 2. what object does razorpay-order api accept?
// 3.


// steps for placing a order
// 1. POST create a cart
// 2.  call POST /api/restaurant-order/add

// 3. start payment flow - get payment_id
// 4. call POST generate-razorpay-order-for-restaurant-order with the payment-id
// 5. call GET reconcile-payment-through-razorpay with order-id
// 6. change orderPaymentConfirmed to true

// include a retry payment for orders with unconfirmed payments
// if payment fails then give user a 5 minute window and convert the payment to COD

// 1. create observer for payment to COD conversion
// 2. check if orderpaymentConfirmed flag updating api is available
// 3. active orders should also include orders whose payment isnt confirmed yet
// retry option should be shown if orderPaymentConfirmed is false and paymentMode is not COD