export interface InfoAddBody {
customerId: number;
customerTenantId: string;
customerPrimaryContactNo: string;
customerSecondaryContactNo: string;
customerName: string;
customerEmail: string;
customerAddressType: string;
customerAddress: string;
restaurantTenantId: string;
customerDeviceToken: string;
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