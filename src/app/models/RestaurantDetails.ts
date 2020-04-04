export interface RestaurantMenu {
restaurantMenuId: number;
restaurantTenantId: string;
restaurantMenuName: string;
restaurantMenuDescription: string;
restaurantMenuType: string;
restaurantMenuCategory: string;
restaurantMenuPhoto: string;
restaurantMenuPrice: number;
restaurantMenuPriceCgstPercentage: number;
restaurantMenuPriceSgstPercentage: number;
restaurantMenuRating: number;
restaurantMenuFinalPrice: number;
isMenuDisabled: number;
createdAt: string;
updatedAt: string;
}

export interface RestaurantMenuCustomizationList {
restaurantMenuCustomizationId: number;
restaurantTenantId: string;
restaurantMenuId: number;
restaurantMenuCustomizationDescription: string;
createdAt: string;
updatedAt: string;
}

export interface MenuList {
restaurantMenu: RestaurantMenu;
restaurantMenuCustomizationList: RestaurantMenuCustomizationList[];
count: number;
customisation: string;
}

export interface RestaurantPaymentOptionsList {
restaurantPaymentOptionId: number;
restaurantTenantId: string;
restaurantPaymentMode: string;
restaurantQr: string;
createdAt: string;
updatedAt: string;
}

export interface RestaurantDetailsResponse {
restaurantTenantId: string;
restaurantName: string;
restaurantEmail: string;
restaurantContactNo: string;
restaurantAddress: string;
restaurantPrimaryBankAccountNumber: string;
restaurantPrimaryBankAccountBankName: string;
restaurantPrimaryBankAccountHolderName: string;
restaurantPrimaryBankAccountIfsc: string;
restaurantSecondaryBankAccountNumber?: any;
restaurantSecondaryBankAccountBankName?: any;
restaurantSecondaryBankAccountHolderName?: any;
restaurantSecondaryBankAccountIfsc?: any;
restaurantLogo: string;
menuList: MenuList[];
restaurantPaymentOptionsList: RestaurantPaymentOptionsList[];
}