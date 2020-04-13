import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../services/user-data.service';
import { NavController, AlertController, Platform } from '@ionic/angular';
import { RestDataService } from '../services/rest-data.service';
import { RestaurantDetailsResponse, MenuList } from '../models/RestaurantDetails';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
subscription;
price = 0;
selectedItems: MenuList[] = [];
APP_NAME;
BRANCH;
detailsResponse: RestaurantDetailsResponse;
displayMenu: any = {};
categories: string[] = [];
searchVisible = false;
searchbarClass = 'hidden';
veg = false;
vegMenu: any = {};
originalMenu;
originalCategories;
searchVal; // used in html
searchItemText = 'search results';
showCurrentOrderBadge = false;
random = '';
errordisplay = false;
errormessage = '';
loadingmenu = false;
badgeCount = 0;
  constructor(public data: UserDataService,
              private navCtrl: NavController,
              private restServ: RestDataService,
              private alertController: AlertController,
              private platform: Platform) {}

  ngOnInit(): void {
    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    // Add 'implements OnInit' to the class.

    this.price = 0;
    this.selectedItems = [];
    this.searchVisible = false;
    this.searchbarClass = 'hidden';
    this.veg = false;

    this.APP_NAME = this.data.getAppName();
    this.setBranchNameForId(this.data.getSelectedBranchId());

    this.displayMenu = [];
    this.vegMenu = [];
    this.loadingmenu = true;
    this.restServ.getRestaurantDetails().subscribe(res => {
      this.loadingmenu = false;
      console.log(res);
      const result: any = res;
      this.data.setRestaurantPhoneNumber(result.restaurantContactNo);
      this.detailsResponse = result;
      const menu = this.detailsResponse.menuList;

      menu.forEach(item => {
        if (!this.displayMenu[item.restaurantMenu.restaurantMenuType]) {
          // console.log('pushing ' + item.restaurantMenu.restaurantMenuType);
          this.displayMenu[item.restaurantMenu.restaurantMenuType] = [];
        }

        item.count = 0;
        this.displayMenu[item.restaurantMenu.restaurantMenuType].push(item);

        if (item.restaurantMenu.restaurantMenuCategory === 'veg') {

          if (!this.vegMenu[item.restaurantMenu.restaurantMenuType]) {
            this.vegMenu[item.restaurantMenu.restaurantMenuType] = [];
          }

          item.count = 0;
          this.vegMenu[item.restaurantMenu.restaurantMenuType].push(item);
          }
      });

      this.categories = Object.keys(this.displayMenu);
      this.originalCategories = this.categories;
      console.log(this.displayMenu);
      this.originalMenu = this.displayMenu;
    });
    this.fetchCartDetailsFromServer();
  }

  async fetchCartDetailsFromServer() {
    try {
      const data = await this.restServ.fetchCartDetails();
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }

  async setBranchNameForId(id) {
    if (!id) {
      this.BRANCH = 'Select a branch';
      return;
    }
    try {
      const res: any = await this.restServ.getBranches();
      res.restaurantTenantList.forEach(element => {
        if (element.restaurantOutletTenantId === id) {
          this.BRANCH = element.restaurantOutletName;
        }
      });
    } catch (err) {
      this.BRANCH = 'Select a branch';
    }
  }

  clearCart() {
    this.selectedItems = [];
    this.price = 0;
    this.categories.forEach(element => {
      if (this.displayMenu[element]) {
        this.displayMenu[element].forEach(items => {
          items.count = 0;
        });
      }
    });
    this.updateBadge();
    console.log('cart cleared');
  }

  printUserData() {
    console.log(this.data.getUser());
  }

  getMenuSearch(key: string) {
    key = key.trim().toLowerCase();
    const res = [];
    console.log(this.displayMenu);
    this.originalCategories.forEach(element => {
      if (!this.displayMenu[element]) {
        return;
      }
      (this.displayMenu[element]).forEach(menuObject => {
        let name: string = menuObject.restaurantMenu.restaurantMenuName;
        name = name.toLowerCase();
        if (name.indexOf(key) > -1) {
          res.push(menuObject.restaurantMenu.restaurantMenuName + '/' + menuObject.restaurantMenu.restaurantMenuId);
        }
      });
    });
    console.log(res);
    return res;
  }

  async searchMenu($event) {
    this.errordisplay = false;
    const searchKey = $event.detail.value;

    if (searchKey === '') {
      this.categories = this.originalCategories;
      this.refreshMenu(false);
      return;
    }

    const response: any = this.getMenuSearch(searchKey);

    if (response.length === 0) {
      console.log('no matching items found!');
      this.errormessage = 'No Food items found';
      this.errordisplay = true;
    } else {
      this.errordisplay = false;
    }

    // console.log(response);
    const foodToDisplay = {};
    response.forEach(element => {
      const elem: any = element;
      let res: string = elem;

      res = res.split('/')[1];
      foodToDisplay[res] = 1;
    });

    // console.log(foodToDisplay);
    // console.log(this.displayMenu);
    this.filterMenu(foodToDisplay);
  }

  goToOrdersHistory() {
    this.navCtrl.navigateForward('/history');
  }


  filterMenu(food) {

    this.displayMenu = this.originalMenu;
    const results = [];

    this.originalCategories.forEach(element => {
      if (this.displayMenu[element]) {
        this.displayMenu[element].forEach(items => {
          // console.log(items.restaurantMenu.restaurantMenuId);
          if (food[items.restaurantMenu.restaurantMenuId]) {
            results.push(items);
          }
        });
      }
    });

    this.displayMenu[this.searchItemText] = results;
    if (results.length !== 0) {
      this.categories = [this.searchItemText];
    } else {
      this.categories = [];
    }
    // console.log(this.displayMenu);
  }

  async presentAlertRadio() {
    const data = [];
    try {
      const branches: any  = await this.restServ.getBranches();
      const curr = this.data.getSelectedBranchId();
      // console.log(branches);
      branches.restaurantTenantList.forEach(element => {
        const obj = {
          name: element.restaurantOutletName,
          type: 'radio',
          value: element.restaurantOutletTenantId,
          label: element.restaurantOutletName,
          checked: false
        };
        if (element.restaurantOutletTenantId === curr) {
          obj.checked = true;
        }
        data.push(obj);
      });
      const alert = await this.alertController.create({
        header: 'Select Branch',
        inputs: data,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              // console.log('Confirm Cancel');
            }
          }, {
            text: 'Ok',
            handler: (resData) => {
              // console.log(resData);
              if (resData !== curr) {
                this.data.setSelectedBranchId(resData);
                this.BRANCH = resData;
                this.ngOnInit();
              }
            }
          }
        ]
      });

      await alert.present();
    } catch (err) {
      console.log(err);
    }
  }

  changeItemCount(item: MenuList, count: number) {
    if (count === -1 && item.count === 0) {
      return;
    }
    item.count += count;
    this.price += item.restaurantMenu.restaurantMenuPrice * count;
    this.updateBadge();
  }

  updateBadge() {
    this.badgeCount = 0;
    if (!this.originalCategories) {
      return;
    }

    this.originalCategories.forEach(element => {
      if (this.displayMenu[element]) {
        this.displayMenu[element].forEach(items => {
          if (items.count > 0) {
            this.badgeCount++;
          }
        });
      }
    });
  }

  ionViewWillEnter() {
    this.selectedItems = this.data.getCartItems();
    if (!this.selectedItems || this.selectedItems.length === 0) {
      this.clearCart();
    }
    this.categories.forEach(element => {
      if (this.displayMenu[element]) {
        this.displayMenu[element].forEach(items => {
          if (items.count > 0) {
            this.selectedItems.forEach(selectedItem => {
              if (selectedItem.restaurantMenu.restaurantMenuId === items.restaurantMenu.restaurantMenuId) {
                items.count = selectedItem.count;
              }
            });
          }
        });
      }
    });

    this.price = 0;
    if (this.selectedItems) {
      this.selectedItems.forEach(element => {
        this.price += element.count * element.restaurantMenu.restaurantMenuPrice;
      });
    }
    this.updateBadge();
  }

  goToCart() {
    if (this.price === 0) {
      return;
    }
    this.selectedItems = [];
    this.categories.forEach(element => {
      if (this.displayMenu[element]) {
        this.displayMenu[element].forEach(items => {
          if (items.count > 0) {
            this.selectedItems.push(items);
          }
        });
      }
    });

    this.data.setCartItems(this.selectedItems);
    this.navCtrl.navigateForward('cart');
  }

  filterSearchResults() {
    if (this.searchVisible) {
      console.log('search is visible, filtering results');
      this.searchMenu({detail: {value: this.random}});
    } else {
      console.log('search is not visible');
    }
  }

  toggleSearch() {
    // console.log(this.random);
    this.searchVisible = !this.searchVisible;
    if (!this.searchVisible) {
      this.errordisplay = false;
      this.hideSearchbar();
      this.categories = this.originalCategories;
      this.refreshMenu(false);
    } else {
      this.random = '';
      this.searchbarClass = 'reveal';
      this.searchVal = '';
    }
  }

  hideSearchbar() {
    this.searchbarClass = 'hide';
    setTimeout(() => {
      this.searchbarClass = 'hidden';
    }, 700);
  }

  toggleVeg() {
    this.veg = !this.veg;
    this.refreshMenu(true);
    this.filterSearchResults();
  }

  refreshMenu(resetCount: boolean) {
    // do something
    const currentMenu = this.displayMenu;

    if (this.veg) {
      this.displayMenu = this.vegMenu;
    } else {
      this.displayMenu = this.originalMenu;
    }
    if (resetCount) {
      this.selectedItems = [];
      this.price = 0;
    }

    this.categories.forEach(element => {
      if (this.displayMenu[element]) {
        this.displayMenu[element].forEach(items => {

          if (resetCount) {
            items.count = 0;
            return;
          }

          if (currentMenu[this.searchItemText]) {
            currentMenu[this.searchItemText].forEach(elem => {
              if (elem.restaurantMenu.restaurantMenuId === items.restaurantMenu.restaurantMenuId) {
                items.count = elem.count;
              }
            });
          }
        });
      }
    });
    // console.log(this.displayMenu);
  }

  ionViewDidEnter() {
    this.subscription = this.platform.backButton.subscribe(() => {
        const app = 'app';
        navigator[app].exitApp();
    });
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  logOut() {
    this.data.logout();
    this.navCtrl.navigateRoot('authentication');
  }
}
