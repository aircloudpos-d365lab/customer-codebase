export interface CartMenuList {
cartMenuId: number;
cartId: number;
cartRestaurantMenuId: number;
cartRestaurantTenantId: string;
cartRestaurantMenuName: string;
cartRestaurantMenuDescription: string;
cartRestaurantMenuType: string;
cartRestaurantMenuCategory: string;
cartRestaurantMenuPhoto: string;
cartRestaurantMenuCustomization: string;
cartRestaurantMenuPrice: number;
cartRestaurantMenuPriceCgstPercentage: number;
cartRestaurantMenuPriceSgstPercentage: number;
cartRestaurantMenuRating: number;
cartRestaurantMenuFinalPrice: number;
cartRestaurantMenuQty: number;
}

export interface NewCart {
restaurantTenantId: string;
customerTenantId: string;
cartMenuList: CartMenuList[];
isOrderPlaced: number;
cartDeliveryFee: number;
cartItemPriceTotal: number;
cartTotalCgstPercentage: number;
cartTotalSgstPercentage: number;
cartTotal: number;
cartDiscountTotal: number;
cartGrandTotal: number;
couponAppliedOnCart: string;
}

