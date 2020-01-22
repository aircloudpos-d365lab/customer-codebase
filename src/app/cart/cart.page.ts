import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../services/user-data.service';
import { MenuList } from '../models/RestaurantDetails';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
selectedItems: MenuList[];
price = 0;
totalCount = 0;
  constructor(private data: UserDataService) {
    this.selectedItems = this.data.getCartItems();
    this.selectedItems.forEach(element => {
      this.price += element.count * element.restaurantMenu.restaurantMenuFinalPrice;
      this.totalCount += element.count;
    });
  }

  changeItemCount(item: MenuList, count: number) {
    if (count === -1 && item.count === 0) {
      return;
    }
    item.count += count;
    this.totalCount += count;
    this.price += item.restaurantMenu.restaurantMenuFinalPrice * count;
  }
  ngOnInit() {
  }

}
