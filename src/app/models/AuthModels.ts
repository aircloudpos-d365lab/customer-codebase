export interface CustomerAddress {
customerTenantId: string;
customerName: string;
customerContactNumber: string;
customerAddressType: string;
customerAddress: string;
restaurantTenantId: string;
isDefaultAddress: number;
}

export interface CustomerDetails {
customerTenantId: string;
customerPrimaryContactNo: string;
customerName: string;
customerEmail: string;
customerAddressList: CustomerAddress[];
restaurantTenantId?: string;
}

export interface InfoAddBody {
customerAddress: string;
customerAddressType: string;
customerDeviceToken: string;
customerEmail: string;
customerId: number;
customerName: string;
customerPrimaryContactNo: string;
customerSecondaryContactNo: string;
customerTenantId: string;
restaurantTenantId: string;
isDefaultAddress: number;
}

export interface LoginBody {
    customerUsername: string;
    customerPassword: string;
    loggedInViaOauth: 0 | 1;
    customerTenantId: string;
    deviceToken: string;
    browserToken: string;
    loggedInAttemptViaBrowser: 0 | 1;
    loggedInAttemptViaApp: 0 | 1;
    restaurantTenantId: string;
}

export interface LoginResponse {
    customerLoginId: number;
    customerUsername: string;
    customerEncryptedPassword;
    customerSalt;
    customerTenantId;
    isOauthEnabled;
    isLoggedInThroughBrowser;
    isLoggedInThroughApp;
    customerLastLoggedInAt;
    customerDeviceTokenForApp;
}

