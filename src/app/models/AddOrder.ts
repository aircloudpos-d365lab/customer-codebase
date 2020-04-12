export interface NewOrder {
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
orderTotalCgst: number;
orderTotalSgst: number;
isOrderOutForDelivery: number;
isOrderCancelledByRestaurant: number;
isOrderCancelledByCustomer: number;
isOrderStartedPreparingByRestaurant: number;
orderAcceptedByRestaurantAt?: string;
}
