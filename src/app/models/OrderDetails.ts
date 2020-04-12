export interface RestaurantOrder {
restaurantOrderId: number;
restaurantTenantId: string;
cartId: number;
orderTotal: number;
orderDiscountTotal: number;
orderGrandTotal: number;
orderChannel: string;
orderPaymentMode: string;
orderSpecialInstructions: string;
orderAppliedCoupon: string;
customerTenantId: string;
orderInvoiceId: number;
orderDeliveryAddress: string;
isOrderAcceptedByRestaurant: number;
isOrderPreparedByRestaurant: number;
isOrderPaymentConfirmed: number;
isOrderDelivered: number;
restaurantOrderMode: string;
orderTotalCgstPercentage: number;
orderTotalSgstPercentage: number;
isOrderOutForDelivery: number;
isOrderCancelledByRestaurant: number;
isOrderCancelledByCustomer: number;
orderCancelledAt?: any;
orderAcceptedByRestaurantAt: string;
orderFoodReadyByRestaurantAt?: any;
orderOutForDeliveryByRestaurantAt?: any;
orderDeliveredAt?: any;
isOrderStartedPreparingByRestaurant: number;
orderStartedPreparingAt?: any;
orderDate: number;
cancellationReason?: any;
createdAt: string;
updatedAt: string;
}

export interface OrderMenuList {
cartMenuId: number;
cartId: number;
cartRestaurantMenuId?: any;
cartRestaurantTenantId: string;
cartRestaurantMenuName: string;
cartRestaurantMenuDescription: string;
cartRestaurantMenuType: string;
cartRestaurantMenuCategory: string;
cartRestaurantMenuPhoto: string;
cartRestaurantMenuCustomization?: any;
cartRestaurantMenuPrice: number;
cartRestaurantMenuPriceCgstPercentage: number;
cartRestaurantMenuPriceSgstPercentage: number;
cartRestaurantMenuRating: number;
cartRestaurantMenuFinalPrice: number;
cartRestaurantMenuQty: number;
cartRestaurantMenuIsDisabled?: any;
}

export interface RestaurantOrderOutputPayloadList {
restaurantOrder: RestaurantOrder;
orderMenuList: OrderMenuList[];
meta: OrderMetadata;
formattedList?: string;
}

export interface OrderMetadata {
stepCompleted: number;
progress: number;
acceptedAt: string;
preparingAt: string;
preparedAt: string;
outForDeliveryAt: string;
deliveredAt: string;
}

export interface OrderResponse {
restaurantOrderOutputPayloadList: RestaurantOrderOutputPayloadList[];
}
