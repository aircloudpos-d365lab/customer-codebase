import { Component, OnInit } from '@angular/core';
import { RestDataService } from '../services/rest-data.service';
import { LoadingController, NavController, AlertController } from '@ionic/angular';
import { CustomerDetails, CustomerAddress } from '../models/AuthModels';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
response: CustomerDetails;
editable: {
  name: boolean,
  altphone: boolean,
  email: boolean
};
infoChanged = false;
addressChanged = false;
editableaddress = {};
showNewAddressCard = false;
line1;
line2;
city;
pin;
addressType;
  constructor(private rest: RestDataService,
              private loadingController: LoadingController,
              private navCtrl: NavController,
              private alertController: AlertController) { }

  ngOnInit() {
    this.editable = {
      name: false,
      altphone: false,
      email: false
    };
    this.inflateForm();
    this.showNewAddressCard = false;
  }

  async inflateForm() {
    try {
      this.response = await this.rest.getDataForUser();

      console.log(this.response);
    } catch (err) {
      console.log(err);
    }
  }


  async presentAlertConfirm() {
    const updated = this.editable.name || this.editable.altphone || this.editable.email;
    if (!updated) {
      this.presentAlert('You have not edited any info yet!', () => {});
      return;
    }
    const alert = await this.alertController.create({
      header: 'Are you sure!',
      message: 'Do you want to update your profile?',
      buttons: [
        {
          text: 'Cancel',
          role: 'No',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Yes, update',
          handler: () => {
            this.updateInfo();
          }
        }
      ]
    });
    await alert.present();
  }

  async presentAlert(message, handler) {
    const alert = await this.alertController.create({
      header: 'Message',
      message,
      buttons: [{
        text: 'OK',
        handler
      }]
    });
    await alert.present();
  }

  async presentLoading(message) {
    const loading = await this.loadingController.create({
      message,
      spinner: 'bubbles'
    });
    return loading;
  }
  async updateInfo() {
    const loading = await this.presentLoading('Updating data');
    try {
      loading.present();
      console.log(this.response);
      const body: any = {
        customerTenantId: this.response.customerTenantId,
        customerPrimaryContantNo: this.response.customerTenantId,
        customerName: this.response.customerName,
        customerEmail: this.response.customerEmail
      };
      console.log(body);
      const res = await this.rest.updateExtraData(body);
      await loading.dismiss();
      await this.presentAlert('Data has been updated successfully!', () => {});
    } catch (err) {
      await loading.dismiss();
      console.log(err);
      this.presentAlert('Failed to upload data!', () => {});
    }
  }

  removeNewAddress() {
    this.showAddAddressCard();
    this.showNewAddressCard = false;
  }

  async uploadNewAddress() {
    if (this.addressType === '') {
      alert('Please specify an address type for the new address');
      return;
    }
    if (this.line1 === '') {
      alert('Line 1 of new address not specified');
      return;
    }
    if (this.city === '') {
      alert('City for new address not specified');
      return;
    }

    if (this.pin === '') {
      alert('PIN code not specified');
      return;
    }
    if ((this.pin + '').length !== 6) {
      alert('Pin Code is not valid');
      return;
    }
    if (!(this.pin + '').startsWith('560')) {
      alert('PIN should belong to city of bangalore');
      return;
    }
    const address = this.line1 + ' ' + this.line2 + ' ' + this.city + ' ' + this.pin;
    const body: CustomerAddress = {
      customerTenantId: this.response.customerTenantId,
      customerName: this.response.customerName,
      customerContactNumber: this.response.customerPrimaryContactNo,
      customerAddressType: this.addressType,
      customerAddress: address,
      restaurantTenantId: this.response.restaurantTenantId,
      isDefaultAddress: 0
    };

    console.log(body);
    const loading = await this.presentLoading('Adding new address');
    try {
      loading.present();
      const res = await this.rest.addAddressData(body);
    } catch (err) {
      console.log(err);
    } finally {
      loading.dismiss();
      this.ngOnInit();
    }
  }

  async resetPrimary(address: CustomerAddress) {
    if (address.isDefaultAddress) {
      return;
    }
    this.response.customerAddressList.forEach(element => {
      element.isDefaultAddress = 0;
    });

    address.isDefaultAddress = 1;
    this.addressChanged = true;
    this.editableaddress[address.customerAddressType] = true;
  }

  async saveAddressChanges() {
    const loading = await this.presentLoading('Updating data');
    try {
      loading.present();
      this.response.customerAddressList.forEach(async element => {
        if (this.editableaddress[element.customerAddressType]) {
          console.log(element.customerAddress);
          await this.rest.addAddressData(element);
        }
      });
    } catch (er) {
      console.log(er);
    } finally {
      loading.dismiss();
    }
  }
  showAddAddressCard() {
    this.showNewAddressCard = true;
    this.line1 = '';
    this.line2 = '';
    this.city = '';
    this.pin = '';
    this.addressType = '';
  }
}
